import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { memoryDrafts, MemoryDraft } from '@/lib/memoryDrafts';
import { ObjectId } from 'mongodb';

interface ParsedRow {
  rowIndex: number;
  title: string;
  city: string;
  locality: string;
  fullAddress: string;
  type: string;
  sharing: string;
  suitableFor: string;
  rent: number;
  deposit: number;
  name: string;
  phone: string;
  amenities: string[];
  isValid: boolean;
  errors: string[];
  isDuplicate: boolean;
  propertyId?: string;
}

function parseCSV(content: string): string[][] {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuote = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      if (currentRow.some((f) => f.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      lines.push(currentRow);
    }
  }

  return lines;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const ownerId = session.userId || `bulk_owner_${Date.now()}`;

    const contentType = req.headers.get('content-type') || '';
    let csvText = '';
    let dryRun = false;

    if (contentType.includes('application/json')) {
      const json = await req.json();
      csvText = json.csvText || '';
      dryRun = !!json.dryRun;
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: { code: 'NO_FILE', message: 'No CSV file provided.' } }, { status: 400 });
      }
      csvText = await file.text();
      dryRun = formData.get('dryRun') === 'true';
    } else {
      csvText = await req.text();
    }

    if (!csvText.trim()) {
      return NextResponse.json({ error: { code: 'EMPTY_FILE', message: 'CSV content is empty.' } }, { status: 400 });
    }

    const rows = parseCSV(csvText);
    if (rows.length < 2) {
      return NextResponse.json(
        { error: { code: 'NO_DATA', message: 'CSV must contain at least a header row and one property row.' } },
        { status: 400 }
      );
    }

    // Process rows (skipping header)
    const parsedRows: ParsedRow[] = [];
    const seenPhonesAndTitles = new Set<string>();

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const title = r[0] || '';
      const city = r[1] || 'Noida';
      const locality = r[2] || '';
      const fullAddress = r[3] || '';
      const type = r[4] || 'PG';
      const sharing = r[5] || 'Single';
      const suitableFor = r[6] || 'Boys';
      const rent = parseInt(r[7]?.replace(/[^0-9]/g, '') || '0', 10);
      const deposit = parseInt(r[8]?.replace(/[^0-9]/g, '') || '0', 10) || rent;
      const name = r[9] || session.name || 'Property Partner';
      const rawPhone = r[10] || session.phone || '';
      const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
      const rawAmenities = r[11] || '';
      const amenities = rawAmenities
        .split(/[;,]/)
        .map((a) => a.trim())
        .filter(Boolean);

      const errors: string[] = [];
      if (!title) errors.push('Property title is missing');
      if (!locality) errors.push('Locality is missing');
      if (rent <= 0) errors.push('Monthly rent must be greater than 0');
      if (cleanPhone.length !== 10) errors.push('Valid 10-digit mobile number required');

      // Duplicate check within file and against memoryDrafts
      const comboKey = `${cleanPhone}_${title.toLowerCase()}_${locality.toLowerCase()}`;
      let isDuplicate = false;

      if (seenPhonesAndTitles.has(comboKey)) {
        isDuplicate = true;
        errors.push('Duplicate entry inside this file');
      } else {
        seenPhonesAndTitles.add(comboKey);
      }

      const existingDup = memoryDrafts.find(
        (d) =>
          d.title?.toLowerCase() === title.toLowerCase() &&
          d.locality?.toLowerCase() === locality.toLowerCase() &&
          d.phone?.includes(cleanPhone)
      );

      if (existingDup) {
        isDuplicate = true;
        errors.push(`Already registered in system (ID: ${existingDup.propertyId || existingDup._id})`);
      }

      const cleanCityPrefix = city.slice(0, 3).toUpperCase() || 'NOI';
      const propertyId = `F2S-${cleanCityPrefix}-${Math.floor(10000 + Math.random() * 90000)}`;

      parsedRows.push({
        rowIndex: i + 1,
        title,
        city,
        locality,
        fullAddress,
        type,
        sharing,
        suitableFor,
        rent,
        deposit,
        name,
        phone: cleanPhone ? `+91${cleanPhone}` : rawPhone,
        amenities,
        isValid: errors.length === 0,
        errors,
        isDuplicate,
        propertyId,
      });
    }

    const validRows = parsedRows.filter((r) => r.isValid);
    const failedRows = parsedRows.filter((r) => !r.isValid);

    // If dry run, just return preview validation report
    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        totalRows: parsedRows.length,
        validCount: validRows.length,
        failedCount: failedRows.length,
        rows: parsedRows,
      });
    }

    // Commit mode: persist valid rows
    let importedCount = 0;
    const importedIds: string[] = [];

    let db: any = null;
    try {
      db = await getDb();
    } catch {}

    for (const v of validRows) {
      const draftId = new ObjectId().toString();
      const draftRecord: MemoryDraft = {
        _id: draftId,
        propertyId: v.propertyId,
        ownerId: ownerId.toString(),
        name: v.name,
        phone: v.phone,
        userType: 'Broker / Property Dealer',
        authorisationConfirmed: true,
        title: v.title,
        locality: v.locality,
        city: v.city,
        fullAddress: v.fullAddress,
        type: v.type,
        sharing: v.sharing,
        suitableFor: v.suitableFor,
        rent: v.rent,
        deposit: v.deposit,
        amenities: v.amenities.length > 0 ? v.amenities : ['Wi-Fi', 'Power Backup', 'RO Water'],
        status: 'SUBMITTED',
        availabilityStatus: 'AVAILABLE',
        createdAt: new Date(),
      };

      memoryDrafts.unshift(draftRecord);
      importedIds.push(v.propertyId!);
      importedCount++;

      if (db) {
        try {
          await db.collection('drafts').insertOne({
            ...draftRecord,
            _id: new ObjectId(draftId),
          });
        } catch {}
      }
    }

    return NextResponse.json({
      success: true,
      dryRun: false,
      totalRows: parsedRows.length,
      importedCount,
      failedCount: failedRows.length,
      importedPropertyIds: importedIds,
      failedRows: failedRows.map((f) => ({
        rowIndex: f.rowIndex,
        title: f.title,
        errors: f.errors,
      })),
      message: `Successfully imported ${importedCount} properties! ${failedRows.length > 0 ? `${failedRows.length} rows had errors.` : 'All rows verified.'}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: { code: 'BULK_UPLOAD_FAILED', message: (err as Error).message } },
      { status: 500 }
    );
  }
}
