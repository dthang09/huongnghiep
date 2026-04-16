// Gọi qua Vercel serverless function - API key được giữ server-side, KHÔNG lộ trong JS bundle
export const analyzeCareer = async (userData) => {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Career analysis error:", error);
    throw error;
  }
};
