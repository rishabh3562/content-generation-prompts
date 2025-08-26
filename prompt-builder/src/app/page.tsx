'use client';

import { useState, useEffect } from 'react';
import { PromptEditor } from '@/components/PromptEditor';
import { VariableExtractor } from '@/components/VariableExtractor';
import { PromptPreview } from '@/components/PromptPreview';
import { VariableValues } from '@/types/prompt';
import { StorageService } from '@/lib/storage';

export default function Home() {
  const [promptContent, setPromptContent] = useState('');
  const [variableValues, setVariableValues] = useState<VariableValues>({});

  useEffect(() => {
    // Load current prompt from localStorage on mount
    const savedContent = StorageService.loadCurrentPrompt();
    if (savedContent) {
      setPromptContent(savedContent);
    }
  }, []);

  useEffect(() => {
    // Auto-save current prompt content
    StorageService.saveCurrentPrompt(promptContent);
  }, [promptContent]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Prompt Builder</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create, manage, and optimize AI prompts with intelligent variable extraction
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Prompt Editor */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-6">
            <PromptEditor
              content={promptContent}
              onContentChange={setPromptContent}
            />
          </div>

          {/* Right Panel - Variables */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-6">
            <VariableExtractor
              content={promptContent}
              values={variableValues}
              onValuesChange={setVariableValues}
            />
          </div>

          {/* Bottom Panel - Preview */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-6">
            <PromptPreview
              content={promptContent}
              values={variableValues}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            Prompt Builder v1.0 - Built with Next.js, Tailwind CSS, and Gemini AI
          </p>
          <p className="mt-1">
            Ready for MongoDB migration and PDF RAG integration
          </p>
        </footer>
      </main>
    </div>
  );
}