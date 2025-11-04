// controllers/auditController.js
// controllers/auditController.js
const Post = require("../models/Post");
const { getAnalyticsData } = require("./analyticsController");

const generateAudit = async (req, res) => {
  try {
    // 1. Fetch relevant data for the audit
    // Currently using mock data, but this will eventually come from real social media APIs.
    const mockAnalyticsData = {
      posts: 125,
      followers: "5.3k",
      engagement: "12%",
      reach: "23.4k",
      topPosts: [
        { content: "Our new product is live!", likes: 50, comments: 10, engagement: "8%" },
        { content: "Throwback to our team retreat.", likes: 35, comments: 5, engagement: "6%" }
      ],
      audienceDemographics: "Male and female, 25-34, marketing professionals"
    };

    // 2. Craft a detailed prompt for Gemini AI
    const auditPrompt = `You are an expert social media analyst. Based on the following data for a user's account, provide a concise, high-impact social media audit report. The report MUST be short, effective, and prioritize clear, actionable steps.

    **Current Performance Metrics:**
    - Total Posts: ${mockAnalyticsData.posts}
    - Total Followers: ${mockAnalyticsData.followers}
    - Engagement Rate: ${mockAnalyticsData.engagement}
    - Total Reach: ${mockAnalyticsData.reach}

    **Top Performing Posts:**
    ${mockAnalyticsData.topPosts.map(post => `- Post: "${post.content}"\n  - Likes: ${post.likes}\n  - Comments: ${post.comments}\n  - Engagement: ${post.engagement}`).join('\n')}

    **Audience Insights:**
    - Demographics: ${mockAnalyticsData.audienceDemographics}

    **Your Task (Must be structured exactly as below):**
    Generate a report with the following four sections. Keep the response brief.
    
    ## 1. Executive Summary
    (One concise paragraph summarizing performance and overall action focus.)
    
    ## 2. Key Strengths
    * (Strength 1: Be specific)
    * (Strength 2: Be specific)
    * (Strength 3: Be specific)
    
    ## 3. Top Weaknesses
    * (Weakness 1: Area for improvement)
    * (Weakness 2: Area for improvement)
    * (Weakness 3: Area for improvement)
    
    ## 4. Action Plan (High Priority)
    * (Action 1: A specific, immediate step to take)
    * (Action 2: A specific, immediate step to take)
    * (Action 3: A specific, immediate step to take)`;

    const payload = {
      contents: [{ parts: [{ text: auditPrompt }] }],
    };

    const apiKey = "AIzaSyCYWuK__lLWVOvo0m_FvcnNLzilAprb3Bs";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // 3. Call the Gemini AI API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return res.status(500).json({ message: "Failed to generate audit report." });
    }

    res.status(200).json({ report: generatedText });

  } catch (error) {
    console.error("Audit generation failed:", error);
    res.status(500).json({ message: "Server error during audit generation." });
  }
};

module.exports = { generateAudit };