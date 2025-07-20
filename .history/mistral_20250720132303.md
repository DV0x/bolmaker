TITLE: Perform OCR on PDF documents using Mistral AI Python SDK
DESCRIPTION: These Python snippets demonstrate how to use the Mistral AI Document AI API's OCR processor to extract text and structured content from PDF documents. Examples include processing PDFs from a URL and from a Base64 encoded local file, utilizing the `mistral-ocr-latest` model.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: python
CODE:
```
import os
from mistralai import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key)

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "document_url",
        "document_url": "https://arxiv.org/pdf/2201.04234"
    },
    include_image_base64=True
)

```

LANGUAGE: python
CODE:
```
import base64
import os
from mistralai import Mistral

def encode_pdf(pdf_path):
    """Encode the pdf to base64."""
    try:
        with open(pdf_path, "rb") as pdf_file:
            return base64.b64encode(pdf_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: The file {pdf_path} was not found.")
        return None
    except Exception as e: # Added general exception handling
        print(f"Error: {e}")
        return None

# Path to your pdf
pdf_path = "path_to_your_pdf.pdf"

```

----------------------------------------

TITLE: Process OCR with Mistral AI JavaScript Client (Image URL)
DESCRIPTION: Shows how to perform OCR using the Mistral AI JavaScript client by providing a direct image URL. It initializes the client with an API key and asynchronously calls the `ocr.process` method with the specified model and document details.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: javascript
CODE:
```
import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

const ocrResponse = await client.ocr.process({
    model: "mistral-ocr-latest",
    document: {
        type: "image_url",
        imageUrl: "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png",
    },
    includeImageBase64: true
});
```

----------------------------------------

TITLE: Process OCR Results from a Document URL with Mistral AI
DESCRIPTION: This snippet illustrates how to initiate OCR processing on a document accessible via a signed URL. It specifies the OCR model ('mistral-ocr-latest') and options like including base64 image data in the response.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: python
CODE:
```
import os
from mistralai import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key)

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "document_url",
        "document_url": signed_url.url,
    },
    include_image_base64=True
)
```

LANGUAGE: typescript
CODE:
```
import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

const ocrResponse = await client.ocr.process({
    model: "mistral-ocr-latest",
    document: {
        type: "document_url",
        documentUrl: signedUrl.url,
    },
    includeImageBase64: true
});
```

LANGUAGE: curl
CODE:
```
curl https://api.mistral.ai/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
        "type": "document_url",
        "document_url": "<signed_url>"
    },
    "include_image_base64": true
  }' -o ocr_output.json
```

----------------------------------------

TITLE: Process PDF with Mistral AI OCR using a direct URL
DESCRIPTION: This snippet demonstrates how to use the Mistral AI OCR service by providing a direct URL to a PDF document. It shows examples in JavaScript and cURL for initiating the OCR process.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: javascript
CODE:
```
import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

const ocrResponse = await client.ocr.process({
    model: "mistral-ocr-latest",
    document: {
        type: "document_url",
        documentUrl: "https://arxiv.org/pdf/2201.04234"
    },
    includeImageBase64: true
});
```

LANGUAGE: curl
CODE:
```
curl https://api.mistral.ai/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
        "type": "document_url",
        "document_url": "https://arxiv.org/pdf/2201.04234"
    },
    "include_image_base64": true
  }' -o ocr_output.json
```

----------------------------------------

TITLE: Mistral AI OCR API Reference
DESCRIPTION: Comprehensive documentation for the Mistral AI Optical Character Recognition (OCR) API endpoint. It details the request method, required headers, JSON payload structure, supported parameters for processing images via direct URLs or Base64 encoding, and API limitations.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: APIDOC
CODE:
```
POST /v1/ocr
Host: api.mistral.ai
Content-Type: application/json
Authorization: Bearer ${MISTRAL_API_KEY}

Request Body:
{
  "model": "string", // Required. Example: "mistral-ocr-latest"
  "document": {      // Required.
    "type": "string",  // Required. Must be "image_url".
    "image_url": "string" // Required. Can be a direct URL (e.g., "https://example.com/image.png") or a Base64 encoded image (e.g., "data:image/jpeg;base64,<base64_string>")
  },
  "include_image_base64": "boolean" // Optional. If true, the response will include the processed image as a Base64 string.
}

Response:
JSON object containing the OCR results.

Limitations:
- Uploaded document files must not exceed 50 MB in size.
- Documents should be no longer than 1,000 pages.
```

----------------------------------------

TITLE: Process Document with Mistral AI OCR Client (Python)
DESCRIPTION: Demonstrates calling the Mistral AI OCR client to process a document URL. It shows how to specify custom bounding box and document annotation formats using `response_format_from_pydantic_model` for structured output.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: python
CODE:
```
response = client.ocr.process(
    model="mistral-ocr-latest",
    pages=list(range(8)),
    document=DocumentURLChunk(
      document_url="https://arxiv.org/pdf/2410.07073"
    ),
    bbox_annotation_format=response_format_from_pydantic_model(Image),
    document_annotation_format=response_format_from_pydantic_model(Document),
    include_image_base64=True
  )
```

