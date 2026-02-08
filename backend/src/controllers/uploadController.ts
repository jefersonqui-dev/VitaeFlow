import { Request, Response } from 'express';
import { generatePresignedUploadUrl } from '../services/s3Service';

interface AuthRequest extends Request {
  user?: any;
}

export const getUploadUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { fileType, folder } = req.body;

    if (!fileType) {
      res.status(400).json({ message: 'File type is required' });
      return;
    }

    // Security check: Only allow image types for profile pictures
    if (!fileType.startsWith('image/')) {
      res.status(400).json({ message: 'Only images are allowed' });
      return;
    }

    const { uploadUrl, publicUrl, key } = await generatePresignedUploadUrl(
      fileType, 
      folder || `users/${req.user.id}/profile`
    );

    res.json({ uploadUrl, publicUrl, key });
  } catch (error) {
    console.error('S3 Presigned URL Error:', error);
    res.status(500).json({ message: 'Error generating upload URL' });
  }
};

export const uploadLocalFile = (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    // Construct public URL for the uploaded file
    // Assuming 'uploads' folder is served statically at root level or /uploads
    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({ 
      message: 'File uploaded successfully',
      publicUrl,
      key: req.file.filename
    });
  } catch (error) {
    console.error('Local Upload Error:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};
