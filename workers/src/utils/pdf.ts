import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const generatePdfFromHtml = async (html: string): Promise<Buffer> => {
  let browser;
  
  try {
    // Determine if running locally or in Lambda
    const isLocal = process.env.IS_LOCAL === 'true';
    
    const executablePath = isLocal 
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // Adjust for your OS if needed, or use a specific local path
      : await chromium.executablePath();

    browser = await puppeteer.launch({
      args: isLocal ? [] : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath || undefined,
      headless: isLocal ? 'new' : chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    
    // Set content and wait for network idle to ensure assets load
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Generate PDF (A4 format)
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm',
      },
    });

    return Buffer.from(pdf);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
