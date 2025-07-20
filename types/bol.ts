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