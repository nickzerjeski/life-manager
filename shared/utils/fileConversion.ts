import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

/**
 * Extracts text content from a PDF binary.
 * @param binary - PDF binary data as Buffer or String.
 * @returns Extracted text content.
 */
export async function extractPdfContent(binary: Buffer | string): Promise<string> {
  try {
    const buffer = Buffer.isBuffer(binary) ? binary : Buffer.from(binary, "base64");
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting PDF content:", error);
    return "";
  }
}