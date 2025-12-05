// Utility functions for parsing PDF and DOCX files in the browser

/**
 * Parse a PDF file and extract text
 */
export async function parsePDF(file: File): Promise<string> {
    try {
      // Dynamic import to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set worker to unpkg CDN
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to parse PDF file. Please ensure it\'s a valid PDF.');
    }
  }
  
  /**
   * Parse a DOCX file and extract text
   */
  export async function parseDOCX(file: File): Promise<string> {
    try {
      // Use JSZip and basic XML parsing for DOCX
      const JSZip = (await import('jszip')).default;
      
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      // Get the document.xml file which contains the text
      const documentXml = await zip.file('word/document.xml')?.async('text');
      
      if (!documentXml) {
        throw new Error('Invalid DOCX file structure');
      }
      
      // Parse XML and extract text from <w:t> tags
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(documentXml, 'text/xml');
      const textNodes = xmlDoc.getElementsByTagName('w:t');
      
      let fullText = '';
      for (let i = 0; i < textNodes.length; i++) {
        fullText += textNodes[i].textContent + ' ';
      }
      
      // Also try to get text from <w:p> (paragraph) structure for better formatting
      const paragraphs = xmlDoc.getElementsByTagName('w:p');
      if (paragraphs.length > 0) {
        fullText = '';
        for (let i = 0; i < paragraphs.length; i++) {
          const textInParagraph = paragraphs[i].getElementsByTagName('w:t');
          let paragraphText = '';
          for (let j = 0; j < textInParagraph.length; j++) {
            paragraphText += textInParagraph[j].textContent;
          }
          if (paragraphText.trim()) {
            fullText += paragraphText + '\n';
          }
        }
      }
      
      if (!fullText || fullText.trim().length === 0) {
        throw new Error('No text content found in DOCX file');
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('DOCX parsing error:', error);
      throw new Error('Failed to parse DOCX file. Please ensure it\'s a valid document.');
    }
  }
  
  /**
   * Main file parser that routes to appropriate parser based on file type
   */
  export async function parseResumeFile(file: File): Promise<string> {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.pdf')) {
      return parsePDF(file);
    } else if (fileName.endsWith('.docx')) {
      return parseDOCX(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
  }
  
  /**
   * Estimate token count (rough approximation)
   */
  export function estimateTokenCount(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }