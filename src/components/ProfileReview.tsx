import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileCheck, Shield, Lock, Server, ArrowLeft, Eye, ChevronDown, ChevronUp, FileText, X, Clipboard, Sparkles } from 'lucide-react';
import { ProfileUpload } from './ProfileUpload';
import { KeyInput } from './KeyInput';
import { ProfileOutput } from './ProfileOutput';
import { TypeSelector, FeedbackType } from './TypeSelector';
import { callLLM, loadSystemPrompt, APIProvider } from '../utils/callLLM';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const [jobPosting, setJobPosting] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [tokensUsed, setTokensUsed] = useState<number | undefined>(undefined);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewStep, setReviewStep] = useState<'general' | 'keyword' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visualRulesContent, setVisualRulesContent] = useState<string | null>(null);
  const [showVisualRules, setShowVisualRules] = useState(false);
  const [jobPostingFocused, setJobPostingFocused] = useState(false);

  // Load visual rules when component mounts and feedbackType is resume
  useEffect(() => {
    if (feedbackType === 'resume') {
      fetch('/visual-rules.md')
        .then(response => response.text())
        .then(text => setVisualRulesContent(text))
        .catch(err => {
          console.error('[ProfileReview] Failed to load visual-rules.md:', err);
          setVisualRulesContent(null);
        });
    } else {
      setVisualRulesContent(null);
      setShowVisualRules(false);
    }
  }, [feedbackType]);

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
    // Only clear job posting if switching away from resume
    if (type !== 'resume') {
      setJobPosting('');
    }
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
      hasJobPosting: !!jobPosting.trim(),
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
    setReviewStep('general');
    setError(null);
    setFeedback(null);
    setTokensUsed(undefined);

    try {
      const contentType = feedbackType === 'resume' ? 'resume' : 'LinkedIn profile';
      let totalTokensUsed = 0;
      let generalReview = '';
      let keywordAnalysis = '';

      // Step 1: General Resume Review
      console.log('[ProfileReview] Step 1: Loading system prompt for general review');
      const systemPrompt = await loadSystemPrompt(feedbackType);
      console.log('[ProfileReview] System prompt loaded, length:', systemPrompt.length);
      
      console.log('[ProfileReview] Step 1: Calling LLM API for general review');
      const generalResponse = await callLLM({
        provider,
        apiKey,
        systemPrompt,
        userMessage: `Please review the following ${contentType}:\n\n${resumeText}`,
      });

      console.log('[ProfileReview] Step 1: General review completed', { 
        contentLength: generalResponse.content?.length || 0,
        tokensUsed: generalResponse.tokensUsed 
      });
      
      generalReview = generalResponse.content;
      if (generalResponse.tokensUsed) {
        totalTokensUsed += generalResponse.tokensUsed;
      }

      // Step 2: Keyword Optimization Analysis (only if job posting provided and resume type)
      if (feedbackType === 'resume' && jobPosting.trim()) {
        setReviewStep('keyword');
        console.log('[ProfileReview] Step 2: Job posting provided, starting keyword optimization analysis');
        try {
          // Load job posting rules using loadSystemPrompt
          const jobPostingRules = await loadSystemPrompt('job-posting');
          
          // Create system prompt for keyword optimization
          const keywordSystemPrompt = `# Keyword Optimization Analysis Instructions

${jobPostingRules}

## Your Task

Analyze the resume provided by the user against the job posting they provided. Focus specifically on:

1. **Keyword Extraction**: Identify key skills and keywords from the job posting
2. **Keyword Matching**: Analyze how well the resume matches these keywords
3. **Keyword Integration**: Evaluate where keywords appear (or should appear) in:
   - Professional title
   - Professional summary
   - Areas of expertise section
   - Professional experience bullet points
4. **Missing Keywords**: Identify important keywords from the job posting that are missing from the resume
5. **Recommendations**: Provide specific, actionable recommendations for improving keyword optimization

Be specific and provide concrete examples. Reference the actual job posting requirements when making recommendations.

## Job Posting

${jobPosting.trim()}

## Resume

${resumeText}`;

          console.log('[ProfileReview] Step 2: Calling LLM API for keyword optimization');
          const keywordResponse = await callLLM({
            provider,
            apiKey,
            systemPrompt: keywordSystemPrompt,
            userMessage: `Please analyze the resume above against the job posting provided in the system instructions. Focus on keyword optimization, matching, and provide specific recommendations.`,
          });

          console.log('[ProfileReview] Step 2: Keyword optimization analysis completed', { 
            contentLength: keywordResponse.content?.length || 0,
            tokensUsed: keywordResponse.tokensUsed 
          });
          
          keywordAnalysis = keywordResponse.content;
          if (keywordResponse.tokensUsed) {
            totalTokensUsed += keywordResponse.tokensUsed;
          }
        } catch (err) {
          console.error('[ProfileReview] Step 2: Error during keyword optimization:', err);
          keywordAnalysis = `⚠️ **Error**: ${err instanceof Error ? err.message : 'Failed to analyze keyword optimization'}`;
        }
      }

      // Combine results
      let combinedFeedback = generalReview;
      if (keywordAnalysis) {
        combinedFeedback += `\n\n---\n\n# Step 2: Keyword Optimization Analysis\n\n${keywordAnalysis}`;
      }

      setFeedback(combinedFeedback);
      setTokensUsed(totalTokensUsed > 0 ? totalTokensUsed : undefined);
      console.log('[ProfileReview] Review completed successfully', {
        totalTokensUsed,
        hasKeywordAnalysis: !!keywordAnalysis
      });
    } catch (err) {
      console.error('[ProfileReview] Error during review:', err);
      setError(err instanceof Error ? err.message : 'Failed to get AI feedback');
    } finally {
      setIsReviewing(false);
      setReviewStep(null);
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-muted/50 border rounded-lg p-6 mt-8"
        >
          <h3 className="mb-3 font-semibold">How It Works</h3>
          <ol className="space-y-4 text-muted-foreground list-decimal list-inside">
            <li>1. Choose whether you're uploading a Resume or LinkedIn Profile</li>
            <li>2. Upload your file (PDF or DOCX) - parsed locally in your browser</li>
            <li>3. Enter your OpenAI or Gemini API key - stored only in memory</li>
            <li>4. Click "Review" - sends your content to the AI provider you chose</li>
            <li>5. Get detailed feedback - displayed instantly in the browser</li>
          </ol>
          
          <p className="mt-4 text-muted-foreground mt-8">
            <strong>Privacy guaranteed:</strong> Your files never touch our servers. Everything is processed entirely in your browser, and only sent directly to OpenAI or Gemini based on your API key choice.
          </p>
        </motion.div>
        
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-8 mb-8 mt-8"
        >
          <div className="space-y-6">
            {/* Step 1: Type Selection */}
            <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                  1
                </div>
                <h3 className="text-lg font-semibold">Select Review Type</h3>
              </div>
              <TypeSelector selectedType={feedbackType} onTypeChange={handleTypeChange} />
            </div>

            {/* Step 2: Upload & Job Description */}
            <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                  2
                </div>
                <h3 className="text-lg font-semibold">Upload Your {feedbackType === 'resume' ? 'Resume' : 'LinkedIn Profile'}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <ProfileUpload onTextExtracted={handleTextExtracted} feedbackType={feedbackType} />
                {/* Job Posting Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* <Clipboard className="w-5 h-5 text-primary" /> */}
                      <h2 className="text-base font-semibold">Job Description</h2>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">Optional</span>
                  </div>

                  {!jobPosting.trim() ? (
                    <div
                      onClick={() => {
                        const textarea = document.getElementById('job-posting');
                        textarea?.focus();
                      }}
                      className={`
                        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer relative
                        transition-colors min-h-[280px]
                        ${jobPostingFocused ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                      `}
                    >
                      {!jobPostingFocused && (
                        <div className="pointer-events-none">
                          <Clipboard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="mb-2 font-medium">
                            Paste job description here
                          </p>
                          <p className="text-muted-foreground">or start typing to get keyword optimization</p>
                        </div>
                      )}
                      <Textarea
                        id="job-posting"
                        placeholder=""
                        value={jobPosting}
                        onChange={(e) => setJobPosting(e.target.value)}
                        onFocus={() => setJobPostingFocused(true)}
                        onBlur={() => {
                          if (!jobPosting.trim()) {
                            setJobPostingFocused(false);
                          }
                        }}
                        className="absolute inset-0 w-full h-full p-12 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 text-left placeholder:text-transparent"
                        style={{ minHeight: '100%' }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4 flex items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Job description added</p>
                            <p className="text-xs text-muted-foreground">Keyword optimization enabled</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setJobPosting('');
                            setJobPostingFocused(false);
                          }}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group"
                          title="Remove job description"
                        >
                          <X className="w-4 h-4 text-destructive group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                      <Textarea
                        id="job-posting-filled"
                        placeholder="Paste the job description here..."
                        value={jobPosting}
                        onChange={(e) => setJobPosting(e.target.value)}
                        onFocus={() => setJobPostingFocused(true)}
                        onBlur={() => setJobPostingFocused(false)}
                        className="resize-y p-12"
                      />
                      <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 px-3 py-2 rounded-lg">
                        <span className="font-semibold">✓</span>
                        <span>Keyword optimization will be included in review</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: API Key */}
            <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                  3
                </div>
                <h3 className="text-lg font-semibold">Enter API Key</h3>
              </div>
              <KeyInput onKeyChange={handleKeyChange} />
            </div>

            {/* Step 4: Review Button */}
            <div className="space-y-4">
              <Button
                onClick={(e) => {
                  console.log('[ProfileReview] Button onClick triggered', { canReview, disabled: !canReview });
                  e.preventDefault();
                  handleReview();
                }}
                disabled={!canReview}
                variant={canReview ? "default" : "secondary"}
                size="lg"
                className={`w-full shadow-lg hover:shadow-xl transition-all text-base font-semibold py-6 ${
                  canReview 
                    ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary' 
                    : ''
                }`}
              >
                {isReviewing ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="animate-spin text-xl">⏳</span>
                    <span>
                      {reviewStep === 'keyword' 
                        ? 'Step 2: Analyzing Keyword Optimization...'
                        : reviewStep === 'general'
                        ? 'Step 1: Reviewing Content...'
                        : 'Reviewing...'}
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {`Review ${feedbackType === 'resume' ? 'Resume' : 'LinkedIn Profile'}${jobPosting.trim() && feedbackType === 'resume' ? ' (2 Steps)' : ''}`}
                  </span>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-destructive/10 border-2 border-destructive/30 rounded-lg text-destructive shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center mt-0.5">
                      <X className="w-3 h-3 text-destructive" />
                    </div>
                    <div>
                      <strong className="font-semibold block mb-1">Error</strong>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {feedbackType === 'resume' && (
              <>
                {/* Visual Rules Section */}
                <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <button
                    onClick={() => setShowVisualRules(!showVisualRules)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <Eye className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label className="text-base font-semibold cursor-pointer block">
                          Visual Formatting Guidelines
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">Check your resume's visual formatting</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {showVisualRules ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                  </button>
                  <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      <strong className="font-semibold">Important:</strong> The AI review analyzes text content only. We cannot visually inspect PDF formatting, colors, fonts, or layout. Please review these guidelines to check your resume's visual formatting.
                    </p>
                  </div>
                  {showVisualRules && visualRulesContent && (
                    <div className="mt-4 p-6 bg-muted/30 rounded-lg max-h-[500px] overflow-y-auto border border-border/50 shadow-inner">
                      <div className="markdown-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{visualRulesContent}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                  {showVisualRules && !visualRulesContent && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground text-center">
                      <span className="animate-pulse">Loading visual rules...</span>
                    </div>
                  )}
                </div>
              </>
            )}
          {/* Output Section */}
          <div className="lg:sticky lg:top-8 lg:self-start">
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

      </div>
    </section>
  );
}

