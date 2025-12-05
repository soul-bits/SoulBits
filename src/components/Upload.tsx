import { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { parseResumeFile, estimateTokenCount } from '../utils/parseFile';
import { FeedbackType } from './TypeSelector';

interface UploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
  feedbackType: FeedbackType;
}

export function UploadComponent({ onTextExtracted, feedbackType }: UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      const text = await parseResumeFile(file);
      const tokenCount = estimateTokenCount(text);

      // Warn about large files
      if (tokenCount > 8000) {
        setError(`Warning: This resume is quite large (~${tokenCount} tokens). It may exceed API limits.`);
      }

      setUploadedFile(file.name);
      onTextExtracted(text, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2>Upload {feedbackType === 'resume' ? 'Resume' : 'LinkedIn Profile'}</h2>
        <span className="text-muted-foreground">PDF or DOCX</span>
      </div>

      {!uploadedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
            ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="mb-2">
            {isProcessing ? 'Processing...' : 'Drag & drop your resume here'}
          </p>
          <p className="text-muted-foreground">or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border rounded-lg p-4 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <span>{uploadedFile}</span>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 hover:bg-destructive/10 rounded transition-colors"
          >
            <X className="w-5 h-5 text-destructive" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-yellow-700">{error}</p>
        </div>
      )}
    </div>
  );
}