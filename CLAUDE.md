# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Bill of Lading Generator - a Next.js 15.4.2 application using TypeScript, React 19, and Tailwind CSS v4. The application generates professional Bill of Lading documents from packing lists and commercial invoices using AI-powered OCR and document analysis.

## Key Technologies

- **Framework**: Next.js 15.4.2 with Turbopack
- **Language**: TypeScript 5
- **UI**: React 19.1.0, Tailwind CSS v4
- **OCR Processing**: Mistral AI OCR for document text extraction
- **AI Analysis**: OpenAI GPT-4 for intelligent field mapping and data extraction
- **PDF Generation**: Puppeteer for HTML to PDF conversion
- **Component Library Setup**: Shadcn/ui configured (see components.json)
- **Utilities**: `clsx` and `tailwind-merge` for className management
- **File Handling**: React Dropzone for file uploads
- **UI Feedback**: React Hot Toast for notifications
- **Animations**: Framer Motion for processing status

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Structure

The application follows Next.js App Router conventions:

- `app/` - App Router pages, layouts, and global styles
  - `api/` - API routes for OCR processing, BOL generation, and PDF creation
  - `page.tsx` - Main application interface
  - `layout.tsx` - Root layout with Toaster integration
- `components/` - React UI components
  - `FileUploadZone.tsx` - Drag & drop file upload component
  - `ProcessingStatus.tsx` - Animated progress indicator
  - `BillOfLadingTemplate.tsx` - PDF template component
- `types/` - TypeScript type definitions
  - `bol.ts` - BOL data interfaces and processing step types
- `lib/` - Utility functions (contains utils.ts with cn() helper)
- `public/` - Static assets

## API Routes

- `/api/process-documents` - OCR processing with Mistral AI
- `/api/generate-bol` - LLM field mapping and data generation
- `/api/generate-pdf` - PDF generation with Puppeteer

## Environment Variables Required

```env
MISTRAL_API_KEY=your_mistral_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

## Code Architecture

### Styling Approach
- Tailwind CSS v4 with CSS variables enabled
- Global styles in `app/globals.css`
- Component utility function `cn()` in `lib/utils.ts` for merging classNames
- Configured for Shadcn/ui components with New York style

### TypeScript Configuration
- Strict mode enabled
- Path alias configured: `@/*` maps to project root
- Target: ES2017

### Font Setup
- Uses Geist Sans and Geist Mono fonts via `next/font/google`
- Font variables: `--font-geist-sans` and `--font-geist-mono`

## Key Features

- Drag & drop file upload for packing lists and commercial invoices
- Real-time processing status with animated progress indicators
- AI-powered extraction of shipping information from documents
- Professional Bill of Lading PDF generation
- Support for PDF, JPG, and PNG file formats (up to 50MB)
- Toast notifications for user feedback

## Usage

1. Upload a packing list document
2. Upload a commercial invoice document
3. Click "Generate Bill of Lading"
4. Watch the AI processing steps in real-time
5. Download the generated professional PDF

## Important Notes

- Requires valid API keys for Mistral AI and OpenAI
- No test framework currently configured
- ESLint configured with Next.js recommended rules
- Uses Lucide React for icons
- Supports OCR for PDF, JPG, and PNG files up to 50MB