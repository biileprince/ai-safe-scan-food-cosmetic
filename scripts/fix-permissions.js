const { Client, Databases, Permission, Role } = require('node-appwrite');

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '6a8b501c000c7f0210e6';
const API_KEY = process.env.APPWRITE_API_KEY || '';

const DB_ID = 'safescan_db';
const REPORTS_COLLECTION = 'scan_reports';

async function main() {
  if (!API_KEY) {
    console.error('APPWRITE_API_KEY is required.');
    process.exit(1);
  }

  const client = new Client();
  client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
  const databases = new Databases(client);

  try {
    console.log('Updating permissions for scan_reports...');
    await databases.updateCollection(
      DB_ID,
      REPORTS_COLLECTION,
      'Scan Reports',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );
    console.log('Permissions updated successfully! Users can now read/write their reports.');
  } catch (err) {
    console.error('Failed to update permissions:', err.message);
  }
}
main();
