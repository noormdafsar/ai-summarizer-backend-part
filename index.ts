import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import dotenv from 'dotenv';
import { generateSummary } from './services/aiService';
import { sendEmail } from './services/emailService';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const corsOptions = {
  origin: 'https://ai-summarizer-frontend-8a4r.onrender.com/',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// File upload handling (text transcripts)
const upload = multer({ dest: 'uploads/' });

// Health Check
app.get('/', (req: Request, res: Response) => {
  res.send('AI Meeting Summarizer Backend is running.');
});

// Generate summary from transcript + custom prompt
app.post('/api/summary', async (req: Request, res: Response) => {
  try {
    const transcript: string = req.body.transcript || '';
    const prompt: string = req.body.prompt || '';

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    const summary = await generateSummary(transcript, prompt);
    res.json({ summary });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Send edited summary via email
app.post('/api/share', async (req: Request, res: Response) => {
  try {
    const { summary, recipients } = req.body;

    if (!summary || !recipients || !Array.isArray(recipients)) {
      return res.status(400).json({ error: 'Summary and recipients are required' });
    }

    await sendEmail(summary, recipients);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
