// Store API configuration
export const API_CONFIG = {
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  HUMANIZER_API_URL: 'https://api.humanizer.pro/v1/humanize',
  GPTZERO_API_URL: 'https://api.gptzero.me/v2/predict',
}

// Add your API keys in a secure environment variable file in production
export const API_KEYS = {
  OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'your-openai-key',
  HUMANIZER_API_KEY: process.env.NEXT_PUBLIC_HUMANIZER_API_KEY || 'your-humanizer-key',
  GPTZERO_API_KEY: process.env.NEXT_PUBLIC_GPTZERO_API_KEY || 'your-gptzero-key',
}