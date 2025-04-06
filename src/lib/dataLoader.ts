import fs from 'fs';
import path from 'path';

export function loadJSONFile(fileName: string) {
    console.log(process.cwd());
  const filePath = path.join(process.cwd(), 'src', 'data', fileName);
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(jsonData);
}
