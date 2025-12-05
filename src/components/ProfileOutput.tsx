import { Copy, CheckCircle, Sparkles, Download, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ProfileOutputProps {
  feedback: string;
  fileName?: string;
  tokensUsed?: number;
}

export function ProfileOutput({ feedback, fileName, tokensUsed }: ProfileOutputProps) {
  const [copied, setCopied] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(feedback);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([feedback], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profile-feedback-${fileName ? fileName.replace(/\.[^/.]+$/, '') : 'review'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Configure PDF styling
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin;
      
      // Add title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Profile Feedback', margin, yPosition);
      yPosition += 10;
      
      if (fileName) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(`Review for: ${fileName}`, margin, yPosition);
        yPosition += 8;
        doc.setTextColor(0);
      }
      
      yPosition += 5;
      
      // Parse and render markdown
      const lines = feedback.split('\n');
      
      for (let line of lines) {
        // Check if we need a new page
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Skip empty lines but add spacing
        if (line.trim() === '') {
          yPosition += 4;
          continue;
        }
        
        // Handle headers
        if (line.startsWith('# ')) {
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          const text = line.substring(2);
          const wrappedLines = doc.splitTextToSize(text, maxWidth);
          wrappedLines.forEach((l: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(l, margin, yPosition);
            yPosition += 8;
          });
          yPosition += 2;
        } else if (line.startsWith('## ')) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          const text = line.substring(3);
          const wrappedLines = doc.splitTextToSize(text, maxWidth);
          wrappedLines.forEach((l: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(l, margin, yPosition);
            yPosition += 7;
          });
          yPosition += 2;
        } else if (line.startsWith('### ')) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          const text = line.substring(4);
          const wrappedLines = doc.splitTextToSize(text, maxWidth);
          wrappedLines.forEach((l: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(l, margin, yPosition);
            yPosition += 6;
          });
          yPosition += 2;
        }
        // Handle bullet points
        else if (line.match(/^[\-\*]\s/)) {
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          const text = line.substring(2);
          const wrappedLines = doc.splitTextToSize(text, maxWidth - 10);
          wrappedLines.forEach((l: string, index: number) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            if (index === 0) {
              doc.text('•', margin + 2, yPosition);
              doc.text(l, margin + 10, yPosition);
            } else {
              doc.text(l, margin + 10, yPosition);
            }
            yPosition += 6;
          });
        }
        // Handle numbered lists
        else if (line.match(/^\d+\.\s/)) {
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          const match = line.match(/^(\d+)\.\s(.*)$/);
          if (match) {
            const number = match[1];
            const text = match[2];
            const wrappedLines = doc.splitTextToSize(text, maxWidth - 12);
            wrappedLines.forEach((l: string, index: number) => {
              if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
              }
              if (index === 0) {
                doc.text(`${number}.`, margin + 2, yPosition);
                doc.text(l, margin + 12, yPosition);
              } else {
                doc.text(l, margin + 12, yPosition);
              }
              yPosition += 6;
            });
          }
        }
        // Regular text with bold/italic support
        else {
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          
          // Simple bold detection (just set entire line to bold if it contains **)
          if (line.includes('**')) {
            doc.setFont('helvetica', 'bold');
            line = line.replace(/\*\*/g, '');
          }
          
          const wrappedLines = doc.splitTextToSize(line, maxWidth);
          wrappedLines.forEach((l: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(l, margin, yPosition);
            yPosition += 6;
          });
        }
      }
      
      // Save PDF
      doc.save(`profile-feedback-${fileName ? fileName.replace(/\.[^/.]+$/, '') : 'review'}.pdf`);
      setShowDownloadMenu(false);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Failed to generate PDF. Please try downloading as Markdown instead.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2>AI Feedback</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-muted transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-muted transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
              <ChevronDown className="w-3 h-3" />
            </button>
            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-background border rounded-lg shadow-lg z-10">
                <button
                  onClick={handleDownloadMarkdown}
                  className="w-full text-left px-4 py-2 hover:bg-muted transition-colors rounded-t-lg"
                >
                  Markdown (.md)
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="w-full text-left px-4 py-2 hover:bg-muted transition-colors rounded-b-lg"
                >
                  PDF (.pdf)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {fileName && (
        <div className="flex items-center justify-between text-muted-foreground p-3 bg-muted/30 rounded-lg">
          <span>Review for: {fileName}</span>
          {tokensUsed && <span>{tokensUsed} tokens used</span>}
        </div>
      )}

      <div className="border rounded-lg p-6 bg-background max-h-[600px] overflow-y-auto prose prose-sm max-w-none whitespace-pre-wrap">
        <ReactMarkdown>{feedback}</ReactMarkdown>
      </div>
    </div>
  );
}

