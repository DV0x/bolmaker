# Bill of Lading Generator - Detailed Step-by-Step Implementation

## Step 1: Install All Dependencies

```bash
npm install @mistralai/mistralai puppeteer react-dropzone openai framer-motion react-hot-toast
npm install --save-dev @types/puppeteer
```

## Step 2: Create Environment Variables

Create `.env.local`:
```env
MISTRAL_API_KEY=your_mistral_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

## Step 3: Create Type Definitions

Create `app/types/bol.ts`:
```typescript
export interface BOLData {
  bolNumber: string;
  date: string;
  trackingNumber: string;
  totalWeight: number;

  shipper: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };

  consignee: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };

  carrier: {
    name: string;
    proNumber: string;
    trailer: string;
  };

  items: Array<{
    quantity: number;
    description: string;
    weight: number;
    class: string;
    nmfc?: string;
    hazmat: boolean;
    value: number;
  }>;

  specialInstructions?: string;
}

export interface UploadedFile {
  file: File;
  type: 'packingList' | 'invoice';
  status: 'pending' | 'processing' | 'complete' | 'error';
  extractedText?: string;
}

export interface ProcessingStep {
  id: number;
  label: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
}
```

## Step 4: Create File Upload Zone Component

Create `app/components/FileUploadZone.tsx`:
```typescript
'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadZoneProps {
  label: string;
  onUpload: (file: File) => void;
  uploadedFile?: File;
  onRemove?: () => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  onUpload,
  uploadedFile,
  onRemove
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>

      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">
            {isDragActive ? 'Drop the file here...' : 'Drag & drop a file here, or click to select'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supports PDF, JPG, PNG (max 50MB)
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
```

## Step 5: Create Processing Status Component

Create `app/components/ProcessingStatus.tsx`:
```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, X } from 'lucide-react';
import { ProcessingStep } from '@/types/bol';

