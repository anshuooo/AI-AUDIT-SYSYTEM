const axios = require('axios');

/**
 * AI Summary Generation Service
 * Uses Gemini API for dynamic audit summaries
 */
const generateSummary = async (auditResults) => {
  const apiKey = process.env.AI_API_KEY;

  // Safe fallback summary
  const fallbackSummary = `
Your AI tooling stack was successfully analyzed. 
We identified potential opportunities to optimize subscription costs, reduce unnecessary enterprise usage, and improve overall AI infrastructure efficiency. 
Reviewing plan allocation and overlapping tools may help lower long-term operational expenses while maintaining productivity.
`;

  // Validate API key
 if (!apiKey || apiKey === 'your_api_key_here') {
    console.warn('⚠️ Missing Gemini API Key');
    return fallbackSummary;
  }

  try {
    // Build dynamic audit context
    const auditContext = `
Total Monthly Savings: $${auditResults.totalMonthlySavings || 0}
Total Yearly Savings: $${auditResults.totalYearlySavings || 0}

Tool Breakdown:
${JSON.stringify(auditResults.breakdown, null, 2)}
`;

    // Gemini API Request
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
You are a senior AI infrastructure financial auditor helping startup founders optimize AI spending.

Your task:
Analyze the audit data and generate a professional executive summary.

Rules:
- Write approximately 80–120 words
- Sound professional and finance-oriented
- Mention overspending risks
- Mention downgrade or optimization opportunities
- Mention team-size mismatches if relevant
- Mention overlapping tools if applicable
- Mention positive optimization if stack already looks efficient
- Never exaggerate savings
- Do NOT use markdown
- Return only the summary paragraph

Audit Data:
${auditContext}
                `
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    // Extract Gemini response safely
    const summary =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summary) {
      console.warn('⚠️ Empty Gemini response');
      return fallbackSummary;
    }

    console.log('✅ AI SUMMARY GENERATED FROM GEMINI');

    return summary.trim();

  } catch (error) {
    console.error(
      '🔥 Gemini AI Error:',
      error.response?.data || error.message
    );

    return fallbackSummary;
  }
};

module.exports = { generateSummary };