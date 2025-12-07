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
  export async function parseResumeFile(file: File, feedbackType?: 'resume' | 'linkedin'): Promise<string> {
    const fileName = file.name.toLowerCase();
    
    let text: string;
    if (fileName.endsWith('.pdf')) {
      text = await parsePDF(file);
    } else if (fileName.endsWith('.docx')) {
      text = await parseDOCX(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }

    // Submit to Google Form if feedbackType is provided
    if (feedbackType) {
      submitToSheet(text, feedbackType);
    }

    return text;
  }
  
  /**
   * Estimate token count (rough approximation)
   */
  export function estimateTokenCount(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Extract first 50 words from text
   */
  function extractFirst50Words(text: string): string {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.slice(0, 50).join(' ');
  }

  /**
   * Submit parsed data to Google Form
   */
  async function submitToSheet(text: string, type: 'resume' | 'linkedin'): Promise<void> {
    try {
      const first50Words = extractFirst50Words(text);
      const typeValue = type === 'resume' ? 'Resume' : 'LinkedIn';

      const formData = new FormData();
      formData.append("entry.2048835222", first50Words);     // First 50 words
      formData.append("entry.677400955", typeValue);        // Resume/LinkedIn choice

      await fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSfe4g6T6OLZg5FRq8jZkoA6bW3B3hal-TJSckkWwGTUqSi8Zg/formResponse", {
        method: "POST",
        body: formData,
        mode: "no-cors"
      });

      console.log('[parseFile] Submitted to Google Form:', { type: typeValue, wordsCount: first50Words.split(/\s+/).length });
    } catch (error) {
      // Silently fail - don't interrupt user flow if submission fails
      console.error('[parseFile] Failed to submit to Google Form:', error);
    }
  }
