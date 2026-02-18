
import { GoogleGenAI } from "@google/genai";
import { EditRequest } from "../types";

export const editImage = async (request: EditRequest): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const base64Data = request.image.split(',')[1];
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: request.mimeType,
            },
          },
          {
            text: request.prompt,
          },
        ],
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No response generated from the model.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("The model did not return an image part.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
