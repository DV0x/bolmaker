import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { BOLData } from '@/types/bol';

export async function POST(request: NextRequest) {
  let browser;
  
  try {
    const { bolData } = await request.json();

    // Validate input data
    if (!bolData) {
      return NextResponse.json(
        { error: 'BOL data is required' },
        { status: 400 }
      );
    }


    // Generate HTML directly
    const templateHtml = generateBOLHtml(bolData as BOLData);

    // Create complete HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bill of Lading - ${bolData.bolNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              line-height: 1.4;
              color: #000;
              background: #fff;
            }
            
            .bill-of-lading {
              width: 8.5in;
              min-height: 11in;
              margin: 0 auto;
              padding: 0.5in;
              font-size: 12px;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              
              .bill-of-lading {
                margin: 0;
                padding: 0.5in;
              }
            }
            
            @page {
              size: letter;
              margin: 0.5in;
            }
          </style>
        </head>
        <body>
          ${templateHtml}
        </body>
      </html>
    `;

    // Launch Puppeteer with Vercel-compatible configuration
    const isLocal = process.env.NODE_ENV === 'development';
    
    browser = await puppeteer.launch({
      args: isLocal ? ['--no-sandbox', '--disable-setuid-sandbox'] : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: isLocal ? undefined : await chromium.executablePath(),
      headless: chromium.headless === 'new' ? true : chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    
    // Set content and wait for it to load
    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF with specific options for bill of lading
    const pdfBuffer = await page.pdf({
      format: 'letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      preferCSSPageSize: true
    });

    // Close browser
    await browser.close();

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="BOL-${bolData.bolNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    
    // Ensure browser is closed even if there's an error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    // Provide specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Failed to launch')) {
        return NextResponse.json(
          { error: 'PDF generation service unavailable' },
          { status: 503 }
        );
      }
      if (error.message.includes('Navigation')) {
        return NextResponse.json(
          { error: 'Failed to render PDF content' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function generateBOLHtml(data: BOLData): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeGet = (value: any) => value || 'N/A';
  
  return `
    <div class="bill-of-lading" style="
      font-family: Arial, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #000;
      background-color: #fff;
      padding: 20px;
      width: 8.5in;
      min-height: 11in;
      margin: 0 auto;
    ">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 5px 0;">
          BILL OF LADING
        </h1>
        <p style="font-size: 14px; margin: 0;">
          (To be used only for shipments by motor vehicle)
        </p>
      </div>

      <!-- BOL Number and Date -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
        <div style="border: 1px solid #000; padding: 8px; width: 200px;">
          <strong>BOL Number:</strong><br />
          ${safeGet(data.bolNumber)}
        </div>
        <div style="border: 1px solid #000; padding: 8px; width: 150px;">
          <strong>Date:</strong><br />
          ${safeGet(data.date)}
        </div>
        <div style="border: 1px solid #000; padding: 8px; width: 200px;">
          <strong>Tracking Number:</strong><br />
          ${safeGet(data.trackingNumber)}
        </div>
      </div>

      <!-- Shipper and Consignee -->
      <div style="display: flex; margin-bottom: 15px; gap: 10px;">
        <div style="flex: 1; border: 1px solid #000; padding: 10px;">
          <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; background-color: #f0f0f0; padding: 5px;">
            SHIPPER (FROM)
          </h3>
          <div style="line-height: 1.6;">
            <strong>${safeGet(data.shipper?.name)}</strong><br />
            ${safeGet(data.shipper?.address)}<br />
            ${safeGet(data.shipper?.city)}, ${safeGet(data.shipper?.state)} ${safeGet(data.shipper?.zip)}<br />
            Phone: ${safeGet(data.shipper?.phone)}
          </div>
        </div>
        <div style="flex: 1; border: 1px solid #000; padding: 10px;">
          <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; background-color: #f0f0f0; padding: 5px;">
            CONSIGNEE (TO)
          </h3>
          <div style="line-height: 1.6;">
            <strong>${safeGet(data.consignee?.name)}</strong><br />
            ${safeGet(data.consignee?.address)}<br />
            ${safeGet(data.consignee?.city)}, ${safeGet(data.consignee?.state)} ${safeGet(data.consignee?.zip)}<br />
            Phone: ${safeGet(data.consignee?.phone)}
          </div>
        </div>
      </div>

      <!-- Carrier Information -->
      <div style="border: 1px solid #000; padding: 10px; margin-bottom: 15px;">
        <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; background-color: #f0f0f0; padding: 5px;">
          CARRIER INFORMATION
        </h3>
        <div style="display: flex; gap: 20px;">
          <div><strong>Carrier Name:</strong> ${safeGet(data.carrier?.name)}</div>
          <div><strong>PRO Number:</strong> ${safeGet(data.carrier?.proNumber)}</div>
          <div><strong>Trailer:</strong> ${safeGet(data.carrier?.trailer)}</div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 15px;">
        <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; background-color: #f0f0f0; padding: 5px;">
          ITEMS/COMMODITIES
        </h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px;">QTY</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px;">DESCRIPTION</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px;">WEIGHT (lbs)</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px;">CLASS</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px;">NMFC</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px;">HAZMAT</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px;">VALUE ($)</th>
            </tr>
          </thead>
          <tbody>
            ${(data.items || []).map(item => `
              <tr>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px;">${safeGet(item?.quantity)}</td>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px;">${safeGet(item?.description)}</td>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px; text-align: right;">${safeGet(item?.weight)}</td>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px;">${safeGet(item?.class)}</td>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px;">${item?.nmfc || 'N/A'}</td>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px; text-align: center;">
                  ${item?.hazmat ? 'YES' : 'NO'}
                </td>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px; text-align: right;">
                  $${(item?.value || 0).toFixed(2)}
                </td>
              </tr>
            `).join('')}
            ${Array.from({ length: Math.max(0, 5 - (data.items || []).length) }).map(() => `
              <tr>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px; height: 30px;">&nbsp;</td>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px;">&nbsp;</td>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px;">&nbsp;</td>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px;">&nbsp;</td>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px;">&nbsp;</td>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px;">&nbsp;</td>
                <td style="border: 1px solid #000; padding: 6px; font-size: 11px;">&nbsp;</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
        <div style="border: 1px solid #000; padding: 10px; width: 200px;">
          <strong>Total Weight (lbs):</strong><br />
          ${safeGet(data.totalWeight)}
        </div>
        <div style="border: 1px solid #000; padding: 10px; width: 200px;">
          <strong>Total Value ($):</strong><br />
          $${(data.items || []).reduce((sum, item) => sum + (item?.value || 0), 0).toFixed(2)}
        </div>
        <div style="border: 1px solid #000; padding: 10px; width: 200px;">
          <strong>Total Pieces:</strong><br />
          ${(data.items || []).reduce((sum, item) => sum + (item?.quantity || 0), 0)}
        </div>
      </div>

      <!-- Special Instructions -->
      ${data.specialInstructions ? `
        <div style="border: 1px solid #000; padding: 10px; margin-bottom: 15px;">
          <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; background-color: #f0f0f0; padding: 5px;">
            SPECIAL INSTRUCTIONS
          </h3>
          <p style="margin: 0; font-size: 11px;">${safeGet(data.specialInstructions)}</p>
        </div>
      ` : ''}

      <!-- Terms and Conditions -->
      <div style="border: 1px solid #000; padding: 10px; margin-bottom: 15px; font-size: 10px;">
        <h3 style="font-size: 12px; font-weight: bold; margin: 0 0 8px 0;">
          TERMS AND CONDITIONS
        </h3>
        <p style="margin: 0 0 5px 0;">
          This shipment is subject to the terms and conditions of the Uniform Straight Bill of Lading set forth in the current National Motor Freight Classification.
        </p>
        <p style="margin: 0;">
          The carrier acknowledges receipt of packages and contents thereof as described above in apparent good order, except as noted.
        </p>
      </div>

      <!-- Signature Section -->
      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <div style="flex: 1; border: 1px solid #000; padding: 15px; min-height: 80px;">
          <strong>SHIPPER SIGNATURE:</strong><br /><br />
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;">&nbsp;</div>
          <small>Date: ___________</small>
        </div>
        <div style="flex: 1; border: 1px solid #000; padding: 15px; min-height: 80px;">
          <strong>CARRIER SIGNATURE:</strong><br /><br />
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;">&nbsp;</div>
          <small>Date: ___________</small>
        </div>
        <div style="flex: 1; border: 1px solid #000; padding: 15px; min-height: 80px;">
          <strong>CONSIGNEE SIGNATURE:</strong><br /><br />
          <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;">&nbsp;</div>
          <small>Date: ___________</small>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 20px; font-size: 10px; color: #666;">
        <p style="margin: 0;">
          Generated on ${new Date().toLocaleDateString()} • BOL Generator v1.0
        </p>
      </div>
    </div>
  `;
}