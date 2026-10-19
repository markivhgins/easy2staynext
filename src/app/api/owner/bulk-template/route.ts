import { NextResponse } from 'next/server';

export async function GET() {
  const csvHeaders = [
    'Property Title',
    'City',
    'Locality / Sector',
    'Full Address',
    'Property Type',
    'Sharing',
    'Suitable For',
    'Monthly Rent',
    'Security Deposit',
    'Owner / Broker Name',
    'Mobile Number',
    'Amenities',
  ];

  const sampleRows = [
    [
      'Aura Green Executive PG',
      'Noida',
      'Sector 62',
      'C-25, Block C, Near Electronic City Metro',
      'PG',
      'Single',
      'Boys',
      '9500',
      '9500',
      'Sunil Kumar',
      '9811223344',
      'Wi-Fi;AC;Power Backup;RO Water;Geyser',
    ],
    [
      'Silicon City High-Rise Flat',
      'Noida',
      'Sector 76',
      'Tower 4, Flat 902, Silicon City',
      'Flat',
      'Entire Flat',
      'Family',
      '26000',
      '26000',
      'Anil Tandon',
      '9822334455',
      'Lift;Parking;Wi-Fi;Power Backup;Security',
    ],
  ];

  const csvContent =
    csvHeaders.join(',') +
    '\n' +
    sampleRows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="find2stay_bulk_properties_template.csv"',
    },
  });
}