interface ProcessingStatusProps {
  steps: ProcessingStep[];
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ steps }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Processing Documents</h2>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4"
          >
            <div className="flex-shrink-0">
              {step.status === 'complete' && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
              {step.status === 'processing' && (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
              {step.status === 'error' && (
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </div>
              )}
              {step.status === 'pending' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full" />
              )}
            </div>

            <div className="flex-1">
              <p className={`font-medium ${
                step.status === 'complete' ? 'text-green-700' :
                step.status === 'processing' ? 'text-blue-700' :
                step.status === 'error' ? 'text-red-700' :
                'text-gray-500'
              }`}>
                {step.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
```

## Step 6: Update Main Page

Update `app/page.tsx`:
```typescript
'use client';

import React, { useState } from 'react';
import { FileUploadZone } from '@/components/FileUploadZone';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { ProcessingStep, UploadedFile } from '@/types/bol';
import toast from 'react-hot-toast';

export default function Home() {
  const [packingList, setPackingList] = useState<File | null>(null);
  const [invoice, setInvoice] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);

  const handlePackingListUpload = (file: File) => {
    setPackingList(file);
    toast.success('Packing list uploaded');
  };

  const handleInvoiceUpload = (file: File) => {
    setInvoice(file);
    toast.success('Commercial invoice uploaded');
  };

  const handleProcess = async () => {
    if (!packingList || !invoice) {
      toast.error('Please upload both documents');
      return;
    }

    setIsProcessing(true);

    // Initialize processing steps
    const steps: ProcessingStep[] = [
      { id: 1, label: 'Documents Uploaded', status: 'complete' },
      { id: 2, label: 'Extracting text from Packing List...', status: 'processing' },
      { id: 3, label: 'Extracting text from Commercial Invoice...', status: 'pending' },
      { id: 4, label: 'Analyzing document content...', status: 'pending' },
      { id: 5, label: 'Mapping data to Bill of Lading...', status: 'pending' },
      { id: 6, label: 'Generating PDF...', status: 'pending' },
      { id: 7, label: 'Bill of Lading Ready!', status: 'pending' }
    ];

    setProcessingSteps(steps);

    try {
      // Step 1: Process documents with OCR
      updateStep(2, 'processing');
      const ocrData = await processDocuments(packingList, invoice);
      updateStep(2, 'complete');

      // Continue with other steps...
      // (Implementation continues below)

    } catch (error) {
      toast.error('Processing failed');
      setIsProcessing(false);
    }
  };

  const updateStep = (stepId: number, status: ProcessingStep['status']) => {
    setProcessingSteps(prev =>
      prev.map(step =>
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const processDocuments = async (packingList: File, invoice: File) => {
    const formData = new FormData();
    formData.append('packingList', packingList);
    formData.append('invoice', invoice);

    const response = await fetch('/api/process-documents', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('OCR processing failed');
    return response.json();
  };

  return (
    <main className="min-h-screen p-8">
      {!isProcessing ? (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Bill of Lading Generator
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <FileUploadZone
              label="Packing List"
              onUpload={handlePackingListUpload}
              uploadedFile={packingList}
              onRemove={() => setPackingList(null)}
            />

            <FileUploadZone
              label="Commercial Invoice"
              onUpload={handleInvoiceUpload}
              uploadedFile={invoice}
              onRemove={() => setInvoice(null)}
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleProcess}
              disabled={!packingList || !invoice}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold
                       hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                       transition-colors"
            >
              Generate Bill of Lading
            </button>
          </div>
        </div>
      ) : (
        <ProcessingStatus steps={processingSteps} />
      )}
    </main>
  );
}
```

## Step 7: Create OCR Processing API Route

Create `app/api/process-documents/route.ts`:
```typescript
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

  const response = await mistralClient.ocr.process({
    model: 'mistral-ocr-latest',
    document: {
      type: isPDF ? 'document_url' : 'image_url',
      [isPDF ? 'documentUrl' : 'imageUrl']: `data:${mimeType};base64,${base64}`
    }
  });

  return response.text;
}
```

## Step 8: Create BOL Data Generation API Route

Create `app/api/generate-bol/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { BOLData } from '@/types/bol';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export async function POST(request: NextRequest) {
  try {
    const { packingListText, invoiceText } = await request.json();

    const systemPrompt = `You are an expert at extracting shipping information from documents.
    Extract the following information and return it as JSON:
    - BOL number (generate if not found: BOL-YYYYMMDD-XXXX format)
    - Date
    - Tracking number (generate if not found)
    - Shipper details (name, address, city, state, zip, phone)
    - Consignee details (name, address, city, state, zip, phone)
    - Carrier info (name, PRO number, trailer number)
    - Items list with: quantity, description, weight, class, NMFC, hazmat flag, value
    - Total weight
    - Special instructions`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Packing List:\n${packingListText}\n\nCommercial Invoice:\n${invoiceText}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const bolData = JSON.parse(completion.choices[0].message.content!) as BOLData;

    // Add generated values if missing
    if (!bolData.bolNumber) {
      bolData.bolNumber = `BOL-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    }

    if (!bolData.trackingNumber) {
      bolData.trackingNumber = `TRK${Date.now()}`;
    }

    if (!bolData.date) {
      bolData.date = new Date().toLocaleDateString();
    }

    return NextResponse.json(bolData);

  } catch (error) {
    console.error('BOL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate BOL data' },
      { status: 500 }
    );
  }
}
```

## Step 9: Create Bill of Lading HTML Template

Create `app/components/BillOfLadingTemplate.tsx`:
*(Use the template from previous message)*

## Step 10: Create PDF Generation API Route

Create `app/api/generate-pdf/route.ts`:
*(Use the Puppeteer implementation from previous message)*

## Step 11: Update Main Page with Complete Flow

Update the `handleProcess` function in `app/page.tsx`:
```typescript
const handleProcess = async () => {
  // ... (previous code)

  try {
    // Step 1: Process documents with OCR
    updateStep(2, 'processing');
    const ocrData = await processDocuments(packingList, invoice);
    updateStep(2, 'complete');

    // Step 2: Process invoice
    updateStep(3, 'processing');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Visual delay
    updateStep(3, 'complete');

    // Step 3: Generate BOL data
    updateStep(4, 'processing');
    const bolResponse = await fetch('/api/generate-bol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ocrData)
    });
    const bolData = await bolResponse.json();
    updateStep(4, 'complete');

    // Step 4: Map data
    updateStep(5, 'processing');
    await new Promise(resolve => setTimeout(resolve, 500));
    updateStep(5, 'complete');

    // Step 5: Generate PDF
    updateStep(6, 'processing');
    const pdfResponse = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bolData })
    });

    const pdfBlob = await pdfResponse.blob();
    updateStep(6, 'complete');
    updateStep(7, 'complete');

    // Download PDF
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOL-${bolData.bolNumber}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Bill of Lading generated successfully!');

    // Reset after delay
    setTimeout(() => {
      setIsProcessing(false);
      setPackingList(null);
      setInvoice(null);
      setProcessingSteps([]);
    }, 3000);

  } catch (error) {
    toast.error('Processing failed');
    setIsProcessing(false);
  }
};
```

## Step 12: Add Toaster to Layout

Update `app/layout.tsx`:
```typescript
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

## Step 13: Update CLAUDE.md

Add to `CLAUDE.md`:
```markdown
## Bill of Lading Generator

### Tech Stack
- Mistral AI OCR for document processing
- OpenAI GPT-4 for intelligent field mapping
- Puppeteer for HTML to PDF conversion
- React with TypeScript
- Tailwind CSS for styling

### API Routes
- `/api/process-documents` - OCR processing with Mistral AI
- `/api/generate-bol` - LLM field mapping
- `/api/generate-pdf` - PDF generation with Puppeteer
```