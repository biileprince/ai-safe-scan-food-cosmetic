import { Client, Databases, Storage } from 'node-appwrite';

export function getAppwriteClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const storage = new Storage(client);

  return { client, databases, storage };
}