----------------------------------------

TITLE: Process OCR Results from an Image URL with Mistral AI
DESCRIPTION: This snippet provides an example of performing OCR directly on an image hosted at a given URL. This is useful for processing images without prior file upload to the Mistral AI platform, directly leveraging external image sources.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: python
CODE:
```
import os
from mistralai import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key);

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "image_url",
        "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png"
    },
    include_image_base64=True
)
```

----------------------------------------

TITLE: Mistral AI Document AI OCR API
DESCRIPTION: API endpoint for performing Optical Character Recognition (OCR) on documents. It supports specifying document URLs, page ranges, image extraction options, and structured output formats for bounding box and document-level annotations.
SOURCE: https://docs.mistral.ai/api

LANGUAGE: APIDOC
CODE:
```
POST /v1/ocr
  - Description: Our Document AI stack, with OCR and Annotations features.
  - Authorizations: ApiKey
  - Request Body schema: application/json (required)
    - model: required, Model (string) or Model (null) (Model)
    - id: string (Id)
    - document: required, DocumentURLChunk (object) or ImageURLChunk (object) (Document) - Document to run OCR on
    - pages: Array of Pages (integers) or Pages (null) (Pages) - Specific pages user wants to process in various formats: single number, range, or list of both. Starts from 0
    - include_image_base64: Include Image Base64 (boolean) or Include Image Base64 (null) (Include Image Base64) - Include image URLs in response
    - image_limit: Image Limit (integer) or Image Limit (null) (Image Limit) - Max images to extract
    - image_min_size: Image Min Size (integer) or Image Min Size (null) (Image Min Size) - Minimum height and width of image to extract
    - bbox_annotation_format: ResponseFormat (object) or null - Structured output class for extracting useful information from each extracted bounding box / image from document. Only json_schema is valid for this field
    - document_annotation_format: ResponseFormat (object) or null - Structured output class for extracting useful information from the entire document. Only json_schema is valid for this field
  - Responses: 200 Successful Response, 422 Validation Error
  - Production server: https://api.mistral.ai/v1/ocr
```

----------------------------------------

TITLE: Mistral AI Document AI OCR API Reference: ocr.process
DESCRIPTION: Comprehensive reference for the Mistral AI Document AI OCR processor, detailing the `ocr.process` method. This method is used for extracting text and structured content from various document types, supporting inputs via document URLs or Base64 encoded files. It also describes the parameters, their types, and the expected return structure.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: APIDOC
CODE:
```
client.ocr.process(
    model: string,
    document: object,
    include_image_base64: boolean
)
Parameters:
  model: string
    Description: The OCR model to use. Example: "mistral-ocr-latest".
  document: object
    Description: The document to process.
    Structure:
      type: string
        Description: Type of the document source. Can be "document_url" or "base64".
      document_url: string (conditional, if type is "document_url")
        Description: URL of the document (e.g., PDF, PPTX, DOCX) or image (e.g., PNG, JPEG, AVIF).
      base64: string (conditional, if type is "base64")
        Description: Base64 encoded content of the document.
  include_image_base64: boolean
    Description: Whether to include image bounding boxes as Base64 encoded images in the response.
Returns:
  ocr_response: object
    Description: Object containing extracted text content, images bboxes, and document structure metadata.
```

----------------------------------------

TITLE: Upload PDF File for OCR Processing to Mistral AI
DESCRIPTION: This snippet demonstrates how to upload a PDF file to the Mistral AI platform for OCR processing. It involves authenticating with an API key and specifying the file content and purpose ('ocr').
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: python
CODE:
```
from mistralai import Mistral
import os

api_key = os.environ["MISTRAL_API_KEY"]

client = Mistral(api_key=api_key)

uploaded_pdf = client.files.upload(
    file={
        "file_name": "uploaded_file.pdf",
        "content": open("uploaded_file.pdf", "rb"),
    },
    purpose="ocr"
)
```

LANGUAGE: typescript
CODE:
```
import { Mistral } from '@mistralai/mistralai';
import fs from 'fs';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

const uploadedFile = fs.readFileSync('uploaded_file.pdf');
const uploadedPdf = await client.files.upload({
    file: {
        fileName: "uploaded_file.pdf",
        content: uploadedFile,
    },
    purpose: "ocr"
});
```

LANGUAGE: curl
CODE:
```
curl https://api.mistral.ai/v1/files \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -F purpose="ocr" \
  -F file="@uploaded_file.pdf"
```

----------------------------------------

