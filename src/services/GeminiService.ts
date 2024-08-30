import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: path.resolve('../.env') });


function base64ToGenerativePart(base64: string, mimeType: string) {
    return {
        inlineData: {
            data: base64,
            mimeType
        }
    }
}

export class GeminiService {
    async fetchGeminiData(imageBase64: string): Promise<any> {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            // const prompt = "In the following photo, we have a view of a water meter. I want you to tell me only the value that is being shown";
            // const prompt = "In the following photo, we have a view of a water meter. I want you to tell me only the value that is being shown, without the unit of measurement.";
            const prompt = "In the following photo, we have a view of a water meter. I want you to tell me only the exact numeric value that is being shown.";


            const filePart1 = base64ToGenerativePart(imageBase64, "image/png")

            const imageParts = [
                filePart1,
            ];

            const generatedContent = await model.generateContent([prompt, ...imageParts]);

            return generatedContent.response.text();

        } catch (error) {
            console.error(error);
        }
    }
}