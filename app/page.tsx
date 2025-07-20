'use client';

import React, { useState } from 'react';
import { FileUploadZone } from '@/components/FileUploadZone';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { ProcessingStep } from '@/types/bol';
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

      // Step 2: Process invoice (visual delay for UX)
      updateStep(3, 'processing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStep(3, 'complete');

      // Step 3: Generate BOL data with AI
      updateStep(4, 'processing');
      const bolResponse = await fetch('/api/generate-bol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ocrData)
      });
      
      if (!bolResponse.ok) {
        throw new Error('Failed to generate BOL data');
      }
      
      const bolData = await bolResponse.json();
      updateStep(4, 'complete');

      // Step 4: Map data (visual delay for UX)
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

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF');
      }

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
      console.error('Processing error:', error);
      toast.error('Processing failed. Please try again.');
      setIsProcessing(false);
      
      // Update the current processing step to error state
      setProcessingSteps(prev =>
        prev.map(step =>
          step.status === 'processing' ? { ...step, status: 'error' } : step
        )
      );
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