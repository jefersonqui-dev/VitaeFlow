import express from 'express';
import { handler } from './handler';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/generate-pdf', async (req, res) => {
  // Mock API Gateway event
  const event: any = {
    body: JSON.stringify(req.body),
  };

  const result: any = await handler(event, {} as any, {} as any);

  if (result.headers) {
    Object.keys(result.headers).forEach((key) => {
      res.setHeader(key, result.headers[key]);
    });
  }

  const body = result.isBase64Encoded 
    ? Buffer.from(result.body, 'base64') 
    : result.body;

  res.status(result.statusCode).send(body);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Worker (Local PDF Service) running on port ${PORT}`);
  console.log(`Use POST http://localhost:${PORT}/generate-pdf with { "html": "..." }`);
});
