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
      fetch('/resume-visual-rules.md')
        .then(response => response.text())
        .then(text => setVisualRulesContent(text))
        .catch(err => {
          console.error('[ProfileReview] Failed to load resume-visual-rules.md:', err);
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
    // Job posting is supported for both resume and LinkedIn, so we keep it when switching
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

      // Step 2: Keyword Optimization Analysis (if job posting provided)
      if (jobPosting.trim()) {
        setReviewStep('keyword');
        console.log('[ProfileReview] Step 2: Job posting provided, starting keyword optimization analysis');
        try {
          // Load job posting rules using loadSystemPrompt
          const jobPostingRules = await loadSystemPrompt('job-posting');
          
          // Determine sections based on feedback type
          const isResume = feedbackType === 'resume';
          const profileType = isResume ? 'resume' : 'LinkedIn profile';
          const sections = isResume 
            ? `- Professional title
   - Professional summary
   - Areas of expertise section
   - Professional experience bullet points`
            : `- Headline
   - About section
   - Skills section
   - Experience descriptions`;
          
          // Create system prompt for keyword optimization
          const keywordSystemPrompt = `# Keyword Optimization Analysis Instructions

${jobPostingRules}

## Your Task

Analyze the ${profileType} provided by the user against the job posting they provided. Focus specifically on:

1. **Keyword Extraction**: Identify key skills and keywords from the job posting
2. **Keyword Matching**: Analyze how well the ${profileType} matches these keywords
3. **Keyword Integration**: Evaluate where keywords appear (or should appear) in:
${sections}
4. **Missing Keywords**: Identify important keywords from the job posting that are missing from the ${profileType}
5. **Recommendations**: Provide specific, actionable recommendations for improving keyword optimization

Be specific and provide concrete examples. Reference the actual job posting requirements when making recommendations.

## Job Posting

${jobPosting.trim()}

## ${isResume ? 'Resume' : 'LinkedIn Profile'}

${resumeText}`;

          console.log('[ProfileReview] Step 2: Calling LLM API for keyword optimization');
          const keywordResponse = await callLLM({
            provider,
            apiKey,
            systemPrompt: keywordSystemPrompt,
            userMessage: `Please analyze the ${profileType} above against the job posting provided in the system instructions. Focus on keyword optimization, matching, and provide specific recommendations.`,
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
    <section id="services/profile-review" className="py-16 md:py-24 bg-gradient-to-b from-background via-background to-muted/20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Get Your Profile Review
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-3">
            AI-powered feedback for your resume & LinkedIn profile
          </p>
          <p className="text-primary font-medium text-base md:text-lg">Get expert insights to improve your professional presence.</p>
        </motion.div>

        {/* Privacy Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-green-500/10 via-emerald-500/15 to-green-500/10 border-2 border-green-500/30 rounded-2xl mb-8 shadow-xl shadow-green-500/5 backdrop-blur-sm"
        >
          <div className="px-6 md:px-8 py-6 md:py-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                Your Privacy is Protected
              </h3>
              <p className="text-green-600 dark:text-green-300 text-sm md:text-base max-w-2xl mx-auto">
                Everything is processed locally in your browser - nothing is stored or sent to our servers
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-green-700 dark:text-green-400">
              <div className="flex items-center gap-3 bg-white/60 dark:bg-black/30 backdrop-blur-sm px-5 py-3 rounded-xl shadow-sm border border-green-500/20 hover:shadow-md transition-all">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-sm md:text-base">No Files Stored</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 dark:bg-black/30 backdrop-blur-sm px-5 py-3 rounded-xl shadow-sm border border-green-500/20 hover:shadow-md transition-all">
                <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-sm md:text-base">No API Keys Stored</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 dark:bg-black/30 backdrop-blur-sm px-5 py-3 rounded-xl shadow-sm border border-green-500/20 hover:shadow-md transition-all">
                <Server className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-sm md:text-base">No Backend Used</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-card/80 to-card/50 border border-border/50 rounded-2xl p-6 md:p-8 mt-8 shadow-lg backdrop-blur-sm"
        >
          <h3 className="mb-4 md:mb-6 text-lg md:text-xl font-bold flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            How It Works
          </h3>
          <ol className="space-y-3 md:space-y-4 text-muted-foreground list-decimal list-inside ml-2">
            <li className="text-sm md:text-base">Choose whether you're uploading a Resume or LinkedIn Profile</li>
            <li className="text-sm md:text-base">Upload your file (PDF or DOCX) - parsed locally in your browser</li>
            <li className="text-sm md:text-base">Enter your OpenAI or Gemini API key - stored only in memory</li>
            <li className="text-sm md:text-base">Click "Review" - sends your content to the AI provider you chose</li>
            <li className="text-sm md:text-base">Get detailed feedback - displayed instantly in the browser</li>
          </ol>
          
          <div className="mt-6 md:mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <p className="text-sm md:text-base text-muted-foreground">
              <strong className="text-foreground">Privacy guaranteed:</strong> Your files never touch our servers. Everything is processed entirely in your browser, and only sent directly to OpenAI or Gemini based on your API key choice.
            </p>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8 mt-8"
        >
          <div className="space-y-6 md:space-y-8">
            {/* Step 1: Type Selection */}
            <div className="bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-base md:text-lg shadow-sm border border-primary/20">
                    1
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">Select Review Type</h3>
                </div>
                <TypeSelector selectedType={feedbackType} onTypeChange={handleTypeChange} />
              </div>
            </div>

            {/* Step 2: Upload & Job Description */}
            <div className="bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-base md:text-lg shadow-sm border border-primary/20">
                    2
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">Upload Your {feedbackType === 'resume' ? 'Resume' : 'LinkedIn Profile'}</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
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
                        border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer relative
                        transition-all duration-300 min-h-[240px] md:min-h-[280px]
                        ${jobPostingFocused ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50 hover:bg-muted/30'}
                      `}
                    >
                      {!jobPostingFocused && (
                        <div className="pointer-events-none">
                          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 p-3 rounded-full bg-muted/50 flex items-center justify-center">
                            <Clipboard className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
                          </div>
                          <p className="mb-2 font-semibold text-sm md:text-base">
                            Paste job description here
                          </p>
                          <p className="text-muted-foreground text-xs md:text-sm">or start typing to get keyword optimization</p>
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
                        className="absolute inset-0 w-full h-full p-8 md:p-12 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 text-left placeholder:text-transparent text-sm md:text-base"
                        style={{ minHeight: '100%' }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border rounded-xl p-4 flex items-center justify-between bg-gradient-to-r from-primary/10 via-primary/8 to-primary/5 border-primary/30 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-sm border border-primary/20">
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
                        className="resize-y p-4 md:p-6 rounded-xl border-border/50 focus:border-primary/50 transition-colors"
                      />
                      <div className="flex items-center gap-2 text-xs md:text-sm text-primary bg-primary/10 px-3 py-2 rounded-lg border border-primary/20">
                        <span className="font-semibold">✓</span>
                        <span>Keyword optimization will be included in review</span>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>
            </div>

            {/* Step 3: API Key */}
            <div className="bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-base md:text-lg shadow-sm border border-primary/20">
                    3
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">Enter API Key</h3>
                </div>
                <KeyInput onKeyChange={handleKeyChange} />
              </div>
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
                className={`w-full shadow-xl hover:shadow-2xl transition-all duration-300 text-base md:text-lg font-bold py-6 md:py-7 rounded-xl ${
                  canReview 
                    ? 'bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary scale-100 hover:scale-[1.02] active:scale-[0.98]' 
                    : 'opacity-60 cursor-not-allowed'
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
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                    {`Review ${feedbackType === 'resume' ? 'Resume' : 'LinkedIn Profile'}${jobPosting.trim() ? ' (2 Steps)' : ''}`}
                  </span>
                )}
              </Button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 md:p-5 bg-destructive/10 border-2 border-destructive/30 rounded-xl text-destructive shadow-lg backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center mt-0.5">
                      <X className="w-4 h-4 text-destructive" />
                    </div>
                    <div>
                      <strong className="font-bold block mb-1 text-base">Error</strong>
                      <p className="text-sm md:text-base">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {feedbackType === 'resume' && (
              <>
                {/* Visual Rules Section */}
                <div className="bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/30 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <button
                      onClick={() => setShowVisualRules(!showVisualRules)}
                      className="w-full flex items-center justify-between text-left group/button"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover/button:bg-primary/30 transition-colors shadow-sm border border-primary/20">
                          <Eye className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </div>
                        <div>
                          <Label className="text-base md:text-lg font-bold cursor-pointer block">
                            Visual Formatting Guidelines
                          </Label>
                          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Check your resume's visual formatting</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {showVisualRules ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground group-hover/button:text-primary transition-colors" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground group-hover/button:text-primary transition-colors" />
                        )}
                      </div>
                    </button>
                    <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl shadow-sm">
                      <p className="text-sm md:text-base text-amber-600 dark:text-amber-400">
                        <strong className="font-bold">Important:</strong> The AI review analyzes text content only. We cannot visually inspect PDF formatting, colors, fonts, or layout. Please review these guidelines to check your resume's visual formatting.
                      </p>
                    </div>
                    {showVisualRules && visualRulesContent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-6 bg-muted/30 rounded-xl max-h-[500px] overflow-y-auto border border-border/50 shadow-inner"
                      >
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{visualRulesContent}</ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                    {showVisualRules && !visualRulesContent && (
                      <div className="mt-4 p-4 bg-muted/30 rounded-xl text-sm text-muted-foreground text-center">
                        <span className="animate-pulse">Loading visual rules...</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          {/* Output Section */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            {feedback ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/50 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm"
              >
                <ProfileOutput feedback={feedback} fileName={fileName || undefined} tokensUsed={tokensUsed} />
              </motion.div>
            ) : (
              <div className="bg-gradient-to-br from-card/50 via-card/30 to-card/20 border-2 border-dashed border-border/50 rounded-2xl p-12 md:p-16 shadow-lg flex flex-col items-center justify-center text-center h-full min-h-[400px] md:min-h-[500px]">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <FileCheck className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-muted-foreground mb-3">No feedback yet</h3>
                <p className="text-sm md:text-base text-muted-foreground max-w-sm">
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

