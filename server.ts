import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client safely on server
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Master System Prompt for Admissions Intelligence (Fall 2028)
const MASTER_ADMISSIONS_SYSTEM_INSTRUCTION = `
You are the ADMISSIONS INTELLIGENCE INSTRUCTOR inside COMEBACK STUDY TRACKER.
You are a principal USA undergraduate university admissions instructor, international admissions advisor, and research specialist.

PRIMARY STUDENT CONTEXT:
- Origin: Bangladesh (International applicant).
- Target Entry Term: Fall 2028 (Undergraduate First-Year).
- Academic Curriculum: Bangladesh SSC & HSC (Science group, English/Bangla version with theory, practicals, first & second papers).
- Standardized Testing: Digital SAT (aiming for 1550+) and English proficiency (IELTS 7.5+ / TOEFL 105+ / Duolingo).
- Core Platform: COMEBACK STUDY TRACKER.

CORE INSTRUCTIONAL PRINCIPLES (MASTER SPECIFICATION):
1. EVIDENCE OVER CONFIDENCE: Prioritize verified official facts. Never invent admission rates, financial aid amounts, policies, or deadlines.
2. APPLICATION CYCLE DISTINCTION:
   - Target cycle is FALL 2028.
   - For any policy, clearly state whether it is "VERIFIED FOR TARGET CYCLE (FALL 2028)", "CURRENT POLICY — CYCLE NOT SPECIFIED", "HISTORICAL REFERENCE (FALL 2026/2027)", or "NOT YET PUBLISHED".
   - Never present previous-year requirements as confirmed Fall 2028 rules.
3. BANGLADESH EDUCATIONAL SYSTEM EXPERTISE:
   - Understand SSC & HSC examinations, Education Boards (Dhaka, etc.), GPA 5.00 scale, Golden A+, and fourth-subject rules.
   - NEVER convert a Bangladesh GPA to a 4.0 US GPA using an assumed universal formula. Explain that US holistic admissions evaluates applicants within their own country's educational context.
4. FINANCIAL AID CLARITY:
   - Clearly distinguish need-blind from need-aware admissions for international students.
   - Distinguish full demonstrated need, full ride (tuition + room + board), full tuition, and partial merit scholarships.
   - Differentiate CSS Profile, ISFAA, COF (Certificate of Finances), and university-specific international aid forms. International students are not eligible for federal FAFSA aid.
5. ADMISSION ROUNDS DISCIPLINE:
   - Early Decision (ED1/ED2) is strictly binding (matriculation agreement).
   - Early Action (EA) is non-binding.
   - Restrictive Early Action (REA) / Single-Choice Early Action (SCEA) prohibits applying to other private US universities early.
   - Regular Decision (RD) and Rolling deadlines.
6. WRITING & ESSAY INTEGRITY:
   - The student must remain the authentic author. Coach, brainstorm, evaluate structure, prompt alignment, and depth.
   - Never manufacture fake personal stories, hardships, or generic AI prose.
   - Understand the Common App 650-word Personal Essay, university-specific supplemental questions, and SOP nuances.
7. FIVE INSTRUCTOR MODES:
   - MODE 1 — TEACH ME: Clear, educational step-by-step breakdown from zero knowledge with practical examples.
   - MODE 2 — RESEARCH FOR ME: Evidence-based live research reports with official sources, cycle verification, and next actions.
   - MODE 3 — REVIEW MY WORK: Constructive evaluation of essays, ECAs, or academic profiles (Strengths, Weaknesses, Missing Details, Suggestions).
   - MODE 4 — PLAN WITH ME: Milestone timelines, application round strategy, and planning toward Fall 2028.
   - MODE 5 — EXPLAIN EVERY DETAIL: Deep exhaustive guide on complex processes (CSS Profile, visa interviews, I-20, transcript evaluation).

STYLE & FORMATTING:
- Use clean Markdown, bold headers, bullet lists, and structured comparison tables where appropriate.
- Always be encouraging, direct, realistic, and highly educational.
`;

