import { Client, Databases, Storage } from 'node-appwrite';

export function getAppwriteClient() {
  const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_FUNCTION_API_KEY || process.env.APPWRITE_API_KEY;

  if (!projectId) {
    throw new Error('Missing APPWRITE_FUNCTION_PROJECT_ID or APPWRITE_PROJECT_ID');
  }
  if (!apiKey) {
    throw new Error('Missing APPWRITE_FUNCTION_API_KEY or APPWRITE_API_KEY');
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  const databases = new Databases(client);
  const storage = new Storage(client);

  return { client, databases, storage };
}