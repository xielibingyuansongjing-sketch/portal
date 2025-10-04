
import { GoogleGenAI, Chat } from '@google/genai';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: Chat | null = null;

const getChatInstance = () => {
    if(!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'あなたは病院職員をサポートする、優秀なAIアシスタントです。院内プロトコルや医療情報に関する質問に、正確かつ簡潔に答えてください。プロフェッショナルなトーンを保ち、回答は常に日本語で行ってください。',
            },
        });
    }
    return chat;
}


export const streamChatMessage = async (
  message: string,
  onChunk: (chunk: string) => void,
): Promise<void> => {
  try {
    const chatInstance = getChatInstance();
    const responseStream = await chatInstance.sendMessageStream({ message });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Error streaming message:", error);
    onChunk("申し訳ありません、エラーが発生しました。もう一度お試しください。");
  }
};
