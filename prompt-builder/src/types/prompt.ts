export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  context: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VariableValues {
  [key: string]: string;
}

export interface ContextData {
  SESSION_TITLE: string;
  CODE_LANGUAGE: string;
  USER_ROLE: string;
  PROJECT_TYPE: string;
  [key: string]: string;
}