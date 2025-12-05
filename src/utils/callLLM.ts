// Utility functions for calling OpenAI and Gemini APIs

export type APIProvider = 'openai' | 'gemini';

export interface LLMRequest {
  provider: APIProvider;
  apiKey: string;
  systemPrompt: string;
  userMessage: string;
}

export interface LLMResponse {
  content: string;
  tokensUsed?: number;
}

/**
 * Detect API key type based on prefix
 */
export function detectKeyType(key: string): APIProvider | null {
  if (key.startsWith('sk-')) {
    return 'openai';
  } else if (key.startsWith('AIzaSy')) {
    return 'gemini';
  }
  return null;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<LLMResponse> {
  console.log('[callLLM] Calling OpenAI API...', {
    apiKeyLength: apiKey.length,
    systemPromptLength: systemPrompt.length,
    userMessageLength: userMessage.length,
  });

  const requestBody = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
  };

  console.log('[callLLM] OpenAI request body prepared');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  console.log('[callLLM] OpenAI response status:', response.status, response.statusText);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('[callLLM] OpenAI API error:', { status: response.status, error });
    if (response.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your key and try again.');
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else {
      throw new Error(error.error?.message || `OpenAI API error: ${response.statusText}`);
    }
  }

  const data = await response.json();
  console.log('[callLLM] OpenAI response received:', {
    hasContent: !!data.choices?.[0]?.message?.content,
    contentLength: data.choices?.[0]?.message?.content?.length || 0,
    tokensUsed: data.usage?.total_tokens,
  });
  
  return {
    content: data.choices[0].message.content,
    tokensUsed: data.usage?.total_tokens,
  };
}

/**
 * Call Gemini API
 */
async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<LLMResponse> {
  console.log('[callLLM] Calling Gemini API...', {
    apiKeyLength: apiKey.length,
    systemPromptLength: systemPrompt.length,
    userMessageLength: userMessage.length,
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const requestBody = {
    contents: [
      {
        parts: [
          { text: systemPrompt + '\n\n' + userMessage },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };

  console.log('[callLLM] Gemini request body prepared');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  console.log('[callLLM] Gemini response status:', response.status, response.statusText);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('[callLLM] Gemini API error:', { status: response.status, error });
    if (response.status === 400 && error.error?.message?.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Gemini API key. Please check your key and try again.');
    } else {
      throw new Error(error.error?.message || `Gemini API error: ${response.statusText}`);
    }
  }

  const data = await response.json();
  console.log('[callLLM] Gemini response received:', {
    hasCandidates: !!data.candidates,
    hasContent: !!data.candidates?.[0]?.content?.parts?.[0]?.text,
    contentLength: data.candidates?.[0]?.content?.parts?.[0]?.text?.length || 0,
  });
  
  if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
    console.error('[callLLM] Unexpected Gemini response format:', data);
    throw new Error('Unexpected response format from Gemini API');
  }

  return {
    content: data.candidates[0].content.parts[0].text,
  };
}

/**
 * Main LLM caller that routes to appropriate API
 */
export async function callLLM(request: LLMRequest): Promise<LLMResponse> {
  console.log('[callLLM] Main function called:', { provider: request.provider });
  if (request.provider === 'openai') {
    return callOpenAI(request.apiKey, request.systemPrompt, request.userMessage);
  } else {
    return callGemini(request.apiKey, request.systemPrompt, request.userMessage);
  }
}

/**
 * Load system prompt from resume-rules.md, linkedin-rules.md, or job-posting-rules.md
 */
export async function loadSystemPrompt(type: 'resume' | 'linkedin' | 'job-posting' = 'resume'): Promise<string> {
  try {
    let fileName: string;
    switch (type) {
      case 'resume':
        fileName = '/resume-rules.md';
        break;
      case 'linkedin':
        fileName = '/linkedin-rules.md';
        break;
      case 'job-posting':
        fileName = '/job-posting-rules.md';
        break;
      default:
        fileName = '/resume-rules.md';
    }
    
    console.log('[loadSystemPrompt] Loading prompt file:', fileName);
    const response = await fetch(fileName);
    console.log('[loadSystemPrompt] Fetch response:', { status: response.status, statusText: response.statusText, ok: response.ok });
    if (!response.ok) {
      console.error('[loadSystemPrompt] Failed to fetch file:', { status: response.status, statusText: response.statusText });
      throw new Error(`Failed to load system instructions: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    console.log('[loadSystemPrompt] File loaded successfully, length:', text.length);
    return text;
  } catch (error) {
    console.error('[loadSystemPrompt] Error loading rules:', error);
    throw new Error('Failed to load system instructions. Please refresh the page.');
  }
}