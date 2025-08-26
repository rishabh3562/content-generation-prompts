'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { PromptTemplate } from '@/types/prompt';
import { StorageService } from '@/lib/storage';
import { generateId } from '@/lib/utils';

interface PromptEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function PromptEditor({ content, onContentChange }: PromptEditorProps) {
  const [savedPrompts, setSavedPrompts] = useState<PromptTemplate[]>([]);
  const [promptName, setPromptName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    loadSavedPrompts();
  }, []);

  const loadSavedPrompts = () => {
    const prompts = StorageService.getAllPrompts();
    setSavedPrompts(prompts);
  };

  const handleSavePrompt = () => {
    if (!promptName.trim()) {
      alert('Please enter a name for the prompt');
      return;
    }

    const newPrompt: PromptTemplate = {
      id: generateId(),
      name: promptName,
      content,
      variables: [],
      context: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    StorageService.savePrompt(newPrompt);
    loadSavedPrompts();
    setPromptName('');
    setShowSaveDialog(false);
  };

  const handleLoadPrompt = (prompt: PromptTemplate) => {
    onContentChange(prompt.content);
  };

  const handleDeletePrompt = (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      StorageService.deletePrompt(id);
      loadSavedPrompts();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Button
          onClick={() => setShowSaveDialog(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Prompt
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <FolderOpen className="w-4 h-4" />
          Load ({savedPrompts.length})
        </Button>
      </div>

      {showSaveDialog && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter prompt name..."
              value={promptName}
              onChange={(e) => setPromptName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSavePrompt} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <label className="text-sm font-medium mb-2">Prompt Template</label>
        <Textarea
          placeholder="Enter your prompt template here. Use <PLACEHOLDER> format for variables..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="flex-1 min-h-[300px] font-mono text-sm"
        />
      </div>

      {savedPrompts.length > 0 && (
        <div className="mt-4">
          <label className="text-sm font-medium mb-2 block">Saved Prompts</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {savedPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{prompt.name}</div>
                  <div className="text-xs text-gray-500">
                    {prompt.content.substring(0, 50)}...
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLoadPrompt(prompt)}
                  >
                    Load
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePrompt(prompt.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}