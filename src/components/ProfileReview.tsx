import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileCheck, Shield, Lock, Server, ArrowLeft } from 'lucide-react';
import { ProfileUpload } from './ProfileUpload';
import { KeyInput } from './KeyInput';
import { ProfileOutput } from './ProfileOutput';
import { TypeSelector, FeedbackType } from './TypeSelector';
import { callLLM, loadSystemPrompt, APIProvider } from '../utils/callLLM';
import { Button } from './ui/button';

export function ProfileReview() {
  const handleBack = () => {
    window.location.hash = '#services';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('resume');
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [provider, setProvider] = useState<APIProvider | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [tokensUsed, setTokensUsed] = useState<number | undefined>(undefined);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextExtracted = (text: string, name: string) => {
    console.log('[ProfileReview] Text extracted:', { name, textLength: text.length });
    setResumeText(text);
    setFileName(name);
    setFeedback(null);
    setError(null);
  };

  const handleKeyChange = (key: string, prov: APIProvider) => {
    console.log('[ProfileReview] Key changed:', { provider: prov, keyLength: key.length, keyPrefix: key.substring(0, 5) + '...' });
    setApiKey(key);
    setProvider(prov);
  };

  const handleTypeChange = (type: FeedbackType) => {
    console.log('[ProfileReview] Type changed:', type);
    setFeedbackType(type);
    setResumeText(null);
    setFileName(null);
    setFeedback(null);
    setError(null);
  };

  const handleReview = async () => {
    console.log('[ProfileReview] Review button clicked');
    console.log('[ProfileReview] Current state:', {
      hasResumeText: !!resumeText,
      resumeTextLength: resumeText?.length || 0,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      provider,
      feedbackType,
      isReviewing,
    });

    if (!resumeText || !apiKey || !provider) {
      const missing: string[] = [];
      if (!resumeText) missing.push('resume text');
      if (!apiKey) missing.push('API key');
      if (!provider) missing.push('provider');
      console.warn('[ProfileReview] Cannot review - missing:', missing);
      setError(`Please provide: ${missing.join(', ')}`);
      return;
    }

    console.log('[ProfileReview] Starting review process...');
    setIsReviewing(true);
    setError(null);
    setFeedback(null);

    try {
      console.log('[ProfileReview] Loading system prompt for type:', feedbackType);
      const systemPrompt = await loadSystemPrompt(feedbackType);
      console.log('[ProfileReview] System prompt loaded, length:', systemPrompt.length);
      
      const contentType = feedbackType === 'resume' ? 'resume' : 'LinkedIn profile';
      console.log('[ProfileReview] Calling LLM API:', { provider, contentType, textLength: resumeText.length });
      
      const response = await callLLM({
        provider,
        apiKey,
        systemPrompt,
        userMessage: `Please review the following ${contentType}:\n\n${resumeText}`,
      });

      console.log('[ProfileReview] LLM response received:', { 
        contentLength: response.content?.length || 0,
        tokensUsed: response.tokensUsed 
      });
      
      setFeedback(response.content);
      setTokensUsed(response.tokensUsed);
      console.log('[ProfileReview] Review completed successfully');
    } catch (err) {
      console.error('[ProfileReview] Error during review:', err);
      setError(err instanceof Error ? err.message : 'Failed to get AI feedback');
    } finally {
      setIsReviewing(false);
      console.log('[ProfileReview] Review process finished');
    }
  };

  const canReview = resumeText && apiKey && provider && !isReviewing;
  
  // Debug logging for canReview state
  console.log('[ProfileReview] Render state:', {
    canReview,
    hasResumeText: !!resumeText,
    hasApiKey: !!apiKey,
    provider,
    isReviewing,
  });

  return (
    <section id="services/profile-review" className="py-24 bg-gradient-to-b from-background to-muted/30 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-4">Get Your Profile Review</h2>
          <p className="text-xl text-muted-foreground mb-2">
            AI-powered feedback for your resume & LinkedIn profile
          </p>
          <p className="text-primary italic">Get expert insights to improve your professional presence.</p>
        </motion.div>

        {/* Privacy Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-2 border-green-500/40 rounded-xl mb-8 shadow-lg shadow-green-500/10"
        >
          <div className="px-8 py-6">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                🔒 Your Privacy is Protected
              </h3>
              <p className="text-green-600 dark:text-green-300 text-sm">
                Everything is processed locally in your browser - nothing is stored or sent to our servers
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-green-700 dark:text-green-400">
              <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 px-4 py-3 rounded-lg">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                <span className="font-semibold">No Files Stored</span>
              </div>
              <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 px-4 py-3 rounded-lg">
                <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                <span className="font-semibold">No API Keys Stored</span>
              </div>
              <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 px-4 py-3 rounded-lg">
                <Server className="w-6 h-6 text-green-600 dark:text-green-400" />
                <span className="font-semibold">No Backend Used</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8 mb-8"
        >
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <TypeSelector selectedType={feedbackType} onTypeChange={handleTypeChange} />
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <ProfileUpload onTextExtracted={handleTextExtracted} feedbackType={feedbackType} />
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <KeyInput onKeyChange={handleKeyChange} />
            </div>

            <Button
              onClick={(e) => {
                console.log('[ProfileReview] Button onClick triggered', { canReview, disabled: !canReview });
                e.preventDefault();
                handleReview();
              }}
              disabled={!canReview}
              variant={canReview ? "default" : "secondary"}
              size="lg"
              className="w-full shadow-md hover:shadow-lg"
            >
              {isReviewing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Reviewing...
                </span>
              ) : (
                `Review ${feedbackType === 'resume' ? 'Resume' : 'LinkedIn Profile'}`
              )}
            </Button>

            {/* Debug info */}
            <div className="p-4 bg-muted/50 border rounded-lg text-xs space-y-1">
              <div className="font-semibold mb-2">Debug Info:</div>
              <div>Has File: {resumeText ? `✓ (${resumeText.length} chars)` : '✗'}</div>
              <div>Has API Key: {apiKey ? `✓ (${apiKey.length} chars)` : '✗'}</div>
              <div>Provider: {provider || 'Not set'}</div>
              <div>Can Review: {canReview ? '✓' : '✗'}</div>
              <div>Is Reviewing: {isReviewing ? 'Yes' : 'No'}</div>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {feedback ? (
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <ProfileOutput feedback={feedback} fileName={fileName || undefined} tokensUsed={tokensUsed} />
              </div>
            ) : (
              <div className="bg-card border rounded-lg p-12 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <FileCheck className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-muted-foreground mb-2">No feedback yet</h3>
                <p className="text-muted-foreground">
                  Select a type, upload your file, and enter your API key to get started
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-muted/50 border rounded-lg p-6 mt-8"
        >
          <h3 className="mb-3">How It Works</h3>
          <ol className="space-y-4 text-muted-foreground list-decimal list-inside">
            <li>1. Choose whether you're uploading a Resume or LinkedIn Profile</li>
            <li>2. Upload your file (PDF or DOCX) - parsed locally in your browser</li>
            <li>3. Enter your OpenAI or Gemini API key - stored only in memory</li>
            <li>4. Click "Review" - sends your content to the AI provider you chose</li>
            <li>5. Get detailed feedback - displayed instantly in the browser</li>
          </ol>
          <p className="mt-4 text-muted-foreground">
            <br/>
            <strong>Privacy guaranteed:</strong> Your files never touch our servers. Everything is processed entirely in your browser, and only sent directly to OpenAI or Gemini based on your API key choice.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

