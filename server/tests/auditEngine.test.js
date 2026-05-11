const { analyzeAudit } = require('../utils/auditEngine');

describe('Audit Engine Logic Tests', () => {
  test('should calculate savings correctly for an Enterprise downgrade scenario', () => {
    const input = {
      teamSize: 5,
      useCase: 'Productivity',
      tools: [
        { name: 'ChatGPT', plan: 'Enterprise', spend: 300, users: 5 }
      ]
    };

    const results = analyzeAudit(input);

    expect(results.totalMonthlySavings).toBe(150);
    expect(results.breakdown).toHaveLength(1);
    expect(results.breakdown[0].recommendedPlan).toBe('Team');
    expect(results.breakdown[0].monthlySavings).toBe(150);
    expect(results.breakdown[0].reason).toContain('Switch to Team');
  });

  test('should detect optimal plan upgrade for a larger Gemini team', () => {
    const input = {
      teamSize: 16,
      useCase: 'Research',
      tools: [
        { name: 'Gemini', plan: 'Pro', users: 16, spend: 0 }
      ]
    };

    const results = analyzeAudit(input);

    expect(results.breakdown[0].recommendedPlan).toBe('Ultra');
    expect(results.breakdown[0].monthlySavings).toBe(320);
    expect(results.totalMonthlySavings).toBe(320);
  });

  test('should downshift Enterprise plans for small OpenAIAPI teams', () => {
    const input = {
      teamSize: 3,
      useCase: 'Mixed',
      tools: [
        { name: 'OpenAI API', plan: 'Enterprise', users: 3, spend: 300 }
      ]
    };

    const results = analyzeAudit(input);

    expect(results.breakdown[0].recommendedPlan).toBe('Plus');
    expect(results.breakdown[0].monthlySavings).toBe(240);
    expect(results.breakdown[0].reason).toContain('Switch to Plus');
  });

  test('should preserve no-savings summary when current configuration is optimal', () => {
    const input = {
      teamSize: 10,
      useCase: 'Sales',
      tools: [
        { name: 'Claude', plan: 'Pro', users: 10, spend: 200 }
      ]
    };

    const results = analyzeAudit(input);

    expect(results.totalMonthlySavings).toBe(0);
    expect(results.aiSummary).toContain('No material savings were detected');
    expect(results.breakdown[0].recommendedPlan).toBe('Pro');
  });

  test('should handle explicit plan aliases and preserve stable savings output', () => {
    const input = {
      teamSize: 4,
      useCase: 'Customer Support',
      tools: [
        { name: 'Notion AI', plan: 'Plus/Pro ($20)', users: 4, spend: 120 }
      ]
    };

    const results = analyzeAudit(input);

    expect(results.breakdown[0].currentPlan).toBe('Plus');
    expect(results.breakdown[0].recommendedPlan).toBe('Plus');
    expect(results.totalMonthlySavings).toBe(0);
  });
});
