/**
 * SafeScan — Database Setup Script
 * 
 * Run with: node scripts/setup-db.js
 * 
 * Creates the scan_reports collection and attributes.
 */

const { Client, Databases } = require('node-appwrite');

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '6a8b501c000c7f0210e6';
const API_KEY = process.env.APPWRITE_API_KEY || '';

const DB_ID = 'safescan_db';
const REPORTS_COLLECTION = 'scan_reports';

async function main() {
  if (!API_KEY) {
    console.error('❌ APPWRITE_API_KEY is required.');
    process.exit(1);
  }

  const client = new Client();
  client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
  const databases = new Databases(client);

  console.log(`\n🌱 SafeScan DB Setup`);

  // Create scan_reports Collection
  try {
    await databases.getCollection(DB_ID, REPORTS_COLLECTION);
    console.log(`  ✅ Collection ${REPORTS_COLLECTION} exists`);
  } catch (err) {
    if (err.code === 404) {
      console.log(`  🔨 Creating Collection ${REPORTS_COLLECTION}...`);
      await databases.createCollection(DB_ID, REPORTS_COLLECTION, 'Scan Reports');
      
      console.log(`  🔨 Creating Attributes...`);
      await databases.createStringAttribute(DB_ID, REPORTS_COLLECTION, 'userId', 255, true);
      await databases.createStringAttribute(DB_ID, REPORTS_COLLECTION, 'imageFileId', 255, true);
      await databases.createStringAttribute(DB_ID, REPORTS_COLLECTION, 'status', 50, true);
      await databases.createStringAttribute(DB_ID, REPORTS_COLLECTION, 'productName', 255, false);
      await databases.createStringAttribute(DB_ID, REPORTS_COLLECTION, 'productCategory', 255, false);
      await databases.createFloatAttribute(DB_ID, REPORTS_COLLECTION, 'ocrConfidence', false);
      await databases.createFloatAttribute(DB_ID, REPORTS_COLLECTION, 'matchConfidence', false);
      await databases.createStringAttribute(DB_ID, REPORTS_COLLECTION, 'overallAssessment', 255, false);
      await databases.createStringAttribute(DB_ID, REPORTS_COLLECTION, 'benefits', 4096, false);
      await databases.createStringAttribute(DB_ID, REPORTS_COLLECTION, 'concerns', 4096, false);
      await databases.createStringAttribute(DB_ID, REPORTS_COLLECTION, 'allergenFlags', 255, false, undefined, true); // array
      await databases.createStringAttribute(DB_ID, REPORTS_COLLECTION, 'explanationText', 4096, false);
      await databases.createDatetimeAttribute(DB_ID, REPORTS_COLLECTION, 'createdAt', true);
      
      console.log(`  ⏳ Waiting 5 seconds for attributes...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      throw err;
    }
  }

  console.log(`\n🎉 DB Setup Complete!\n`);
}

main().catch(console.error);