TITLE: Process OCR with Mistral AI JavaScript Client (Base64 Image)
DESCRIPTION: Provides a complete JavaScript example for encoding an image file to Base64 using Node.js `fs` module and then sending it to the Mistral AI OCR API. It includes error handling for both image encoding and the OCR processing.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: javascript
CODE:
```
import { Mistral } from '@mistralai/mistralai';
import fs from 'fs';

async function encodeImage(imagePath) {
    try {
        // Read the image file as a buffer
        const imageBuffer = fs.readFileSync(imagePath);

        // Convert the buffer to a Base64-encoded string
        const base64Image = imageBuffer.toString('base64');
        return base64Image;
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

const imagePath = "path_to_your_image.jpg";

const base64Image = await encodeImage(imagePath);

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

try {
    const ocrResponse = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
            type: "image_url",
            imageUrl: "data:image/jpeg;base64," + base64Image
        },
        includeImageBase64: true
    });
    console.log(ocrResponse);
} catch (error) {
    console.error("Error processing OCR:", error);
}
```

----------------------------------------

TITLE: Process Document with Mistral AI OCR Python Client
DESCRIPTION: Demonstrates how to call the Mistral AI OCR service using the Python client, specifying a document URL and a pydantic model for bounding box annotation format. This snippet shows a basic client interaction.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: python
CODE:
```
response = client.ocr.process(
    model="mistral-ocr-latest",
    document=DocumentURLChunk(
      document_url="https://arxiv.org/pdf/2410.07073"
    ),
    bbox_annotation_format=response_format_from_pydantic_model(Image),
    include_image_base64=True
  )
```

----------------------------------------

TITLE: Process OCR with Mistral AI Python Client (Base64 Image)
DESCRIPTION: Demonstrates how to use the Mistral AI Python client to perform OCR on an image. The image is first encoded to Base64 (assuming `encode_image` is defined elsewhere) and then passed as a `data:image/jpeg;base64` URL to the `ocr.process` method.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: python
CODE:
```
base64_image = encode_image(image_path)

api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key)

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "image_url",
        "image_url": f"data:image/jpeg;base64,{base64_image}"
    },
    include_image_base64=True
)
```

----------------------------------------

TITLE: Mistral AI OCR API Reference
DESCRIPTION: Comprehensive documentation for the Mistral AI OCR API, detailing the `POST /v1/ocr` endpoint. It covers request parameters for document processing, including how to specify input documents, define custom structured output schemas for both bounding box and document-level annotations using JSON Schema, and options for including base64 encoded images in the response.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: APIDOC
CODE:
```
POST /v1/ocr

Headers:
  Content-Type: application/json
  Authorization: Bearer ${MISTRAL_API_KEY}

Request Body (JSON):
  model: string
    Description: The OCR model to use (e.g., "mistral-ocr-latest").
  document: object
    Description: Specifies the document to be processed.
    Properties:
      document_url: string
        Description: The URL of the document to process.
  bbox_annotation_format: object (optional)
    Description: Defines a custom JSON Schema for structured bounding box annotations.
    Properties:
      type: string
        Value: "json_schema"
      json_schema: object
        Properties:
          schema: object
            Description: The JSON Schema definition for BBOX annotations.
            Properties:
              properties: object
                Description: Defines the properties of the BBOX annotation object (e.g., document_type, short_description, summary).
              required: array of strings
                Description: List of required properties.
              title: string
                Description: A title for the BBOX annotation schema (e.g., "BBOXAnnotation").
              type: string
                Value: "object"
              additionalProperties: boolean
                Description: Whether additional properties are allowed.
          name: string
            Description: A name for the JSON schema (e.g., "document_annotation").
          strict: boolean
            Description: If true, enforce strict schema validation.
  document_annotation_format: object (optional)
    Description: Defines a custom JSON Schema for structured document-level annotations.
    Properties:
      type: string
        Value: "json_schema"
      json_schema: object
        Properties:
          schema: object
            Description: The JSON Schema definition for document annotations.
            Properties:
              properties: object
                Description: Defines the properties of the document annotation object (e.g., language, chapter_titles, urls).
              required: array of strings
                Description: List of required properties.
              title: string
                Description: A title for the document annotation schema (e.g., "DocumentAnnotation").
              type: string
                Value: "object"
              additionalProperties: boolean
                Description: Whether additional properties are allowed.
          name: string
            Description: A name for the JSON schema (e.g., "document_annotation").
          strict: boolean
            Description: If true, enforce strict schema validation.
  include_image_base64: boolean (optional)
    Description: If true, the response will include the processed image encoded in base64.

Response Body (JSON):
  Description: The response contains structured data based on the requested annotation formats and options.
  Properties:
    image_base64: string (optional)
      Description: Base64 encoded string of the processed image, if `include_image_base64` was true.
    <bbox_annotation_name>: object (optional)
      Description: An object conforming to the `bbox_annotation_format` schema, if provided in the request.
    <document_annotation_name>: object (optional)
      Description: An object conforming to the `document_annotation_format` schema, if provided in the request.
```

----------------------------------------

TITLE: Utility to Encode Image to Base64 for Mistral AI OCR
DESCRIPTION: This Python utility function demonstrates how to encode a local image file into a Base64 string. The resulting Base64 string can then be passed as input for OCR processing to the Mistral AI API when direct file upload or URL is not feasible or preferred.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: python
CODE:
```
import base64
import os
from mistralai import Mistral

def encode_image(image_path):
    """Encode the image to base64."""
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: The file {image_path} was not found.")
        return None
    except Exception as e:  # Added general exception handling
        print(f"Error: {e}")
        return None

# Path to your image
image_path = "path_to_your_image.jpg"
```

