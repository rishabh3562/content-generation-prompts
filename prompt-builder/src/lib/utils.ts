import { VariableValues } from '@/types/prompt';

export function extractVariables(content: string): string[] {
  const regex = /<([A-Z_][A-Z0-9_]*)>/g;
  const matches = content.match(regex);
  if (!matches) return [];
  
  // Extract variable names and remove duplicates
  const variables = matches.map(match => match.slice(1, -1));
  return [...new Set(variables)];
}

export function replaceVariables(template: string, values: VariableValues): string {
  let result = template;
  
  Object.entries(values).forEach(([variable, value]) => {
    const placeholder = `<${variable}>`;
    result = result.replace(new RegExp(placeholder, 'g'), value || placeholder);
  });
  
  return result;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}