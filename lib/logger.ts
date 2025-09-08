import fs from 'fs/promises';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'error.log');

export async function logError(error: any) {
  const timestamp = new Date().toISOString();
  const errorMessage = `${timestamp} - ${error.stack || error}\n`;
  try {
    await fs.appendFile(logFilePath, errorMessage);
  } catch (err) {
    // Log file write failed - silently handle
  }
}
