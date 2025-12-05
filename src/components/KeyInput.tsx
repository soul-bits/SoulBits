import React, { useState } from 'react';
import { Key, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { detectKeyType, APIProvider } from '../utils/callLLM';

interface KeyInputProps {
  onKeyChange: (key: string, provider: APIProvider) => void;
}

export function KeyInput({ onKeyChange }: KeyInputProps) {
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [showOpenai, setShowOpenai] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const validateAndSetKey = (value: string, expectedProvider: APIProvider) => {
    console.log('[KeyInput] Validating key:', { valueLength: value.length, expectedProvider });
    setWarning(null);

    if (!value) {
      console.log('[KeyInput] Empty key, clearing');
      return;
    }

    const detectedType = detectKeyType(value);
    console.log('[KeyInput] Detected key type:', detectedType);

    if (detectedType && detectedType !== expectedProvider) {
      const correctField = detectedType === 'openai' ? 'OpenAI' : 'Gemini';
      const currentField = expectedProvider === 'openai' ? 'OpenAI' : 'Gemini';
      console.warn('[KeyInput] Key type mismatch:', { detectedType, expectedProvider });
      setWarning(`This looks like a ${correctField} key, but you entered it in the ${currentField} field.`);
    } else if (value.length > 0) {
      console.log('[KeyInput] Key validated, calling onKeyChange');
      onKeyChange(value, expectedProvider);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2>API Key (BYOK)</h2>
        <span className="text-muted-foreground">Choose one</span>
      </div>

      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-700">
          <strong>Privacy:</strong> Your API key is stored only in memory and never sent to any server (except the AI provider you choose). Closing this tab will clear the key.
        </p>
      </div>

      {/* OpenAI Key */}
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <Key className="w-4 h-4" />
          OpenAI API Key
        </label>
        <div className="relative">
          <input
            type={showOpenai ? 'text' : 'password'}
            value={openaiKey}
            onChange={(e) => {
              setOpenaiKey(e.target.value);
              validateAndSetKey(e.target.value, 'openai');
            }}
            placeholder="sk-..."
            className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => setShowOpenai(!showOpenai)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showOpenai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="text-center text-muted-foreground">— OR —</div>

      {/* Gemini Key */}
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <Key className="w-4 h-4" />
          Gemini API Key
        </label>
        <div className="relative">
          <input
            type={showGemini ? 'text' : 'password'}
            value={geminiKey}
            onChange={(e) => {
              setGeminiKey(e.target.value);
              validateAndSetKey(e.target.value, 'gemini');
            }}
            placeholder="AIzaSy..."
            className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => setShowGemini(!showGemini)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {warning && (
        <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <p className="text-orange-700">{warning}</p>
        </div>
      )}

      <div className="text-muted-foreground space-y-1">
        <p>
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Get OpenAI API key →
          </a>
        </p>
        <p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Get Gemini API key →
          </a>
        </p>
      </div>
    </div>
  );
}
