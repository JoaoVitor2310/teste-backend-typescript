import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: path.resolve('../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default genAI;