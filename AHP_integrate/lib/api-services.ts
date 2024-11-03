import { API_CONFIG } from './config';
import { APIResponse } from './types';

export async function generateAIContent(prompt: string): Promise<APIResponse> {
  try {
    const response = await fetch(API_CONFIG.OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.choices[0].message.content,
    };
  } catch (error) {
    console.error('Error generating AI content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate content',
    };
  }
}

export async function humanizeContent(text: string): Promise<APIResponse> {
  try {
    const response = await fetch(API_CONFIG.HUMANIZER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUMANIZER_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        strength: 'medium', // Adjustable parameter
        preserve_keywords: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Humanizer API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.humanized_text,
    };
  } catch (error) {
    console.error('Error humanizing content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to humanize content',
    };
  }
}

export async function checkPlagiarism(text: string): Promise<APIResponse> {
  try {
    const response = await fetch(API_CONFIG.GPTZERO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.NEXT_PUBLIC_GPTZERO_API_KEY || '',
      },
      body: JSON.stringify({
        document: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`GPTZero API error: ${response.statusText}`);
    }

    const data = await response.json();
    // Calculate percentage based on GPTZero's response
    const score = Math.round(data.documents[0].average_generated_prob * 100);
    
    return {
      success: true,
      data: score,
    };
  } catch (error) {
    console.error('Error checking plagiarism:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check plagiarism',
    };
  }
}