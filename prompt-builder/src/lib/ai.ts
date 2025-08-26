import { GoogleGenerativeAI } from '@google/generative-ai';
import { VariableValues } from '@/types/prompt';

export class AIService {
  private static genAI: GoogleGenerativeAI | null = null;

  private static getClient(): GoogleGenerativeAI {
    if (!this.genAI) {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not configured');
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
    return this.genAI;
  }

  static async predictVariables(
    promptTemplate: string,
    variables: string[],
    currentValues: VariableValues
  ): Promise<VariableValues> {
    try {
      const client = this.getClient();
      const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-1.5-flash';
      const model = client.getGenerativeModel({ model: modelName });

      // Filter out variables that already have values
      const emptyVariables = variables.filter(variable => !currentValues[variable]?.trim());
      
      if (emptyVariables.length === 0) {
        return currentValues;
      }

      const prompt = `
You are an AI assistant helping to fill in placeholder variables in a prompt template.

Template:
${promptTemplate}

Variables that need values: ${emptyVariables.join(', ')}

Current filled values: ${JSON.stringify(currentValues, null, 2)}

Please suggest appropriate values for the empty variables based on the context of the template. 
Return ONLY a JSON object with variable names as keys and suggested values as strings.

Example format:
{
  "VARIABLE_NAME": "suggested value",
  "ANOTHER_VARIABLE": "another suggested value"
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const suggestions = JSON.parse(jsonMatch[0]);
      
      // Merge suggestions with current values
      return {
        ...currentValues,
        ...suggestions
      };

    } catch (error) {
      console.error('Error predicting variables:', error);
      throw new Error('Failed to predict variables. Please check your API key and try again.');
    }
  }

  static isConfigured(): boolean {
    return !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }
}