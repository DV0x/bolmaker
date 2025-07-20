import React from 'react';
import { BOLData } from '@/types/bol';

interface BillOfLadingTemplateProps {
  data: BOLData;
}

export const BillOfLadingTemplate: React.FC<BillOfLadingTemplateProps> = ({ data }) => {
  return (
    <div className="bill-of-lading" style={{ 
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      lineHeight: '1.4',
      color: '#000',
      backgroundColor: '#fff',
      padding: '20px',
      width: '8.5in',
      minHeight: '11in',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
          BILL OF LADING
        </h1>
        <p style={{ fontSize: '14px', margin: '0' }}>
          (To be used only for shipments by motor vehicle)
        </p>
      </div>

      {/* BOL Number and Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <div style={{ border: '1px solid #000', padding: '8px', width: '200px' }}>
          <strong>BOL Number:</strong><br />
          {data.bolNumber}
        </div>
        <div style={{ border: '1px solid #000', padding: '8px', width: '150px' }}>
          <strong>Date:</strong><br />
          {data.date}
        </div>
        <div style={{ border: '1px solid #000', padding: '8px', width: '200px' }}>
          <strong>Tracking Number:</strong><br />
          {data.trackingNumber}
        </div>
      </div>

      {/* Shipper and Consignee */}
      <div style={{ display: 'flex', marginBottom: '15px', gap: '10px' }}>
        <div style={{ flex: 1, border: '1px solid #000', padding: '10px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0', backgroundColor: '#f0f0f0', padding: '5px' }}>
            SHIPPER (FROM)
          </h3>
          <div style={{ lineHeight: '1.6' }}>
            <strong>{data.shipper.name}</strong><br />
            {data.shipper.address}<br />
            {data.shipper.city}, {data.shipper.state} {data.shipper.zip}<br />
            Phone: {data.shipper.phone}
          </div>
        </div>
        <div style={{ flex: 1, border: '1px solid #000', padding: '10px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0', backgroundColor: '#f0f0f0', padding: '5px' }}>
            CONSIGNEE (TO)
          </h3>
          <div style={{ lineHeight: '1.6' }}>
            <strong>{data.consignee.name}</strong><br />
            {data.consignee.address}<br />
            {data.consignee.city}, {data.consignee.state} {data.consignee.zip}<br />
            Phone: {data.consignee.phone}
          </div>
        </div>
      </div>

      {/* Carrier Information */}
      <div style={{ border: '1px solid #000', padding: '10px', marginBottom: '15px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0', backgroundColor: '#f0f0f0', padding: '5px' }}>
          CARRIER INFORMATION
        </h3>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div><strong>Carrier Name:</strong> {data.carrier.name}</div>
          <div><strong>PRO Number:</strong> {data.carrier.proNumber}</div>
          <div><strong>Trailer:</strong> {data.carrier.trailer}</div>
        </div>
      </div>

      {/* Items Table */}
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0', backgroundColor: '#f0f0f0', padding: '5px' }}>
          ITEMS/COMMODITIES
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontSize: '11px' }}>QTY</th>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontSize: '11px' }}>DESCRIPTION</th>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontSize: '11px' }}>WEIGHT (lbs)</th>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontSize: '11px' }}>CLASS</th>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontSize: '11px' }}>NMFC</th>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontSize: '11px' }}>HAZMAT</th>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontSize: '11px' }}>VALUE ($)</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px' }}>{item.quantity}</td>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px' }}>{item.description}</td>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px', textAlign: 'right' }}>{item.weight}</td>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px' }}>{item.class}</td>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px' }}>{item.nmfc || 'N/A'}</td>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px', textAlign: 'center' }}>
                  {item.hazmat ? 'YES' : 'NO'}
                </td>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px', textAlign: 'right' }}>
                  ${item.value.toFixed(2)}
                </td>
              </tr>
            ))}
            {/* Add empty rows if needed */}
            {Array.from({ length: Math.max(0, 5 - data.items.length) }).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px', height: '30px' }}>&nbsp;</td>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px' }}>&nbsp;</td>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px' }}>&nbsp;</td>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px' }}>&nbsp;</td>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px' }}>&nbsp;</td>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px' }}>&nbsp;</td>
                <td style={{ border: '1px solid #000', padding: '6px', fontSize: '11px' }}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <div style={{ border: '1px solid #000', padding: '10px', width: '200px' }}>
          <strong>Total Weight (lbs):</strong><br />
          {data.totalWeight}
        </div>
        <div style={{ border: '1px solid #000', padding: '10px', width: '200px' }}>
          <strong>Total Value ($):</strong><br />
          ${data.items.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
        </div>
        <div style={{ border: '1px solid #000', padding: '10px', width: '200px' }}>
          <strong>Total Pieces:</strong><br />
          {data.items.reduce((sum, item) => sum + item.quantity, 0)}
        </div>
      </div>

      {/* Special Instructions */}
      {data.specialInstructions && (
        <div style={{ border: '1px solid #000', padding: '10px', marginBottom: '15px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0', backgroundColor: '#f0f0f0', padding: '5px' }}>
            SPECIAL INSTRUCTIONS
          </h3>
          <p style={{ margin: '0', fontSize: '11px' }}>{data.specialInstructions}</p>
        </div>
      )}

      {/* Terms and Conditions */}
      <div style={{ border: '1px solid #000', padding: '10px', marginBottom: '15px', fontSize: '10px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          TERMS AND CONDITIONS
        </h3>
        <p style={{ margin: '0 0 5px 0' }}>
          This shipment is subject to the terms and conditions of the Uniform Straight Bill of Lading set forth in the current National Motor Freight Classification.
        </p>
        <p style={{ margin: '0' }}>
          The carrier acknowledges receipt of packages and contents thereof as described above in apparent good order, except as noted.
        </p>
      </div>

      {/* Signature Section */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <div style={{ flex: 1, border: '1px solid #000', padding: '15px', minHeight: '80px' }}>
          <strong>SHIPPER SIGNATURE:</strong><br /><br />
          <div style={{ borderBottom: '1px solid #000', width: '200px', marginBottom: '5px' }}>&nbsp;</div>
          <small>Date: ___________</small>
        </div>
        <div style={{ flex: 1, border: '1px solid #000', padding: '15px', minHeight: '80px' }}>
          <strong>CARRIER SIGNATURE:</strong><br /><br />
          <div style={{ borderBottom: '1px solid #000', width: '200px', marginBottom: '5px' }}>&nbsp;</div>
          <small>Date: ___________</small>
        </div>
        <div style={{ flex: 1, border: '1px solid #000', padding: '15px', minHeight: '80px' }}>
          <strong>CONSIGNEE SIGNATURE:</strong><br /><br />
          <div style={{ borderBottom: '1px solid #000', width: '200px', marginBottom: '5px' }}>&nbsp;</div>
          <small>Date: ___________</small>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '10px', color: '#666' }}>
        <p style={{ margin: '0' }}>
          Generated on {new Date().toLocaleDateString()} • BOL Generator v1.0
        </p>
      </div>
    </div>
  );
};