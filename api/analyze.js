import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Chỉ cho phép POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // CORS - chỉ cho phép domain của bạn
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const API_KEY = process.env.GEMINI_API_KEY; // Không có prefix VITE_ - server-side only
  if (!API_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const { userData } = req.body;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

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

    const cleanedJson = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedJson);

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "AI analysis failed", details: error.message });
  }
}
