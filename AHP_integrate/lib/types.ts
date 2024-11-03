export interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface PlagiarismResult {
  score: number;
  content: string;
}

export interface ProcessingStatus {
  isProcessing: boolean;
  currentStep: string;
  error: string;
}