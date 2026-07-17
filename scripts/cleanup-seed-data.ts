import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '91ibblyw';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('ERROR: SANITY_WRITE_TOKEN is not set in your environment.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-01-01',
  useCdn: false,
  token,
});

async function cleanupData() {
  console.log('Fetching sample drafts to delete...');
  
  // CRITICAL: We MUST use an AND condition (&&) to ensure we ONLY delete
  // documents that are BOTH drafts AND have a title starting with "[SAMPLE]".
  // Wait, wait... `title` might not exist on all document types (e.g. obituary has `name`).
  // So we should check if title OR name matches "[SAMPLE]*", AND id matches "drafts.*"
  // Let's make the query robust.
  
  const query = `*[_id match "drafts.*" && (title match "[SAMPLE]*" || name match "[SAMPLE]*")]`;
  const docsToDelete = await client.fetch(query);
  
  if (docsToDelete.length === 0) {
    console.log('No sample drafts found to delete.');
    return;
  }
  
  console.log(`Found ${docsToDelete.length} sample documents to delete.`);
  
  const transaction = client.transaction();
  docsToDelete.forEach((doc: any) => {
    transaction.delete(doc._id);
  });
  
  try {
    await transaction.commit();
    console.log(`Successfully deleted ${docsToDelete.length} sample documents.`);
  } catch (err) {
    console.error('Failed to delete sample documents:', err);
  }
}

cleanupData().catch(console.error);