----------------------------------------

TITLE: Process PDF with Mistral AI OCR using Base64 encoded data
DESCRIPTION: This snippet illustrates how to encode a PDF file into a Base64 string and then send it to the Mistral AI OCR service. Examples are provided for Python, JavaScript (including a helper function for encoding), and cURL.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: python
CODE:
```
base64_pdf = encode_pdf(pdf_path)

api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key=api_key)

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "document_url",
        "document_url": f"data:application/pdf;base64,{base64_pdf}"
    },
    include_image_base64=True
)
```

LANGUAGE: javascript
CODE:
```
import { Mistral } from '@mistralai/mistralai';
import fs from 'fs';

async function encodePdf(pdfPath) {
    try {
        // Read the PDF file as a buffer
        const pdfBuffer = fs.readFileSync(pdfPath);

        // Convert the buffer to a Base64-encoded string
        const base64Pdf = pdfBuffer.toString('base64');
        return base64Pdf;
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

const pdfPath = "path_to_your_pdf.pdf";

const base64Pdf = await encodePdf(pdfPath);

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

try {
    const ocrResponse = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
            type: "document_url",
            documentUrl: "data:application/pdf;base64," + base64Pdf
        },
        includeImageBase64: true
    });
    console.log(ocrResponse);
} catch (error) {
    console.error("Error processing OCR:", error);
}
```

LANGUAGE: curl
CODE:
```
curl https://api.mistral.ai/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
        "type": "document_url",
        "document_url": "data:application/pdf;base64,<base64_pdf>"
    },
    "include_image_base64": true
  }' -o ocr_output.json
```

----------------------------------------

TITLE: Initial OCR Document Processing Call (Python)
DESCRIPTION: Demonstrates a basic Python client invocation for Mistral AI's OCR service. It specifies the model, page range, document URL, and the desired output format using a Pydantic model for structured response handling.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: python
CODE:
```
response = client.ocr.process(
    model="mistral-ocr-latest",
    pages=list(range(8)),
    document=DocumentURLChunk(
      document_url="https://arxiv.org/pdf/2410.07073"
    ),
    document_annotation_format=response_format_from_pydantic_model(Document),
    include_image_base64=True
  )
```

----------------------------------------

TITLE: Example OCR Output: Document Annotation
DESCRIPTION: Presents an example of the structured JSON output from the Mistral AI OCR API for document-level annotations, adhering to the `DocumentAnnotation` schema. It demonstrates the extraction of document language, chapter titles, and URLs.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: json
CODE:
```
{
  "language": "English",
  "chapter_titles": [
    "Abstract",
    "1 Introduction",
    "2 Architectural details",
    "2.1 Multimodal Decoder",
    "2.2 Vision Encoder",
    "2.3 Complete architecture",
    "3 MM-MT-Bench: A benchmark for multi-modal instruction following",
    "4 Results",
    "4.1 Main Results",
    "4.2 Prompt selection",
    "4.3 Sensitivity to evaluation metrics",
    "4.4 Vision Encoder Ablations"
  ],
  "urls": [
    "https://mistral.ai/news/pixtal-12b/",
    "https://github.com/mistralai/mistral-inference/",
    "https://github.com/mistralai/mistral-evals/",
    "https://huggingface.co/datasets/mistralai/MM-MT-Bench"
  ]
}
```

----------------------------------------

TITLE: cURL Request to Mistral AI OCR API (Image URL)
DESCRIPTION: Illustrates how to make a direct HTTP POST request to the Mistral AI OCR API using cURL, specifying an external image URL. It sets the necessary `Content-Type` and `Authorization` headers and constructs the JSON request body.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: bash
CODE:
```
curl https://api.mistral.ai/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
        "type": "image_url",
        "image_url": "https://raw.githubusercontent.com/mistralai/cookbook/refs/heads/main/mistral/ocr/receipt.png"
    },
    "include_image_base64": true
  }' -o ocr_output.json
```

----------------------------------------

TITLE: Call Mistral AI OCR API with Custom Annotation Schemas
DESCRIPTION: Demonstrates how to invoke the Mistral AI OCR API using `curl` to process a document URL. It specifies custom JSON schemas for both bounding box (BBOX) and document-level annotations, allowing for structured data extraction based on predefined properties like document type, short description, summary, language, chapter titles, and URLs.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: shell
CODE:
```
curl --location 'https://api.mistral.ai/v1/ocr' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${MISTRAL_API_KEY}" \
--data '{
    "model": "mistral-ocr-latest",
    "document": {"document_url": "https://arxiv.org/pdf/2410.07073"},
    "bbox_annotation_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "properties": {
                    "document_type": {"title": "Document_Type", "description": "The type of the image.", "type": "string"},
                    "short_description": {"title": "Short_Description", "description": "A description in English describing the image.", "type": "string"},
                    "summary": {"title": "Summary", "description": "Summarize the image.", "type": "string"}
                },
                "required": ["document_type", "short_description", "summary"],
                "title": "BBOXAnnotation",
                "type": "object",
                "additionalProperties": false
            },
            "name": "document_annotation",
            "strict": true
        }
    },
     "document_annotation_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "properties": {
                    "language": {"title": "Language", "type": "string"},
                    "chapter_titles": {"title": "Chapter_Titles", "type": "string"},
                    "urls": {"title": "urls", "type": "string"}
                },
                "required": ["language", "chapter_titles", "urls"],
                "title": "DocumentAnnotation",
                "type": "object",
                "additionalProperties": false
            },
            "name": "document_annotation",
            "strict": true
        }
    },
    "include_image_base64": true
}'
```

