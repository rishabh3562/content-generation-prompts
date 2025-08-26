import { PromptTemplate, ContextData } from '@/types/prompt';

const STORAGE_KEYS = {
  PROMPTS: 'prompt_builder_prompts',
  CONTEXT: 'prompt_builder_context',
  CURRENT_PROMPT: 'prompt_builder_current_prompt'
};

// Default context values
const DEFAULT_CONTEXT: ContextData = {
  SESSION_TITLE: 'New Session',
  CODE_LANGUAGE: 'JavaScript',
  USER_ROLE: 'Developer',
  PROJECT_TYPE: 'Web Application'
};

export class StorageService {
  // Prompt Template CRUD
  static savePrompt(prompt: PromptTemplate): void {
    const prompts = this.getAllPrompts();
    const existingIndex = prompts.findIndex(p => p.id === prompt.id);
    
    if (existingIndex >= 0) {
      prompts[existingIndex] = { ...prompt, updatedAt: new Date() };
    } else {
      prompts.push(prompt);
    }
    
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(prompts));
  }

  static loadPrompt(id: string): PromptTemplate | null {
    const prompts = this.getAllPrompts();
    return prompts.find(p => p.id === id) || null;
  }

  static getAllPrompts(): PromptTemplate[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROMPTS);
      if (!stored) return [];
      
      const prompts = JSON.parse(stored);
      return prompts.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading prompts:', error);
      return [];
    }
  }

  static deletePrompt(id: string): void {
    const prompts = this.getAllPrompts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(prompts));
  }

  // Context Management
  static saveContext(context: ContextData): void {
    localStorage.setItem(STORAGE_KEYS.CONTEXT, JSON.stringify(context));
  }

  static loadContext(): ContextData {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTEXT);
      return stored ? JSON.parse(stored) : DEFAULT_CONTEXT;
    } catch (error) {
      console.error('Error loading context:', error);
      return DEFAULT_CONTEXT;
    }
  }

  // Current working prompt (auto-save)
  static saveCurrentPrompt(content: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROMPT, content);
  }

  static loadCurrentPrompt(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PROMPT) || '';
  }

  // Utility methods for future MongoDB migration
  static async migrateToMongoDB(): Promise<void> {
    // Placeholder for future MongoDB migration
    console.log('MongoDB migration not implemented yet');
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}