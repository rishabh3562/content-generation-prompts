import { useState, useEffect } from 'react';
import { ContextData } from '@/types/prompt';
import { StorageService } from '@/lib/storage';

export function useContextSources() {
  const [context, setContext] = useState<ContextData>({
    SESSION_TITLE: '',
    CODE_LANGUAGE: '',
    USER_ROLE: '',
    PROJECT_TYPE: ''
  });

  const [pdfSources, setPdfSources] = useState<string[]>([]);

  useEffect(() => {
    const loadedContext = StorageService.loadContext();
    setContext(loadedContext);
  }, []);

  const updateContext = (newContext: Partial<ContextData>) => {
    const updated = { ...context, ...newContext };
    setContext(updated);
    StorageService.saveContext(updated);
  };

  const addPdfSource = (pdfPath: string) => {
    // Placeholder for future PDF RAG implementation
    setPdfSources(prev => [...prev, pdfPath]);
    console.log('PDF source added (feature coming soon):', pdfPath);
  };

  const removePdfSource = (pdfPath: string) => {
    setPdfSources(prev => prev.filter(path => path !== pdfPath));
  };

  const getContextString = (): string => {
    const contextEntries = Object.entries(context)
      .filter(([_, value]) => value.trim())
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const pdfContext = pdfSources.length > 0 
      ? `\nPDF Sources: ${pdfSources.join(', ')}`
      : '';

    return contextEntries + pdfContext;
  };

  return {
    context,
    updateContext,
    pdfSources,
    addPdfSource,
    removePdfSource,
    getContextString
  };
}