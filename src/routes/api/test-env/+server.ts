import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return json({
    geminiApiKey: !!process.env.GEMINI_API_KEY,
    viteGeminiApiKey: !!process.env.VITE_GEMINI_API_KEY,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('GEMINI')),
    nodeEnv: process.env.NODE_ENV,
    hasDotenv: typeof require !== 'undefined' && require.cache && require.cache['dotenv']
  });
};
