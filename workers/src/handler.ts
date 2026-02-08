import { APIGatewayProxyHandler } from 'aws-lambda';
import { generatePdfFromHtml } from './utils/pdf';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { html } = body;

    if (!html) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'HTML content is required' }),
      };
    }

    const pdfBuffer = await generatePdfFromHtml(html);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
      body: pdfBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: (error as Error).message }),
    };
  }
};
