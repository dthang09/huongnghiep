import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeCareer = async (userData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const prompt = `
Bạn là một chuyên gia tư vấn hướng nghiệp chuyên sâu tại Việt Nam. 
Nhiệm vụ của bạn là phân tích các câu trả lời của học sinh (đôi khi họ rất mơ hồ và không biết mình muốn gì) để đưa ra định hướng nghề nghiệp phù hợp nhất với tố chất, hoàn cảnh và đam mê của họ.

DỮ LIỆU CỦA NGƯỜI DÙNG:
${JSON.stringify(userData, null, 2)}

YÊU CẦU ĐẦU RA (JSON format duy nhất):
{
  "summary": "Đoạn nhận xét tổng quan về tính cách và tố chất của bạn (3-4 câu)",
  "recommendations": [
    {
      "majorName": "Tên ngành học cụ thể",
      "groupName": "Tên nhóm ngành lớn (phải khớp với danh sách nhóm ngành phổ biến)",
      "fitScore": 95,
      "reason": "Giải thích chi tiết tại sao ngành này phù hợp với các câu trả lời của họ (2-3 câu). Đề cập đến điểm mạnh, đam mê hoặc hoàn cảnh của họ.",
      "path": "Lời khuyên về lộ trình học tập hoặc kỹ năng cần trau dồi (1-2 câu)"
    }
  ],
  "advice": "Lời khuyên chân thành giúp họ vượt qua rào cản (ví dụ: áp lực gia đình, tài chính) nếu có (2-3 câu)."
}

LƯU Ý QUAN TRỌNG:
1. Hãy đưa ra 3-5 ngành học phù hợp nhất.
2. Ngôn ngữ: Tiếng Việt, thân thiện, truyền cảm hứng nhưng chuyên nghiệp.
3. Nếu người dùng gặp áp lực gia đình (như muốn theo đam mê nhưng gia đình phản đối), hãy đưa ra lời khuyên dung hòa trong mục "advice".
4. Phân tích sâu các câu hỏi mở (text input) để nắm bắt ước mơ thực sự của họ.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response in case AI adds markdown code blocks
    const cleanedJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};
