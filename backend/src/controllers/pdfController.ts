import { Request, Response } from 'express';
import { generatePdfBuffer } from '../services/puppeteerService';

export const generatePdf = async (req: Request, res: Response) => {
  try {
    const { html } = req.body;

    if (!html) {
      res.status(400).json({ message: 'HTML content is required' });
      return; 
    }

    const pdfBuffer = await generatePdfBuffer(html);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};
