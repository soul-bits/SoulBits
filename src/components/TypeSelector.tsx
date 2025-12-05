import { FileText, Linkedin } from 'lucide-react';

export type FeedbackType = 'resume' | 'linkedin';

interface TypeSelectorProps {
  selectedType: FeedbackType;
  onTypeChange: (type: FeedbackType) => void;
}

export function TypeSelector({ selectedType, onTypeChange }: TypeSelectorProps) {
  return (
    <div className="space-y-3">
      <h2>What are you uploading?</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onTypeChange('resume')}
          className={`
            flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all
            ${
              selectedType === 'resume'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/50'
            }
          `}
        >
          <FileText className={`w-8 h-8 ${selectedType === 'resume' ? 'text-primary' : 'text-muted-foreground'}`} />
          <div className="text-center">
            <div className={selectedType === 'resume' ? 'text-primary' : ''}>Resume</div>
            <p className="text-muted-foreground mt-1">PDF or DOCX format</p>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            selectedType === 'resume' ? 'border-primary' : 'border-muted-foreground'
          }`}>
            {selectedType === 'resume' && (
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            )}
          </div>
        </button>

        <button
          onClick={() => onTypeChange('linkedin')}
          className={`
            flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all
            ${
              selectedType === 'linkedin'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/50'
            }
          `}
        >
          <Linkedin className={`w-8 h-8 ${selectedType === 'linkedin' ? 'text-primary' : 'text-muted-foreground'}`} />
          <div className="text-center">
            <div className={selectedType === 'linkedin' ? 'text-primary' : ''}>LinkedIn Profile</div>
            <p className="text-muted-foreground mt-1">PDF export from LinkedIn</p>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            selectedType === 'linkedin' ? 'border-primary' : 'border-muted-foreground'
          }`}>
            {selectedType === 'linkedin' && (
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
