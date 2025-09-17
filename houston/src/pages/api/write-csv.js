import fs from 'fs';
import path from 'path';
import os from 'os';
import { parse } from 'json2csv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      for (let file of req.body) {
        const filePath = path.join(os.homedir(), 'Documents', 'HoustonCaptures', file.fp);
        const csv = parse(file.data);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, csv);
      }
      res.status(200).json({ message: 'CSV file(s) created successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create CSV file(s).' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
