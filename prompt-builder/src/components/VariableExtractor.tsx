'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Wand2, FileText, Settings } from 'lucide-react';
import { VariableValues, ContextData } from '@/types/prompt';
import { extractVariables } from '@/lib/utils';
import { AIService } from '@/lib/ai';
import { useContextSources } from '@/hooks/useContextSources';

interface VariableExtractorProps {
  content: string;
  values: VariableValues;
  onValuesChange: (values: VariableValues) => void;
}

export function VariableExtractor({ content, values, onValuesChange }: VariableExtractorProps) {
  const [variables, setVariables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const { context, updateContext } = useContextSources();

  useEffect(() => {
    const extractedVars = extractVariables(content);
    setVariables(extractedVars);
    
    // Initialize empty values for new variables
    const newValues = { ...values };
    extractedVars.forEach(variable => {
      if (!(variable in newValues)) {
        newValues[variable] = '';
      }
    });
    
    // Remove values for variables that no longer exist
    Object.keys(newValues).forEach(variable => {
      if (!extractedVars.includes(variable)) {
        delete newValues[variable];
      }
    });
    
    onValuesChange(newValues);
  }, [content]);

  const handleVariableChange = (variable: string, value: string) => {
    onValuesChange({
      ...values,
      [variable]: value
    });
  };

  const handleAutoFill = async () => {
    if (!AIService.isConfigured()) {
      alert('Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.');
      return;
    }

    setIsLoading(true);
    try {
      const predictedValues = await AIService.predictVariables(content, variables, values);
      onValuesChange(predictedValues);
    } catch (error) {
      console.error('Auto-fill error:', error);
      alert(error instanceof Error ? error.message : 'Failed to auto-fill variables');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContextChange = (key: keyof ContextData, value: string) => {
    updateContext({ [key]: value });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Variables & Context</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowContext(!showContext)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Context
          </Button>
          <Button
            onClick={handleAutoFill}
            disabled={isLoading || variables.length === 0}
            size="sm"
            className="flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            {isLoading ? 'Auto-filling...' : 'Auto-fill'}
          </Button>
        </div>
      </div>

      {showContext && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Context Settings
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Session Title</label>
              <Input
                value={context.SESSION_TITLE}
                onChange={(e) => handleContextChange('SESSION_TITLE', e.target.value)}
                placeholder="e.g., Code Review Session"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Code Language</label>
              <Input
                value={context.CODE_LANGUAGE}
                onChange={(e) => handleContextChange('CODE_LANGUAGE', e.target.value)}
                placeholder="e.g., JavaScript, Python, etc."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">User Role</label>
              <Input
                value={context.USER_ROLE}
                onChange={(e) => handleContextChange('USER_ROLE', e.target.value)}
                placeholder="e.g., Senior Developer, Product Manager"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Project Type</label>
              <Input
                value={context.PROJECT_TYPE}
                onChange={(e) => handleContextChange('PROJECT_TYPE', e.target.value)}
                placeholder="e.g., Web Application, Mobile App"
              />
            </div>
          </div>
        </div>
      )}

      <Separator className="my-4" />

      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Template Variables ({variables.length})</h4>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="flex items-center gap-2 opacity-50"
          >
            <FileText className="w-4 h-4" />
            Attach PDF (Coming Soon)
          </Button>
        </div>

        {variables.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-sm">No variables detected</div>
            <div className="text-xs mt-1">Use &lt;VARIABLE_NAME&gt; format in your template</div>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {variables.map((variable) => (
              <div key={variable}>
                <label className="text-sm font-medium mb-1 block">
                  &lt;{variable}&gt;
                </label>
                <Input
                  value={values[variable] || ''}
                  onChange={(e) => handleVariableChange(variable, e.target.value)}
                  placeholder={`Enter value for ${variable}...`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}