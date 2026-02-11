import puppeteer from 'puppeteer';

export const generatePdfBuffer = async (html: string): Promise<Buffer> => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Safer for containerized/local envs
    });

    const page = await browser.newPage();
    
    // Set content and wait for network idle to ensure assets load
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('Puppeteer generation error:', error);
    throw new Error('PDF generation failed');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