----------------------------------------

TITLE: Direct API Call to Mistral AI OCR with JSON Schema
DESCRIPTION: Provides a cURL example for directly interacting with the Mistral AI OCR API. It shows how to specify a custom JSON schema for `bbox_annotation_format` to define the expected structure of the OCR output.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: bash
CODE:
```
curl --location 'https://api.mistral.ai/v1/ocr' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${MISTRAL_API_KEY}" \
--data '{
    "model": "mistral-ocr-latest",
    "document": {"document_url": "https://arxiv.org/pdf/2410.07073"},
    "bbox_annotation_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "properties": {
                    "document_type": {"title": "Document_Type", "type": "string"},
                    "short_description": {"title": "Short_Description", "type": "string"},
                    "summary": {"title": "Summary", "type": "string"}
                },
                "required": ["document_type", "short_description", "summary"],
                "title": "BBOXAnnotation",
                "type": "object",
                "additionalProperties": false
            },
            "name": "document_annotation",
            "strict": true
        }
    },
    "include_image_base64": true
}'
```

----------------------------------------

TITLE: Mistral AI OCR API Request Payload Example
DESCRIPTION: Example JSON payload for making a request to the Mistral AI OCR API, demonstrating how to specify document details, pages, and structured annotation formats for both bounding box and document-level output.
SOURCE: https://docs.mistral.ai/api

LANGUAGE: JSON
CODE:
```
{
  "model": "string",
  "id": "string",
  "document": {
    "document_url": "string",
    "document_name": "string",
    "type": "document_url"
  },
  "pages": [
    0
  ],
  "include_image_base64": true,
  "image_limit": 0,
  "image_min_size": 0,
  "bbox_annotation_format": {
    "type": "text",
    "json_schema": {
      "name": "string",
      "description": "string",
      "schema": {},
      "strict": false
    }
  },
  "document_annotation_format": {
    "type": "text",
    "json_schema": {
      "name": "string",
      "description": "string",
      "schema": {},
      "strict": false
    }
  }
}
```

----------------------------------------

TITLE: Process Document with Mistral AI OCR Client and Zod (TypeScript)
DESCRIPTION: Provides a complete asynchronous function demonstrating the use of the Mistral AI TypeScript client. It integrates Zod schemas via `responseFormatFromZodObject` to ensure the OCR response adheres to predefined `bboxAnnotationFormat` and `documentAnnotationFormat`.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: typescript
CODE:
```
import { Mistral } from "@mistralai/mistralai";
import { responseFormatFromZodObject } from '@mistralai/mistralai/extra/structChat.js';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

async function processDocument() {
  try {
    const response = await client.ocr.process({
      model: "mistral-ocr-latest",
      pages: Array.from({ length: 8 }, (_, i) => i), // Creates an array [0, 1, 2, ..., 7]
      document: {
        type: "document_url",
        documentUrl: "https://arxiv.org/pdf/2410.07073"
      },
      bboxAnnotationFormat: responseFormatFromZodObject(ImageSchema),
      documentAnnotationFormat: responseFormatFromZodObject(DocumentSchema),
      includeImageBase64: true,
    });

    console.log(response);
  } catch (error) {
    console.error("Error processing document:", error);
  }
}

processDocument();
```

----------------------------------------

TITLE: Mistral AI OCR API Request Body Schema
DESCRIPTION: Defines the comprehensive JSON schema for the request body of the Mistral AI OCR API `/v1/ocr` endpoint. It includes the structure for `model`, `document`, `pages`, and nested `json_schema` definitions for `bbox_annotation_format` and `document_annotation_format`.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: json
CODE:
```
{
    "model": "mistral-ocr-latest",
    "document": {"document_url": "https://arxiv.org/pdf/2410.07073"},
    "pages": [0, 1, 2, 3, 4, 5, 6, 7],
    "bbox_annotation_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "properties": {
                    "document_type": {"title": "Document_Type", "type": "string"},
                    "short_description": {"title": "Short_Description", "type": "string"},
                    "summary": {"title": "Summary", "type": "string"}
                },
                "required": ["document_type", "short_description", "summary"],
                "title": "BBOXAnnotation",
                "type": "object",
                "additionalProperties": false
            },
            "name": "document_annotation",
            "strict": true
        }
    },
    "document_annotation_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "properties": {
                    "language": {"title": "Language", "type": "string"},
                    "chapter_titles": {"title": "Chapter_Titles", "type": "string"},
                    "urls": {"title": "urls", "type": "string"}
                },
                "required": ["language", "chapter_titles", "urls"],
                "title": "DocumentAnnotation",
                "type": "object",
                "additionalProperties": false
            },
            "name": "document_annotation",
            "strict": true
        }
    },
    "include_image_base64": true
}
```

