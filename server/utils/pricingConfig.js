const PRICE_GUIDE = {
  ChatGPT: {
    Free: 0,
    Plus: 20,
    Team: 30,
    Enterprise: 120
  },
  Claude: {
    Free: 0,
    Pro: 20,
    Team: 35,
    Max: 100,
    Enterprise: 85
  },
  Gemini: {
    Free: 0,
    Pro: 20,
    Team: 45,
    Ultra: 80,
    Enterprise: 150
  },
  NotionAI: {
    Free: 0,
    Starter: 8,
    Plus: 10,
    Business: 20,
    Enterprise: 50
  },
  GitHubCopilot: {
    Free: 0,
    Individual: 10,
    Business: 19,
    Enterprise: 35
  },
  Perplexity: {
    Free: 0,
    Plus: 20,
    Teams: 30,
    Enterprise: 55
  },
  Midjourney: {
    Free: 0,
    Basic: 10,
    Standard: 30,
    Pro: 60,
    Corporate: 120
  },
  Cursor: {
    Free: 0,
    Hobby: 0,
    Pro: 20,
    Business: 45,
    Enterprise: 90
  },
  AnthropicAPI: {
    Free: 0,
    Pro: 25,
    Team: 45,
    Enterprise: 80
  },
  OpenAIAPI: {
    Free: 0,
    Plus: 20,
    Team: 45,
    Enterprise: 100
  },
  Windsurf: {
    Free: 0,
    Pro: 15,
    Team: 30,
    Enterprise: 60
  }
};

const TOOL_ALIASES = {
  Copilot: 'GitHubCopilot',
  'GitHub Copilot': 'GitHubCopilot',
  'Notion AI': 'NotionAI',
  'Perplexity AI': 'Perplexity',
  'Midjourney AI': 'Midjourney',
  'Chat GPT': 'ChatGPT',
  Claude: 'Claude',
  Gemini: 'Gemini',
  Cursor: 'Cursor',
  'Anthropic API': 'AnthropicAPI',
  'OpenAI API': 'OpenAIAPI',
  Windsurf: 'Windsurf'
};

const PLAN_ALIASES = {
  Free: ['Free', 'free'],
  Plus: ['Plus', 'Plus/Pro ($20)', 'Plus/Pro', 'Pro ($20)', 'Pro', 'plus'],
  Starter: ['Starter'],
  Team: ['Team', 'team'],
  Business: ['Business', 'business'],
  Individual: ['Individual', 'individual'],
  Enterprise: ['Enterprise', 'enterprise'],
  Max: ['Max', 'max'],
  Ultra: ['Ultra', 'ultra'],
  Standard: ['Standard', 'standard'],
  Corporate: ['Corporate'],
  Teams: ['Teams', 'teams', 'Team'],
  Basic: ['Basic', 'basic'],
  Hobby: ['Hobby', 'hobby']
};

module.exports = {
  PRICE_GUIDE,
  TOOL_ALIASES,
  PLAN_ALIASES
};