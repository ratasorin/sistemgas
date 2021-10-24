// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';

type Data = {
    textByLine: string[]
}

const Path = path.join(process.cwd(), "/pages/api/TOD.txt");
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    
    const text = fs.readFileSync(`${Path}`, 'utf-8');
    const textByLine = text.split('\n') 
    res.status(200).json({ textByLine })
}