----------------------------------------

TITLE: Generate Signed URL for Mistral AI Uploaded File
DESCRIPTION: This snippet explains how to obtain a temporary, signed URL for direct access to an uploaded file. This URL can be used for subsequent operations like OCR processing without re-uploading the file.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: python
CODE:
```
signed_url = client.files.get_signed_url(file_id=uploaded_pdf.id)
```

LANGUAGE: typescript
CODE:
```
const signedUrl = await client.files.getSignedUrl({
    fileId: uploadedPdf.id,
});
```

LANGUAGE: curl
CODE:
```
curl -X GET "https://api.mistral.ai/v1/files/$id/url?expiry=24" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer $MISTRAL_API_KEY"
```

----------------------------------------

TITLE: Example Structured Document Annotation Output (JSON)
DESCRIPTION: Presents a sample JSON output from the Mistral AI OCR service, demonstrating the structured format for document annotations. It includes extracted language, chapter titles, and associated URLs.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: json
CODE:
```
{
  "language": "English",
  "chapter_titles": [
    "Abstract",
    "1 Introduction",
    "2 Architectural details",
    "2.1 Multimodal Decoder",
    "2.2 Vision Encoder",
    "2.3 Complete architecture",
    "3 MM-MT-Bench: A benchmark for multi-modal instruction following",
    "4 Results",
    "4.1 Main Results",
    "4.2 Prompt selection",
    "4.3 Sensitivity to evaluation metrics",
    "4.4 Vision Encoder Ablations"
  ],
  "urls": [
    "https://mistral.ai/news/pixtal-12b/",
    "https://github.com/mistralai/mistral-inference/",
    "https://github.com/mistralai/mistral-evals/",
    "https://huggingface.co/datasets/mistralai/MM-MT-Bench"
  ]
}
```

----------------------------------------

TITLE: Process Document with Mistral AI OCR Client (TypeScript)
DESCRIPTION: Shows a comprehensive example of using the Mistral AI TypeScript client to process a document. It integrates a Zod schema to enforce response structure and includes asynchronous execution with error handling.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: typescript
CODE:
```
import { Mistral } from "@mistralai/mistralai";
import { responseFormatFromZodObject } from '@mistralai/mistralai/extra/structChat.js';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

async function processDocument() {
  try {
    const response = await client.ocr.process({
      model: "mistral-ocr-latest",
      pages: Array.from({ length: 8 }, (_, i) => i), // Creates an array [0, 1, 2, ..., 7]
      document: {
        type: "document_url",
        documentUrl: "https://arxiv.org/pdf/2410.07073"
      },
      documentAnnotationFormat: responseFormatFromZodObject(DocumentSchema),
      includeImageBase64: true,
    });

    console.log(response);
  } catch (error) {
    console.error("Error processing document:", error);
  }
}

processDocument();
```

----------------------------------------

TITLE: cURL Request to Mistral AI OCR API (Base64 Image)
DESCRIPTION: Shows how to send a Base64 encoded image to the Mistral AI OCR API via a cURL POST request. The Base64 string is embedded directly within the `image_url` field of the JSON payload, prefixed with `data:image/jpeg;base64,`.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: bash
CODE:
```
curl https://api.mistral.ai/v1/ocr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-ocr-latest",
    "document": {
        "type": "image_url",
        "image_url": "data:image/jpeg;base64,<base64_image>"
    },
    "include_image_base64": true
  }' -o ocr_output.json
```

----------------------------------------

TITLE: Process Document with Mistral AI OCR TypeScript Client
DESCRIPTION: Demonstrates how to use the Mistral AI TypeScript client to process a document, integrating a Zod schema for `bboxAnnotationFormat` via `responseFormatFromZodObject`. This example includes error handling and asynchronous execution.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: typescript
CODE:
```
import { Mistral } from "@mistralai/mistralai";
import { responseFormatFromZodObject } from '@mistralai/mistralai/extra/structChat.js';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

async function processDocument() {
  try {
    const response = await client.ocr.process({
      model: "mistral-ocr-latest",
      document: {
        type: "document_url",
        documentUrl: "https://arxiv.org/pdf/2410.07073"
      },
      bboxAnnotationFormat: responseFormatFromZodObject(ImageSchema),
      includeImageBase64: true,
    });

    console.log(response);
  } catch (error) {
    console.error("Error processing document:", error);
  }
}

processDocument();
```

----------------------------------------

TITLE: Example Output: Image Base64
DESCRIPTION: An example of the JSON response containing the base64 encoded image data returned by the Mistral AI OCR service when `include_image_base64` is set to true.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: json
CODE:
```
{
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGB{LONG_MIDDLE_SEQUENCE}KKACiiigAooooAKKKKACiiigD//2Q=="
}
```

