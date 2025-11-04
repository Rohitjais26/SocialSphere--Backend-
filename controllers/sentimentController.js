// controllers/sentimentController.js (UPDATED FOR MEMORY STORAGE)

const fs = require('fs'); // Keep if helper below is used, but fs is no longer used for core logic
const path = require('path'); 

// Helper function to get MIME type from file extension
const mimeTypeFromPath = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.mp4': return 'video/mp4';
        case '.mov': return 'video/quicktime';
        default: return 'application/octet-stream';
    }
};

const analyzeSentiment = async (req, res) => {
  // Ensure the API key is retrieved (from controllers/api.txt)
  const apiKey = "AIzaSyCYWuK__lLWVOvo0m_FvcnNLzilAprb3Bs"; 
  
  try {
    const { text } = req.body;
    const mediaFile = req.file; // The uploaded file buffer is now available here

    if (!text && !mediaFile) {
      return res.status(400).json({ message: "Text or media is required for sentiment analysis." });
    }

    const contents = [];
    const analysisPrompt = "Analyze the sentiment expressed in this social media post, considering both the text and any provided media. Classify the overall sentiment as POSITIVE, NEGATIVE, or NEUTRAL. Provide a brief, one-sentence explanation for your classification.";

    // 1. Add Media Part (if file exists)
    if (mediaFile) {
      // --- FIX: Access mediaFile.mimetype and mediaFile.buffer directly ---
      const mimeType = mediaFile.mimetype; // Multer provides the mimetype directly
      const fileData = mediaFile.buffer.toString('base64'); // Access the file buffer directly
      
      contents.push({ 
        inlineData: { 
          data: fileData, 
          mimeType: mimeType 
        } 
      });
      // --- REMOVED: fs.unlinkSync is no longer necessary as the file is in memory ---
    }

    // 2. Add Text Prompt Part
    contents.push({ text: `${analysisPrompt}\n\nPost Content: "${text || 'No text provided.'}"` });


    const payload = {
      contents: [{ parts: contents }],
    };
    
    // Use the Gemini model that supports multimodal inputs
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      console.error("Gemini API error:", result);
      return res.status(500).json({ message: "Failed to perform sentiment analysis." });
    }

    res.status(200).json({ sentiment: generatedText });

  } catch (error) {
    console.error("Sentiment analysis failed:", error);
    // --- REMOVED: All file system cleanup on error is removed ---
    res.status(500).json({ message: "Server error during sentiment analysis." });
  }
};

module.exports = { analyzeSentiment };