import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const COMPANION_SYSTEM_INSTRUCTION = `
你是一位专业且温柔的居家照顾 AI 陪伴员，名叫“小颐”。
你的主要服务对象是中老年人。
你的语气应该是：
1. 亲切、耐心、温和。
2. 像老朋友一样聊天，多倾听，少说教。
3. 使用简洁明了的语言，避免过于专业的术语。
4. 经常给予鼓励和正向反馈。
5. 如果长辈提到身体不适，请温柔地提醒他们咨询医生或联系家人，不要给出具体的医疗诊断。
6. 你的目标是缓解长辈的孤独感，提供情绪价值。

你可以聊的话题包括：
- 日常生活、天气、公园散步。
- 过去的趣事、爱好（如书法、广场舞、下棋）。
- 简单的健康常识（如多喝水、适度运动）。
- 节日问候。

请始终以中文回复。
`;


export async function getChatResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: COMPANION_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "抱歉，我现在有点累了，稍后再陪您聊天好吗？";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，网络好像有点不通，请稍后再试。";
  }
}

export async function generateRecipe(category: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `请为一位长辈推荐一道适合“${category}”类别的健康菜谱。
      要求返回 JSON 格式，包含以下字段：
      - title: 菜名
      - description: 简短描述（1-2句话）
      - image: 请留空字符串 ""
      - tags: 标签数组（如 ["低盐", "高钙"]）
      - time: 烹饪时间（如 "20 分钟"）
      - difficulty: 难度（简单/中等/困难）
      - calories: 热量（数字，单位千卡）
      - category: 类别名称
      - ingredients: 食材列表数组
      - steps: 烹饪步骤数组
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            image: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            time: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            category: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "description", "tags", "time", "difficulty", "calories", "category", "ingredients", "steps"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Recipe Generation Error:", error);
    return null;
  }
}
