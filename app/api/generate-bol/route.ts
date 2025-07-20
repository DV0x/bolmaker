import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { BOLData } from '@/types/bol';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export async function POST(request: NextRequest) {
  try {
    const { packingListText, invoiceText } = await request.json();

    // Validate input data
    if (!packingListText || !invoiceText) {
      return NextResponse.json(
        { error: 'Both packing list and invoice text are required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert at extracting shipping information from documents.
    Extract the following information and return it as JSON:
    - BOL number (generate if not found: BOL-YYYYMMDD-XXXX format)
    - Date (current date if not found)
    - Tracking number (generate if not found)
    - Shipper details (name, address, city, state, zip, phone)
    - Consignee details (name, address, city, state, zip, phone)
    - Carrier info (name, PRO number, trailer number)
    - Items list with: quantity, description, weight, class, NMFC, hazmat flag, value
    - Total weight (sum of all item weights)
    - Special instructions

    Important guidelines:
    - Extract exact information when available in the documents
    - Generate realistic placeholder values for missing required fields
    - Ensure all numeric values are numbers, not strings
    - Set hazmat to false unless explicitly mentioned
    - Use "Unknown" for missing text fields that cannot be reasonably generated
    - Ensure the response is valid JSON that matches the BOLData interface`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini-2025-04-14',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Extract Bill of Lading information from these documents:

Packing List:
${packingListText}

Commercial Invoice:
${invoiceText}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1 // Lower temperature for more consistent extraction
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('No response content from OpenAI');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let aiResponse: any;
    try {
      aiResponse = JSON.parse(responseContent);
    } catch {
      console.error('Failed to parse OpenAI response:', responseContent);
      throw new Error('Invalid JSON response from AI');
    }

    // Map AI response (PascalCase) to our interface (camelCase)
    const bolData: BOLData = {
      bolNumber: aiResponse.BOLNumber || aiResponse.bolNumber || `BOL-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      date: aiResponse.Date || aiResponse.date || new Date().toLocaleDateString(),
      trackingNumber: aiResponse.TrackingNumber || aiResponse.trackingNumber || `TRK${Date.now()}`,
      totalWeight: aiResponse.TotalWeight || aiResponse.totalWeight || 0,
      
      shipper: {
        name: aiResponse.Shipper?.name || aiResponse.shipper?.name || 'Unknown',
        address: aiResponse.Shipper?.address || aiResponse.shipper?.address || 'Unknown',
        city: aiResponse.Shipper?.city || aiResponse.shipper?.city || 'Unknown',
        state: aiResponse.Shipper?.state || aiResponse.shipper?.state || 'Unknown',
        zip: aiResponse.Shipper?.zip || aiResponse.shipper?.zip || 'Unknown',
        phone: aiResponse.Shipper?.phone || aiResponse.shipper?.phone || 'Unknown'
      },
      
      consignee: {
        name: aiResponse.Consignee?.name || aiResponse.consignee?.name || 'Unknown',
        address: aiResponse.Consignee?.address || aiResponse.consignee?.address || 'Unknown',
        city: aiResponse.Consignee?.city || aiResponse.consignee?.city || 'Unknown',
        state: aiResponse.Consignee?.state || aiResponse.consignee?.state || 'Unknown',
        zip: aiResponse.Consignee?.zip || aiResponse.consignee?.zip || 'Unknown',
        phone: aiResponse.Consignee?.phone || aiResponse.consignee?.phone || 'Unknown'
      },
      
      carrier: {
        name: aiResponse.Carrier?.name || aiResponse.carrier?.name || 'Unknown',
        proNumber: aiResponse.Carrier?.PRONumber || aiResponse.Carrier?.proNumber || aiResponse.carrier?.proNumber || 'Unknown',
        trailer: aiResponse.Carrier?.trailerNumber || aiResponse.Carrier?.trailer || aiResponse.carrier?.trailer || 'Unknown'
      },
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: (aiResponse.Items || aiResponse.items || []).map((item: any) => ({
        quantity: item.quantity || 0,
        description: item.description || 'Unknown',
        weight: item.weight || 0,
        class: item.class || 'Unknown',
        nmfc: item.NMFC || item.nmfc,
        hazmat: item.hazmat || false,
        value: item.value || 0
      })),
      
      specialInstructions: aiResponse.SpecialInstructions || aiResponse.specialInstructions
    };

    // Calculate total weight from items if not provided
    if (!bolData.totalWeight && bolData.items.length > 0) {
      bolData.totalWeight = bolData.items.reduce((sum, item) => sum + (item.weight || 0), 0);
    }


    return NextResponse.json(bolData);

  } catch (error) {
    console.error('BOL generation error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API configuration error' },
          { status: 500 }
        );
      }
      if (error.message.includes('JSON')) {
        return NextResponse.json(
          { error: 'Failed to parse AI response' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate BOL data' },
      { status: 500 }
    );
  }
}