/**
 * db.ts — MongoDB client with strict Atlas / MongoDB readiness check.
 */

import { MongoClient, Db, IndexDescription } from 'mongodb';
import { config } from './config';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

const mongoOptions = {
  serverSelectionTimeoutMS: 3000,
  connectTimeoutMS: 3000,
};

if (config.nodeEnv === 'development') {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(config.mongodbUri, mongoOptions);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(config.mongodbUri, mongoOptions);
  clientPromise = client.connect();
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(config.dbName);
}

/**
 * Confirms database is reachable. Throws on failure.
 */
export async function checkReady(): Promise<boolean> {
  const db = await getDb();
  await db.command({ ping: 1 });
  return true;
}

/**
 * Idempotent index initialization
 */
export async function ensureIndexes(): Promise<void> {
  const db = await getDb();

  // Users
  await db.collection('users').createIndexes([
    { key: { phoneE164: 1 }, unique: true, name: 'users_phone_unique' },
    { key: { status: 1 }, name: 'users_status' },
  ] as IndexDescription[]);

  // Auth Challenges with TTL
  await db.collection('authChallenges').createIndexes([
    { key: { phone: 1 }, name: 'challenges_phone' },
    { key: { requestId: 1 }, unique: true, name: 'challenges_requestId_unique' },
    { key: { expiresAt: 1 }, expireAfterSeconds: 0, name: 'challenges_ttl' },
  ] as IndexDescription[]);

  // Listings
  await db.collection('listings').createIndexes([
    { key: { slug: 1 }, unique: true, name: 'listings_slug_unique' },
    { key: { locationPrivate: '2dsphere' }, name: 'listings_geo' },
    { key: { status: 1, city: 1, entryPoints: 1, accommodationType: 1 }, name: 'listings_search' },
    { key: { status: 1, 'availability.confirmedAt': -1 }, name: 'listings_freshness' },
    { key: { ownerId: 1 }, name: 'listings_owner' },
  ] as IndexDescription[]);

  // Revisions & Cases
  await db.collection('listingRevisions').createIndexes([
    { key: { listingId: 1, revisionNo: 1 }, unique: true, name: 'revs_unique' },
  ] as IndexDescription[]);

  // Enquiries & Visits
  await db.collection('enquiries').createIndexes([
    { key: { idempotencyKey: 1 }, unique: true, name: 'enquiries_idempotency_unique' },
    { key: { userId: 1, createdAt: -1 }, name: 'enquiries_user' },
  ] as IndexDescription[]);

  // Saved Listings
  await db.collection('savedListings').createIndexes([
    { key: { userId: 1, listingId: 1 }, unique: true, name: 'saved_user_listing_unique' },
  ] as IndexDescription[]);

  console.log('[db] Indexes ensured successfully.');
}
