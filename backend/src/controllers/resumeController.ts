import { Request, Response } from 'express';
import Resume from '../models/Resume';
import { generateResumeHtml } from '../utils/htmlGenerator';
import { requestPdfGeneration } from '../services/pdfService';

interface AuthRequest extends Request {
  user?: any;
}

export const createResume = async (req: AuthRequest, res: Response) => {
  try {
    const resume = await Resume.create({
      userId: req.user.id,
      ...req.body
    });
    res.status(201).json(resume);
  } catch (error) {
    res.status(400).json({ message: 'Error creating resume' });
  }
};

export const getResumes = async (req: AuthRequest, res: Response) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes' });
  }
};

export const getResumeById = async (req: AuthRequest, res: Response) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (resume && resume.userId.toString() === req.user.id) {
      res.json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume' });
  }
};

export const updateResume = async (req: AuthRequest, res: Response) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (resume && resume.userId.toString() === req.user.id) {
      const updatedResume = await Resume.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedResume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating resume' });
  }
};

export const downloadResumePdf = async (req: AuthRequest, res: Response) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume || resume.userId.toString() !== req.user.id) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    // 1. Generate HTML
    const html = generateResumeHtml(resume);

    // 2. Request PDF from Worker
    const pdfBuffer = await requestPdfGeneration(html);

    // 3. Send PDF to client
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resume-${resume._id}.pdf"`,
      'Content-Length': pdfBuffer.length
    });
    
    res.send(pdfBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};
