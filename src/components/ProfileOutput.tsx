import { Copy, CheckCircle, Sparkles, Download, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  // Helper function to parse inline markdown (bold, italic) in text
  const parseInlineMarkdown = (text: string): Array<{ text: string; bold: boolean; italic: boolean }> => {
    const parts: Array<{ text: string; bold: boolean; italic: boolean }> = [];
    let currentText = '';
    let inBold = false;
    let inItalic = false;
    let i = 0;

    while (i < text.length) {
      // Check for bold (**text**)
      if (i < text.length - 1 && text[i] === '*' && text[i + 1] === '*' && !inItalic) {
        if (currentText) {
          parts.push({ text: currentText, bold: inBold, italic: inItalic });
          currentText = '';
        }
        inBold = !inBold;
        i += 2;
        continue;
      }
      // Check for italic (*text* or _text_)
      else if ((text[i] === '*' || text[i] === '_') && !inBold) {
        if (currentText) {
          parts.push({ text: currentText, bold: inBold, italic: inItalic });
          currentText = '';
        }
        inItalic = !inItalic;
        i += 1;
        continue;
      }
      else {
        currentText += text[i];
        i += 1;
      }
    }

    if (currentText) {
      parts.push({ text: currentText, bold: inBold, italic: inItalic });
    }

    return parts;
  };

  // Helper function to render text with inline formatting in PDF
  const renderFormattedText = (doc: any, text: string, x: number, y: number, maxWidth: number, fontSize: number): number => {
    const parts = parseInlineMarkdown(text);
    let currentX = x;
    let currentY = y;
    let lineHeight = fontSize * 1.2;

    for (const part of parts) {
      doc.setFontSize(fontSize);
      if (part.bold && part.italic) {
        doc.setFont('helvetica', 'bolditalic');
      } else if (part.bold) {
        doc.setFont('helvetica', 'bold');
      } else if (part.italic) {
        doc.setFont('helvetica', 'italic');
      } else {
        doc.setFont('helvetica', 'normal');
      }

      const words = part.text.split(' ');
      for (const word of words) {
        const testText = currentX === x ? word : ` ${word}`;
        const textWidth = doc.getTextWidth(testText);
        
        if (currentX + textWidth > x + maxWidth && currentX > x) {
          currentX = x;
          currentY += lineHeight;
        }

        if (currentX === x) {
          doc.text(word, currentX, currentY);
        } else {
          doc.text(` ${word}`, currentX, currentY);
        }
        currentX += textWidth;
      }
    }

    return currentY + lineHeight;
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
      let inList = false;
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Check if we need a new page
        if (yPosition > pageHeight - margin - 10) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Skip empty lines but add spacing
        if (line.trim() === '') {
          if (inList) {
            yPosition += 2; // Less spacing in lists
            inList = false;
          } else {
            yPosition += 4;
          }
          continue;
        }
        
        // Handle headers with proper spacing
        if (line.startsWith('# ')) {
          yPosition += 4; // Space before heading
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          const text = line.substring(2).trim();
          const wrappedLines = doc.splitTextToSize(text, maxWidth);
          wrappedLines.forEach((l: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(l, margin, yPosition);
            yPosition += 8;
          });
          yPosition += 4; // Space after heading
          inList = false;
        } else if (line.startsWith('## ')) {
          yPosition += 3; // Space before heading
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          const text = line.substring(3).trim();
          const wrappedLines = doc.splitTextToSize(text, maxWidth);
          wrappedLines.forEach((l: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(l, margin, yPosition);
            yPosition += 7;
          });
          yPosition += 3; // Space after heading
          inList = false;
        } else if (line.startsWith('### ')) {
          yPosition += 2; // Space before heading
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          const text = line.substring(4).trim();
          const wrappedLines = doc.splitTextToSize(text, maxWidth);
          wrappedLines.forEach((l: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(l, margin, yPosition);
            yPosition += 6;
          });
          yPosition += 2; // Space after heading
          inList = false;
        } else if (line.startsWith('#### ')) {
          yPosition += 2;
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          const text = line.substring(5).trim();
          const wrappedLines = doc.splitTextToSize(text, maxWidth);
          wrappedLines.forEach((l: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(l, margin, yPosition);
            yPosition += 5;
          });
          yPosition += 2;
          inList = false;
        }
        // Handle bullet points (with indentation support)
        else if (line.match(/^[\-\*]\s/)) {
          inList = true;
          doc.setFontSize(11);
          const text = line.substring(2).trim();
          
          // Check for indentation (tabs or spaces at start)
          const indentMatch = line.match(/^(\s+)[\-\*]/);
          const indentLevel = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0;
          const indent = indentLevel * 8;
          
          // Render formatted text with bullet
          if (yPosition > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }
          
          doc.setFont('helvetica', 'normal');
          doc.text('•', margin + indent, yPosition);
          
          // Render the text with inline formatting
          const textParts = parseInlineMarkdown(text);
          let textX = margin + indent + 6;
          let textY = yPosition;
          
          for (const part of textParts) {
            doc.setFontSize(11);
            if (part.bold && part.italic) {
              doc.setFont('helvetica', 'bolditalic');
            } else if (part.bold) {
              doc.setFont('helvetica', 'bold');
            } else if (part.italic) {
              doc.setFont('helvetica', 'italic');
            } else {
              doc.setFont('helvetica', 'normal');
            }
            
            const words = part.text.split(' ');
            for (const word of words) {
              const spaceWidth = doc.getTextWidth(' ');
              const wordWidth = doc.getTextWidth(word);
              const testWidth = textX === margin + indent + 6 ? wordWidth : spaceWidth + wordWidth;
              
              if (textX + testWidth > margin + maxWidth && textX > margin + indent + 6) {
                textX = margin + indent + 6;
                textY += 6;
                if (textY > pageHeight - margin) {
                  doc.addPage();
                  textY = margin;
                }
              }
              
              if (textX === margin + indent + 6) {
                doc.text(word, textX, textY);
                textX += wordWidth;
              } else {
                doc.text(` ${word}`, textX, textY);
                textX += spaceWidth + wordWidth;
              }
            }
          }
          
          yPosition = textY + 5;
        }
        // Handle numbered lists
        else if (line.match(/^\d+\.\s/)) {
          inList = true;
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          const match = line.match(/^(\d+)\.\s(.*)$/);
          if (match) {
            const number = match[1];
            const text = match[2].trim();
            
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            
            doc.text(`${number}.`, margin + 2, yPosition);
            
            // Render formatted text
            const textParts = parseInlineMarkdown(text);
            let textX = margin + 12;
            let textY = yPosition;
            
            for (const part of textParts) {
              doc.setFontSize(11);
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              const words = part.text.split(' ');
              for (const word of words) {
                const spaceWidth = doc.getTextWidth(' ');
                const wordWidth = doc.getTextWidth(word);
                const testWidth = textX === margin + 12 ? wordWidth : spaceWidth + wordWidth;
                
                if (textX + testWidth > margin + maxWidth && textX > margin + 12) {
                  textX = margin + 12;
                  textY += 6;
                  if (textY > pageHeight - margin) {
                    doc.addPage();
                    textY = margin;
                  }
                }
                
                if (textX === margin + 12) {
                  doc.text(word, textX, textY);
                  textX += wordWidth;
                } else {
                  doc.text(` ${word}`, textX, textY);
                  textX += spaceWidth + wordWidth;
                }
              }
            }
            
            yPosition = textY + 5;
          }
        }
        // Regular text with inline formatting
        else {
          inList = false;
          doc.setFontSize(11);
          
          // Handle indentation (tabs or leading spaces)
          const indentMatch = line.match(/^(\s+)/);
          const indentLevel = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0;
          const indent = indentLevel * 8;
          const text = line.trim();
          
          // Render formatted text
          const textParts = parseInlineMarkdown(text);
          let textX = margin + indent;
          let textY = yPosition;
          
          for (const part of textParts) {
            doc.setFontSize(11);
            if (part.bold && part.italic) {
              doc.setFont('helvetica', 'bolditalic');
            } else if (part.bold) {
              doc.setFont('helvetica', 'bold');
            } else if (part.italic) {
              doc.setFont('helvetica', 'italic');
            } else {
              doc.setFont('helvetica', 'normal');
            }
            
            const words = part.text.split(' ');
            for (const word of words) {
              const spaceWidth = doc.getTextWidth(' ');
              const wordWidth = doc.getTextWidth(word);
              const testWidth = textX === margin + indent ? wordWidth : spaceWidth + wordWidth;
              
              if (textX + testWidth > margin + maxWidth && textX > margin + indent) {
                textX = margin + indent;
                textY += 6;
                if (textY > pageHeight - margin) {
                  doc.addPage();
                  textY = margin;
                }
              }
              
              if (textX === margin + indent) {
                doc.text(word, textX, textY);
                textX += wordWidth;
              } else {
                doc.text(` ${word}`, textX, textY);
                textX += spaceWidth + wordWidth;
              }
            }
          }
          
          yPosition = textY + 5;
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-sm border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold">AI Feedback</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 border border-border/50 rounded-xl hover:bg-muted/80 transition-all duration-200 hover:shadow-md hover:border-primary/30 text-sm md:text-base font-medium"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="flex items-center gap-2 px-4 py-2 border border-border/50 rounded-xl hover:bg-muted/80 transition-all duration-200 hover:shadow-md hover:border-primary/30 text-sm md:text-base font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-background border border-border/50 rounded-xl shadow-xl z-10 overflow-hidden backdrop-blur-sm">
                <button
                  onClick={handleDownloadMarkdown}
                  className="w-full text-left px-4 py-3 hover:bg-muted/80 transition-colors text-sm md:text-base"
                >
                  Markdown (.md)
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="w-full text-left px-4 py-3 hover:bg-muted/80 transition-colors text-sm md:text-base border-t border-border/50"
                >
                  PDF (.pdf)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {fileName && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-muted-foreground p-4 bg-muted/40 rounded-xl border border-border/50 shadow-sm">
          <span className="text-sm md:text-base font-medium">Review for: <span className="text-foreground">{fileName}</span></span>
          {tokensUsed && (
            <span className="text-xs md:text-sm px-3 py-1 bg-primary/10 text-primary rounded-lg font-medium">
              {tokensUsed.toLocaleString()} tokens used
            </span>
          )}
        </div>
      )}

      <div className="border border-border/50 rounded-xl p-6 md:p-8 bg-background/50 max-h-[70vh] overflow-y-auto markdown-content shadow-inner">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {feedback}
        </ReactMarkdown>
      </div>
    </div>
  );
}

