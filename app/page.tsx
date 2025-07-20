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
    <main className="min-h-screen relative overflow-hidden">
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-600/20 via-transparent to-emerald-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)]"></div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        {!isProcessing ? (
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
                Bill of Lading Generator
              </h1>
              <p className="text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
                Transform your shipping documents with AI-powered precision. Upload your packing list and commercial invoice to generate professional Bills of Lading instantly.
              </p>
            </div>

            {/* Upload Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="group">
                <FileUploadZone
                  label="Packing List"
                  onUpload={handlePackingListUpload}
                  uploadedFile={packingList}
                  onRemove={() => setPackingList(null)}
                />
              </div>
              
              <div className="group">
                <FileUploadZone
                  label="Commercial Invoice"
                  onUpload={handleInvoiceUpload}
                  uploadedFile={invoice}
                  onRemove={() => setInvoice(null)}
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={handleProcess}
                disabled={!packingList || !invoice}
                className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg
                         shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105
                         disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed disabled:hover:scale-100
                         transition-all duration-300 ease-out"
              >
                <span className="relative z-10">Generate Bill of Lading</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              {(!packingList || !invoice) && (
                <p className="mt-4 text-blue-200/60 text-sm">
                  Please upload both documents to continue
                </p>
              )}
            </div>
          </div>
        ) : (
          <ProcessingStatus steps={processingSteps} />
        )}
      </div>
    </main>
  );
}