----------------------------------------

TITLE: Call Mistral AI OCR API with Custom Schemas (cURL)
DESCRIPTION: Example cURL command demonstrating how to invoke the Mistral AI OCR API. It includes setting `Content-Type` and `Authorization` headers, and passing a JSON payload that defines the document, pages, and custom JSON schemas for `bbox_annotation_format` and `document_annotation_format`.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: bash
CODE:
```
curl --location 'https://api.mistral.ai/v1/ocr' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${MISTRAL_API_KEY}" \
--data '{
    "model": "mistral-ocr-latest",
    "document": {"document_url": "https://arxiv.org/pdf/2410.07073"},
    "pages": [0, 1, 2, 3, 4, 5, 6, 7],
    "bbox_annotation_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "properties": {
                    "document_type": {"title": "Document_Type", "type": "string"},
                    "short_description": {"title": "Short_Description", "type": "string"},
                    "summary": {"title": "Summary", "type": "string"}
                },
                "required": ["document_type", "short_description", "summary"],
                "title": "BBOXAnnotation",
                "type": "object",
                "additionalProperties": false
            },
            "name": "document_annotation",
            "strict": true
        }
    },
    "document_annotation_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "properties": {
                    "language": {"title": "Language", "type": "string"},
                    "chapter_titles": {"title": "Chapter_Titles", "type": "string"},
                    "urls": {"title": "urls", "type": "string"}
                },
                "required": ["language", "chapter_titles", "urls"],
                "title": "DocumentAnnotation",
                "type": "object",
                "additionalProperties": false
            },
            "name": "document_annotation",
            "strict": true
        }
    },
    "include_image_base64": true
}'
```

----------------------------------------

TITLE: Direct OCR Document Processing via cURL API
DESCRIPTION: Provides a cURL command for direct interaction with the Mistral AI OCR API endpoint. This example demonstrates how to send a JSON payload specifying the model, document, pages, and a custom JSON schema for structured annotation.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: curl
CODE:
```
curl --location 'https://api.mistral.ai/v1/ocr' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer ${MISTRAL_API_KEY}" \
--data '{
    "model": "mistral-ocr-latest",
    "document": {"document_url": "https://arxiv.org/pdf/2410.07073"},
    "pages": [0, 1, 2, 3, 4, 5, 6, 7],
    "document_annotation_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "properties": {
                    "language": {"title": "Language", "type": "string"},
                    "chapter_titles": {"title": "Chapter_Titles", "type": "string"},
                    "urls": {"title": "urls", "type": "string"}
                },
                "required": ["language", "chapter_titles", "urls"],
                "title": "DocumentAnnotation",
                "type": "object",
                "additionalProperties": false
            },
            "name": "document_annotation",
            "strict": true
        }
    },
    "include_image_base64": true
}'
```

----------------------------------------

TITLE: Mistral AI Core API Endpoints: OCR and Classifiers
DESCRIPTION: Defines the API endpoints for Optical Character Recognition (OCR), general text classification, and chat-based classification services. Each endpoint specifies its summary, operation ID, required request body schema, and possible successful (200) and validation error (422) responses.
SOURCE: https://docs.mistral.ai/redocusaurus/plugin-redoc-0

LANGUAGE: APIDOC
CODE:
```
/v1/ocr:
  post:
    summary: OCR
    operationId: ocr_v1_ocr_post
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/OCRRequest'
      required: true
    responses:
      '200':
        description: Successful Response
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OCRResponse'
      '422':
        description: Validation Error
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HTTPValidationError'
    tags:
      - ocr

/v1/classifications:
  post:
    summary: Classifications
    operationId: classifications_v1_classifications_post
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ClassificationRequest'
      required: true
    responses:
      '200':
        description: Successful Response
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ClassificationResponse'
      '422':
        description: Validation Error
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HTTPValidationError'
    tags:
      - classifiers

/v1/chat/classifications:
  post:
    summary: Chat Classifications
    operationId: chat_classifications_v1_chat_classifications_post
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ChatClassificationRequest'
      required: true
    responses:
      '200':
        description: Successful Response
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ClassificationResponse'
      '422':
        description: Validation Error
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HTTPValidationError'
    tags:
      - classifiers
```

----------------------------------------

TITLE: Example OCR Output: BBOX Annotation
DESCRIPTION: Provides an example of the structured JSON output generated by the Mistral AI OCR API for bounding box annotations, conforming to the defined `BBOXAnnotation` schema. It includes extracted fields like image type, short description, and summary for a visual element.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: json
CODE:
```
{
  "image_type": "scatter plot",
  "short_description": "Comparison of different models based on performance and cost.",
  "summary": "The image consists of two scatter plots comparing various models on two different performance metrics against their cost or number of parameters. The left plot shows performance on the MM-MT-Bench, while the right plot shows performance on the LMSys-Vision ELO. Each point represents a different model, with the x-axis indicating the cost or number of parameters in billions (B) and the y-axis indicating the performance score. The shaded region in both plots highlights the best performance/cost ratio, with Pixtral 12B positioned within this region in both plots, suggesting it offers a strong balance of performance and cost efficiency. Other models like Qwen-2-VL 72B and Qwen-2-VL 7B also show high performance but at varying costs."
}
```

