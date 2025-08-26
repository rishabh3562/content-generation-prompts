'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { VariableValues } from '@/types/prompt';
import { replaceVariables } from '@/lib/utils';
import { useContextSources } from '@/hooks/useContextSources';

interface PromptPreviewProps {
  content: string;
  values: VariableValues;
}

export function PromptPreview({ content, values }: PromptPreviewProps) {
  const [showContext, setShowContext] = useState(true);
  const { getContextString } = useContextSources();

  const processedContent = replaceVariables(content, values);
  const contextString = getContextString();
  
  const finalPrompt = showContext && contextString
    ? `${processedContent}\n\n--- Context ---\n${contextString}`
    : processedContent;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalPrompt);
      // You could add a toast notification here
      console.log('Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const unfilledVariables = Object.entries(values).filter(([_, value]) => !value.trim());
  const hasUnfilledVariables = unfilledVariables.length > 0;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Live Preview</h3>
          {hasUnfilledVariables && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {unfilledVariables.length} unfilled
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowContext(!showContext)}
            className="flex items-center gap-2"
          >
            {showContext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Context
          </Button>
          <Button
            onClick={handleCopy}
            size="sm"
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>
        </div>
      </div>

      <div className="flex-1 border rounded-lg p-4 bg-gray-50 overflow-auto">
        <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
          {finalPrompt || 'Enter a prompt template to see the preview...'}
        </pre>
      </div>

      {hasUnfilledVariables && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm font-medium text-yellow-800 mb-1">
            Unfilled Variables:
          </div>
          <div className="text-xs text-yellow-700">
            {unfilledVariables.map(([variable]) => `<${variable}>`).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}