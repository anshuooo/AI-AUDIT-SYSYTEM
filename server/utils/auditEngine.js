/**
 * PROFESSIONAL AI SPEND AUDIT ENGINE
 * Realistic SaaS pricing optimization and spend intelligence
 */

const {
  PRICE_GUIDE,
  TOOL_ALIASES,
  PLAN_ALIASES
} = require('./pricingConfig');

const normalizeTool = (name) => TOOL_ALIASES[name] || name;

const normalizePlan = (plan) => {
  if (!plan || typeof plan !== 'string') return plan;
  const normalized = plan.trim();
  for (const key in PLAN_ALIASES) {
    if (PLAN_ALIASES[key].some(alias => alias.toLowerCase() === normalized.toLowerCase())) {
      return key;
    }
  }
  return normalized;
};

const parseExplicitPlanPrice = (plan) => {
  const match = String(plan).match(/\$?\s*(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
};

const getPlanPrice = (tool, plan) => {
  const normalizedTool = normalizeTool(tool);
  const normalizedPlan = normalizePlan(plan);
  const toolPricing = PRICE_GUIDE[normalizedTool];

  if (!toolPricing) {
    console.warn('⚠️ [AUDIT ENGINE] No pricing guide for tool:', normalizedTool);
    return null;
  }

  if (toolPricing[normalizedPlan] != null) {
    return toolPricing[normalizedPlan];
  }

  const explicitPrice = parseExplicitPlanPrice(plan);
  if (explicitPrice != null) {
    console.log('ℹ️ [AUDIT ENGINE] Parsed explicit plan price from plan label:', plan, explicitPrice);
    return explicitPrice;
  }

  console.warn('⚠️ [AUDIT ENGINE] Unknown plan for tool:', normalizedTool, plan);
  return null;
};

const detectDuplicateTools = (tools) => {
  const seen = {};
  const duplicates = [];

  tools.forEach((tool) => {
    const normalizedTool = normalizeTool(tool.name);
    seen[normalizedTool] = (seen[normalizedTool] || 0) + 1;
  });

  Object.keys(seen).forEach((toolName) => {
    if (seen[toolName] > 1) duplicates.push(toolName);
  });

  return duplicates;
};

const recommendPlan = ({ tool, currentPlan, users, useCase, currentPrice }) => {
  const normalizedTool = normalizeTool(tool);
  const normalizedPlan = normalizePlan(currentPlan);
  const pricing = PRICE_GUIDE[normalizedTool] || {};
  const planCosts = Object.entries(pricing).sort((a, b) => a[1] - b[1]);

  const getCheapest = () => planCosts[0]?.[0] || normalizedPlan;
  const getAffordable = (target) => pricing[target] != null ? target : normalizedPlan;

  switch (normalizedTool) {
    case 'ChatGPT':
      if (normalizedPlan === 'Enterprise' && users <= 20) return users <= 3 ? 'Plus' : 'Team';
      if (normalizedPlan === 'Team' && users <= 4) return 'Plus';
      if (normalizedPlan === 'Plus' && users > 10) return 'Team';
      if (normalizedPlan === 'Free' && users > 1) return 'Plus';
      if (users > 50 && normalizedPlan === 'Team') return 'Enterprise';
      return normalizedPlan;
    case 'Claude':
      if (normalizedPlan === 'Max' && useCase !== 'Research') return 'Pro';
      if (normalizedPlan === 'Pro' && users > 12) return 'Team';
      if (normalizedPlan === 'Free' && users > 4) return 'Pro';
      return normalizedPlan;
    case 'Gemini':
      if (normalizedPlan === 'Ultra' && users <= 2) return 'Pro';
      if (normalizedPlan === 'Pro' && users > 15) return 'Ultra';
      if (normalizedPlan === 'Free' && users > 1) return 'Pro';
      return normalizedPlan;
    case 'GitHubCopilot':
      if (normalizedPlan === 'Business' && users <= 4) return 'Individual';
      if (normalizedPlan === 'Enterprise' && users <= 20) return 'Business';
      if (normalizedPlan === 'Individual' && users >= 6) return 'Business';
      return normalizedPlan;
    case 'NotionAI':
      if (normalizedPlan === 'Business' && users <= 6) return 'Plus';
      if (normalizedPlan === 'Plus' && users > 15) return 'Business';
      return normalizedPlan;
    case 'Perplexity':
      if (normalizedPlan === 'Teams' && users <= 5) return 'Plus';
      if (normalizedPlan === 'Plus' && users > 10) return 'Teams';
      return normalizedPlan;
    case 'Midjourney':
      if (normalizedPlan === 'Pro' && users <= 2) return 'Standard';
      if (normalizedPlan === 'Standard' && users > 5) return 'Pro';
      if (normalizedPlan === 'Basic' && users > 2) return 'Standard';
      return normalizedPlan;
    case 'Cursor':
      if (normalizedPlan === 'Business' && users <= 5) return 'Pro';
      if (normalizedPlan === 'Enterprise' && users <= 10) return 'Business';
      if (normalizedPlan === 'Free' && users > 1) return 'Pro';
      return normalizedPlan;
    case 'AnthropicAPI':
      if (normalizedPlan === 'Enterprise' && users <= 15) return users <= 5 ? 'Pro' : 'Team';
      if (normalizedPlan === 'Team' && users <= 3) return 'Pro';
      if (normalizedPlan === 'Pro' && users > 8) return 'Team';
      if (normalizedPlan === 'Free' && users > 2) return 'Pro';
      return normalizedPlan;
    case 'OpenAIAPI':
      if (normalizedPlan === 'Enterprise' && users <= 20) return users <= 4 ? 'Plus' : 'Team';
      if (normalizedPlan === 'Team' && users <= 5) return 'Plus';
      if (normalizedPlan === 'Plus' && users > 12) return 'Team';
      if (normalizedPlan === 'Free' && users > 1) return 'Plus';
      return normalizedPlan;
    case 'Windsurf':
      if (normalizedPlan === 'Enterprise' && users <= 10) return users <= 3 ? 'Pro' : 'Team';
      if (normalizedPlan === 'Team' && users <= 4) return 'Pro';
      if (normalizedPlan === 'Pro' && users > 6) return 'Team';
      if (normalizedPlan === 'Free' && users > 1) return 'Pro';
      return normalizedPlan;
    default:
      return normalizedPlan;
  }
};

const buildRiskLevel = (currentCost, optimizedCost, users) => {
  const savings = currentCost - optimizedCost;
  const ratio = currentCost > 0 ? savings / currentCost : 0;
  const averagePerUser = users > 0 ? currentCost / users : 0;

  if (averagePerUser >= 60 || ratio >= 0.35) return 'High';
  if (averagePerUser >= 35 || ratio >= 0.16) return 'Medium';
  return 'Low';
};

const analyzeAudit = (data) => {
  if (!data || !Array.isArray(data.tools)) {
    console.error('🔴 [AUDIT ENGINE] Invalid input', data);
    return { error: 'Invalid audit input' };
  }

  const teamSize = Number(data.teamSize) || 1;
  const useCase = data.useCase || 'Mixed';
  const tools = data.tools;

  console.log('🔍 [AUDIT ENGINE] Starting analysis', { teamSize, useCase, toolCount: tools.length });

  const duplicateTools = detectDuplicateTools(tools);
  if (duplicateTools.length) {
    console.warn('⚠️ [AUDIT ENGINE] Detected duplicate tools in audit:', duplicateTools);
  }

  let totalMonthlySavings = 0;
  const breakdown = tools.map((tool) => {
    const normalizedTool = normalizeTool(tool.name || 'Unknown');
    const currentPlan = normalizePlan(tool.plan || 'Free');
    const users = Math.max(1, Number(tool.users) || 1);
    const reportedSpend = Number(tool.spend || 0);
    const planPrice = getPlanPrice(normalizedTool, currentPlan);

    const currentCost = reportedSpend > 0 ? reportedSpend : (planPrice != null ? planPrice * users : 0);
    const baselineCost = planPrice != null ? planPrice * users : currentCost;
    const recommendedPlan = recommendPlan({
      tool: normalizedTool,
      currentPlan,
      users,
      useCase,
      currentPrice: planPrice
    });
    const recommendedPrice = getPlanPrice(normalizedTool, recommendedPlan);

    const optimizedCost = recommendedPrice != null ? recommendedPrice * users : currentCost;
    const monthlySavings = Math.max(0, Number((currentCost - optimizedCost).toFixed(2)));
    const yearlySavings = Number((monthlySavings * 12).toFixed(2));
    const riskLevel = buildRiskLevel(currentCost, optimizedCost, users);
    const utilizationScore = currentCost > 0 ? Math.min(1, optimizedCost / currentCost) : 0;

    let reason = 'Your current configuration is well aligned with team size and usage.';
    if (monthlySavings > 0) {
      reason = `Switch to ${recommendedPlan} to reduce monthly cost from $${currentCost.toFixed(2)} to $${optimizedCost.toFixed(2)}.`;
    } else if (currentCost === 0 && planPrice !== null) {
      reason = `Audit estimated your actual cost based on the ${currentPlan} plan pricing.`;
    } else if (currentCost === 0 && planPrice === null) {
      reason = 'Unable to derive tool pricing from the provided plan label. Please validate the selected plan.';
    }

    if (duplicateTools.includes(normalizedTool)) {
      reason = `Duplicate ${normalizedTool} entries were detected. Consolidating licenses may reduce waste.`;
    }

    if (currentPlan === 'Enterprise' && users <= 15 && monthlySavings === 0) {
      reason = 'Enterprise plan detected for a small team. Consider downshifting to a more appropriate tier.';
    }

    if (currentCost > 0 && currentCost / users > 60 && monthlySavings === 0) {
      reason = 'High per-user spend detected. A deeper usage review is recommended even if immediate savings are not available.';
    }

    if (utilizationScore < 0.5 && currentCost > 0 && monthlySavings === 0) {
      reason = 'The current spend appears inefficient relative to team size; review usage and seat allocation for this tool.';
    }

    console.log('✅ [AUDIT ENGINE] Tool evaluated', {
      tool: normalizedTool,
      currentPlan,
      recommendedPlan,
      users,
      reportedSpend,
      currentCost,
      optimizedCost,
      monthlySavings,
      yearlySavings,
      riskLevel,
      utilizationScore,
      reason
    });

    totalMonthlySavings += monthlySavings;

    return {
      tool: normalizedTool,
      currentPlan,
      recommendedPlan,
      users,
      currentCost: Number(currentCost.toFixed(2)),
      optimizedCost: Number(optimizedCost.toFixed(2)),
      monthlySavings,
      yearlySavings,
      riskLevel,
      reason,
      duplicate: duplicateTools.includes(normalizedTool)
    };
  });

  totalMonthlySavings = Number(totalMonthlySavings.toFixed(2));
  const totalYearlySavings = Number((totalMonthlySavings * 12).toFixed(2));

  const aiSummary = totalMonthlySavings > 0
    ? `We found $${totalMonthlySavings.toFixed(2)} in monthly optimization opportunities and $${totalYearlySavings.toFixed(2)} in annual savings across your AI stack.`
    : 'No material savings were detected from the current tool configuration. Continue monitoring usage and restructure high-cost seats if needed.';

  console.log('📊 [AUDIT ENGINE] Totals', { totalMonthlySavings, totalYearlySavings });

  return {
    totalMonthlySavings,
    totalYearlySavings,
    breakdown,
    aiSummary
  };
};

module.exports = { analyzeAudit };