----------------------------------------

TITLE: Initialize Mistral AI Client for Document Annotation
DESCRIPTION: This Python snippet demonstrates how to initialize the Mistral AI client using an API key retrieved from environment variables. It imports necessary modules for handling document and image URL chunks, response formats, and specifically highlights the use of `response_format_from_pydantic_model` to enforce a predefined Pydantic model for the AI's response.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: python
CODE:
```
import os
from mistralai import Mistral, DocumentURLChunk, ImageURLChunk, ResponseFormat
from mistralai.extra import response_format_from_pydantic_model

api_key = os.environ["MISTRAL_API_KEY"]

client = Mistral(api_key=api_key)

```

----------------------------------------

TITLE: Example OCR Output: Image Base64
DESCRIPTION: Illustrates the structure of the JSON output when `include_image_base64` is set to true in the OCR API request. It shows a truncated base64 encoded string representing the processed image.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: json
CODE:
```
{
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGB{LONG_MIDDLE_SEQUENCE}KKACiiigAooooAKKKKACiiigD//2Q=="
}
```

----------------------------------------

TITLE: Define Annotation Data Models with Pydantic (Python)
DESCRIPTION: Defines Python Pydantic `BaseModel` classes for both BBox Annotation (`Image`) and Document Annotation. These models provide a clear, type-hinted structure for parsing and validating OCR service responses.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: python
CODE:
```
from pydantic import BaseModel

# BBOX Annotation response format
class Image(BaseModel):
  image_type: str
  short_description: str
  summary: str

# Document Annotation response format
class Document(BaseModel):
  language: str
  chapter_titles: list[str]
  urls: list[str]
```

----------------------------------------

TITLE: OCRRequest Schema Definition
DESCRIPTION: Defines the structure for an OCR request, specifying required fields like 'document' and 'model' for structured output extraction. It ensures that only 'json_schema' is a valid format for this field.
SOURCE: https://docs.mistral.ai/redocusaurus/plugin-redoc-0

LANGUAGE: APIDOC
CODE:
```
OCRRequest:
  Structured output class for extracting useful information from the
  entire document. Only json_schema is valid for this field
  additionalProperties: false
  type: object
  required:
    - document
    - model
  title: OCRRequest
```

----------------------------------------

TITLE: Retrieve File Metadata and API Response Schema from Mistral AI
DESCRIPTION: This snippet shows how to retrieve metadata for an uploaded file using its ID. This operation allows checking the status and details of previously uploaded documents. An example of the expected JSON response structure for a retrieved file is also provided.
SOURCE: https://docs.mistral.ai/capabilities/OCR/basic_ocr

LANGUAGE: python
CODE:
```
retrieved_file = client.files.retrieve(file_id=uploaded_pdf.id)
```

LANGUAGE: typescript
CODE:
```
const retrievedFile = await client.files.retrieve({
    fileId: uploadedPdf.id
});
```

LANGUAGE: curl
CODE:
```
curl -X GET "https://api.mistral.ai/v1/files/$id" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer $MISTRAL_API_KEY"
```

LANGUAGE: APIDOC
CODE:
```
File Object Schema:
id: string (Unique identifier for the file)
object: string (Type of object, always 'file')
size_bytes: integer (Size of the file in bytes)
created_at: integer (Unix timestamp when the file was created)
filename: string (Original name of the uploaded file)
purpose: string (Purpose of the file, e.g., 'ocr')
sample_type: string (Type of sample, e.g., 'ocr_input')
source: string (Source of the file, e.g., 'upload')
deleted: boolean (Indicates if the file has been deleted)
num_lines: integer or null (Number of lines, if applicable)

Example Response:
id='00edaf84-95b0-45db-8f83-f71138491f23' object='file' size_bytes=3749788 created_at=1741023462 filename='uploaded_file.pdf' purpose='ocr' sample_type='ocr_input' source='upload' deleted=False num_lines=None
```

----------------------------------------

TITLE: Define Basic Annotation Data Models with Zod (TypeScript)
DESCRIPTION: Illustrates how to define basic structured data models for bounding box (`ImageSchema`) and document (`DocumentSchema`) annotations using Zod schemas. These schemas enforce the expected response format from the Mistral AI OCR service.
SOURCE: https://docs.mistral.ai/capabilities/OCR/annotations

LANGUAGE: typescript
CODE:
```
import { z } from 'zod';

// BBOX Annotation response format
const ImageSchema = z.object({
  image_type: z.string(),
  short_description: z.string(),
  summary: z.string(),
});

// Document Annotation response format
const DocumentSchema = z.object({
  language: z.string(),
  chapter_titles: z.array(z.string()),
  urls: z.array(z.string()),
});
```