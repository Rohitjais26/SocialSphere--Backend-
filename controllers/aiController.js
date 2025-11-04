const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: {
        parts: [{ text: "You are a world-class social media content generator. Write a concise and engaging social media post based on the user's prompt. The post should be in a friendly, professional tone. Do not include hashtags." }]
      },
    };

    // FIX: Ensure this uses the environment variable
    const apiKey = process.env.GEMINI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      // FIX: Log the actual API error response for debugging
      console.error("Gemini API response structure error in generateContent:", result); 
      return res.status(500).json({ message: "Failed to generate content." });
    }

    res.status(200).json({ generatedText });

  } catch (error) {
    console.error("AI API call failed in generateContent:", error);
    res.status(500).json({ message: "Server error during AI generation." });
  }
};

const generateSummary = async (req, res) => {
  try {
    const { analyticsData } = req.body;

    // IMPORTANT: Log the received data to check for 'undefined' or missing fields
    console.log("Analytics data received for summary:", analyticsData); 

    const summaryPrompt = `Based on the following analytics data, provide a one-sentence, professional summary of the user's social media performance.
    
    Analytics Data:
    - Posts: ${analyticsData.posts}
    - Followers: ${analyticsData.followers}
    - Engagement Rate: ${analyticsData.engagement}
    - Reach: ${analyticsData.reach}
    
    Summary:`;
    
    const payload = {
      contents: [{ parts: [{ text: summaryPrompt }] }],
      systemInstruction: {
        parts: [{ text: "You are a professional social media analyst. Provide a summary in a confident, professional tone. Do not use hashtags." }]
      },
    };

    // FIX: Ensure the API URL uses the correct, stable model name
    const apiKey = process.env.GEMINI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      // FIX: Log the actual API error response for debugging
      console.error("Gemini API response error in generateSummary:", result); 
      return res.status(500).json({ message: "Failed to generate AI summary." });
    }

    res.status(200).json({ summary: generatedText });

  } catch (error) {
    console.error("AI summary generation failed:", error);
    res.status(500).json({ message: "Server error during AI summary generation." });
  }
};

// ... (chatWithGemini function follows)
const chatWithGemini = async (req, res) => {
  try {
    const { history, message } = req.body;

    const systemPrompt = `You are SocialSphere Co-Pilot, an AI assistant for the SocialSphere website. Your role is to help users understand how to use the website's features and services. You are an expert on all things SocialSphere. Answer questions concisely and professionally.

Website Features:
- AI Content: Generate captions, hooks, or posts instantly with one click.
- Scheduling: Draft posts, pick a time/date, choose platforms, and queue them.
- Analytics: Track reach, engagement, followers, and top posts with insights.
- Auditing: Review your profiles for performance gaps and recommendations.
- Calendar: Get a visual overview of all planned posts across platforms.
- AI Summary: You can provide a one-sentence, professional summary of the user's social media performance based on their analytics data.
- Sentiment Analysis: You can analyze the sentiment of a user's post (Positive, Negative, or Neutral).

Platform Integrations:
- Instagram: Connect, schedule, reply, and analyze posts and metrics.
- Facebook: Connect and schedule posts.
- Twitter: Connect and schedule posts.
- LinkedIn: Connect and schedule posts.
- More coming soon.

User Support:
- Onboarding: New users should register, connect their accounts, and explore the dashboard features.
- Troubleshooting: If an account fails to connect, users should re-check permissions or reconnect via settings.
- Contact: Users can reach out via the Help Center or Contact page for direct assistance.`;
    
    const payload = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [...history, { role: "user", parts: [{ text: message }] }],
    };

    // FIX: Use the environment variable for the API key here too
    const apiKey = process.env.GEMINI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      // FIX: Log the actual API error response for debugging
      console.error("Gemini API response error in chatWithGemini:", result); 
      return res.status(500).json({ message: "Failed to get a chat response." });
    }

    res.status(200).json({ response: generatedText });

  } catch (error) {
    console.error("Gemini chat API call failed:", error);
    res.status(500).json({ message: "Server error during AI chat." });
  }
};


module.exports = { generateContent, generateSummary, chatWithGemini };