// Helper to sanitize and format grounding citations
interface GroundingSource {
  title: string;
  url: string;
  snippet?: string;
}

// POST /api/admissions-ai/chat
app.post('/api/admissions-ai/chat', async (req: Request, res: Response) => {
  try {
    const { 
      message, 
      conversationHistory = [], 
      instructorMode = 'TEACH ME', 
      contextData = null 
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please ensure GEMINI_API_KEY is provided in environment variables.'
      });
    }

    // Lazy init or use client
    const client = ai || new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Build context summary if user has active context attached
    let contextPromptAddition = '';
    if (contextData) {
      contextPromptAddition = `\n\nCURRENT STUDENT CONTEXT ATTACHED TO THIS QUERY:\n`;
      if (contextData.selectedUniversity) {
        contextPromptAddition += `• Selected University: ${JSON.stringify(contextData.selectedUniversity)}\n`;
      }
      if (contextData.selectedEssay) {
        contextPromptAddition += `• Active Essay Draft/Prompt: ${JSON.stringify(contextData.selectedEssay)}\n`;
      }
      if (contextData.academicsProfile) {
        contextPromptAddition += `• Student Academic Records: ${JSON.stringify(contextData.academicsProfile)}\n`;
      }
      if (contextData.ecasProfile) {
        contextPromptAddition += `• Documented Activities & ECAs: ${JSON.stringify(contextData.ecasProfile)}\n`;
      }
      if (contextData.currentModule) {
        contextPromptAddition += `• Current Module View: ${contextData.currentModule}\n`;
      }
    }

    const currentModePrompt = `[ACTIVE INSTRUCTOR MODE: ${instructorMode.toUpperCase()}]${contextPromptAddition}\n\nUSER QUERY:\n${message}`;

    // Decide whether to enable Google Search grounding
    // Modes like RESEARCH, planning, or direct queries about universities or policies benefit from live web search
    const enableSearch = instructorMode === 'RESEARCH FOR ME' 
      || instructorMode === 'EXPLAIN EVERY DETAIL'
      || /stanford|harvard|mit|yale|princeton|columbia|cornell|dartmouth|upenn|brown|caltech|chicago|duke|northwestern|vanderbilt|rice|williams|amherst|swarthmore|pomona|bowdoin|aid|tuition|deadline|sat policy|ielts score|acceptance rate|2028|2027|common app/i.test(message);

    const config: any = {
      systemInstruction: MASTER_ADMISSIONS_SYSTEM_INSTRUCTION
    };

    if (enableSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    // Build contents array including previous turns
    const contents: any[] = [];
    
    // Add up to last 10 turns of history for coherent multi-turn conversation
    const historySlice = Array.isArray(conversationHistory) ? conversationHistory.slice(-10) : [];
    for (const item of historySlice) {
      if (item.role === 'user' || item.role === 'assistant' || item.role === 'model') {
        contents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.text || item.content || '' }]
        });
      }
    }

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: currentModePrompt }]
    });

    // Generate content using gemini-3.8-flash (official non-paid standard)
    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config
    });

    const replyText = response.text || 'I analyzed your query, but could not produce a response text. Please try refining your question.';

    // Extract real citations from groundingMetadata
    const citations: GroundingSource[] = [];
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const chunks = groundingMetadata?.groundingChunks;
    if (Array.isArray(chunks)) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          citations.push({
            title: chunk.web.title || new URL(chunk.web.uri).hostname,
            url: chunk.web.uri,
            snippet: chunk.web.snippet || ''
          });
        }
      });
    }

    const searchQueries: string[] = groundingMetadata?.webSearchQueries || [];

    return res.json({
      text: replyText,
      instructorMode,
      citations,
      searchQueries,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in /api/admissions-ai/chat:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while communicating with the Admissions Intelligence service.',
      details: error?.toString()
    });
  }
});

// Setup Vite middlewares for local SPA frontend serving in dev
async function startServer() {
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      host: '0.0.0.0',
      port
    },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  app.listen(port, '0.0.0.0', () => {
    console.log(`[COMEBACK TRACKER] Server running with Admissions Intelligence at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
