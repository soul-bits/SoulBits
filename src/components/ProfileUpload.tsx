import { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { parseResumeFile, estimateTokenCount } from '../utils/parseFile';
import { FeedbackType } from './TypeSelector';

interface ProfileUploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
  feedbackType: FeedbackType;
}

export function ProfileUpload({ onTextExtracted, feedbackType }: ProfileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    console.log('[ProfileUpload] File selected:', { name: file.name, size: file.size, type: file.type });
    setError(null);
    setIsProcessing(true);

    try {
      console.log('[ProfileUpload] Parsing file...');
      const text = await parseResumeFile(file, feedbackType);
      console.log('[ProfileUpload] File parsed successfully, text length:', text.length);
      const tokenCount = estimateTokenCount(text);
      console.log('[ProfileUpload] Estimated tokens:', tokenCount);

      // Warn about large files
      if (tokenCount > 8000) {
        setError(`Warning: This ${feedbackType === 'resume' ? 'resume' : 'profile'} is quite large (~${tokenCount} tokens). It may exceed API limits.`);
      }

      setUploadedFile(file.name);
      onTextExtracted(text, file.name);
      console.log('[ProfileUpload] File processing complete');
    } catch (err) {
      console.error('[ProfileUpload] Error processing file:', err);
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
        <h2 className="text-base md:text-lg font-semibold">Upload {feedbackType === 'resume' ? 'Resume' : 'LinkedIn Profile'}</h2>
        <span className="text-xs md:text-sm text-muted-foreground px-2 py-1 bg-muted/50 rounded-lg">PDF or DOCX</span>
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
            border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer
            transition-all duration-300 min-h-[200px] md:min-h-[240px] flex flex-col items-center justify-center
            ${isDragging ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-muted/30'}
            ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 p-3 rounded-full bg-muted/50 flex items-center justify-center">
            <Upload className={`w-6 h-6 md:w-8 md:h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'} transition-colors`} />
          </div>
          <p className="mb-2 font-semibold text-sm md:text-base">
            {isProcessing ? 'Processing...' : `Drag & drop your ${feedbackType === 'resume' ? 'resume' : 'LinkedIn profile'} here`}
          </p>
          <p className="text-muted-foreground text-xs md:text-sm">or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border border-border/50 rounded-xl p-4 flex items-center justify-between bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-sm border border-primary/20">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium text-sm md:text-base">{uploadedFile}</span>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group"
            title="Remove file"
          >
            <X className="w-5 h-5 text-destructive group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl shadow-sm">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm md:text-base text-yellow-700 dark:text-yellow-600">{error}</p>
        </div>
      )}
    </div>
  );
}

