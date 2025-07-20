import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';

const mistralClient = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY!
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const packingList = formData.get('packingList') as File;
    const invoice = formData.get('invoice') as File;

    if (!packingList || !invoice) {
      return NextResponse.json(
        { error: 'Both documents are required' },
        { status: 400 }
      );
    }

    // Validate file sizes (50MB limit per Mistral API docs)
    if (packingList.size > 50 * 1024 * 1024 || invoice.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must not exceed 50MB' },
        { status: 400 }
      );
    }

    // Convert files to base64
    const [packingListBase64, invoiceBase64] = await Promise.all([
      fileToBase64(packingList),
      fileToBase64(invoice)
    ]);

    // Process both documents with Mistral OCR
    const [packingListOCR, invoiceOCR] = await Promise.all([
      processWithOCR(packingListBase64, packingList.type),
      processWithOCR(invoiceBase64, invoice.type)
    ]);

    return NextResponse.json({
      packingListText: packingListOCR,
      invoiceText: invoiceOCR
    });

  } catch (error) {
    console.error('OCR processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process documents' },
      { status: 500 }
    );
  }
}

async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  return Buffer.from(bytes).toString('base64');
}

async function processWithOCR(base64: string, mimeType: string) {
  const isPDF = mimeType.includes('pdf');
  
  // Based on mistral.md documentation, use the correct format for base64 data URLs
  const dataUrl = isPDF 
    ? `data:application/pdf;base64,${base64}`
    : `data:${mimeType};base64,${base64}`;

  const response = await mistralClient.ocr.process({
    model: 'mistral-ocr-latest',
    document: isPDF ? {
      type: 'document_url',
      documentUrl: dataUrl
    } : {
      type: 'image_url',
      imageUrl: dataUrl
    },
    includeImageBase64: false // We only need the text extraction
  });

  // Handle OCR response - the actual structure may vary
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (response as any).content || (response as any).text || JSON.stringify(response);
}