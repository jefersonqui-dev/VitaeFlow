import axios from 'axios';

const WORKER_URL = process.env.WORKER_URL || 'http://localhost:4000';

export const requestPdfGeneration = async (html: string): Promise<Buffer> => {
  try {
    const response = await axios.post(
      `${WORKER_URL}/generate-pdf`,
      { html },
      {
        responseType: 'arraybuffer', // Important to handle binary data
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error requesting PDF from worker:', error);
    throw new Error('Failed to generate PDF');
  }
};
