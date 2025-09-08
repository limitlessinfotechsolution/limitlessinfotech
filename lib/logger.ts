import fs from 'fs/promises';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'error.log');

export async function logError(error: unknown) {
  const timestamp = new Date().toISOString();
  const errorMessage = `${timestamp} - ${error instanceof Error ? error.stack : String(error)}\n`;
  try {
    await fs.appendFile(logFilePath, errorMessage);
  } catch {
    // Log file write failed - silently handle
  }
}
