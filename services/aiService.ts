import axios from 'axios';

export async function generateSummary(transcript: string, prompt: string): Promise<string> {
  try {
    // Check if Groq API key is configured
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return `**Mock Summary** (Add GROQ_API_KEY to .env for real AI)\n\nMeeting Summary:\n- Main topics discussed based on transcript\n- Key decisions made\n- Action items identified\n\nCustom prompt applied: ${prompt}\n\nTranscript length: ${transcript.length} characters`;
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are an AI that summarizes meeting transcripts.' },
          { role: 'user', content: `${prompt}\n\nTranscript:\n${transcript}` },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error('AI Service Error:', error.response?.data || error.message);
    return `**Error generating summary**\n\nPlease check:\n1. Your Groq API key in .env file\n2. Your internet connection\n\nError: ${error.response?.data?.error?.message || error.message}`;
  }
}