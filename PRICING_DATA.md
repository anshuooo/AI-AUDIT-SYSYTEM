# AI Tool Pricing Data

This document defines the centralized pricing architecture for the AI Spend Audit platform.

Each tool has unique plans, monthly pricing, and enterprise handling.

## Pricing Architecture

Pricing is maintained in `server/utils/pricingConfig.js` and consumed by `server/utils/auditEngine.js`.

### Tool Pricing Summary

| Tool | Plans | Monthly Price | Yearly Calculation | Notes |
|------|-------|---------------|--------------------|-------|
| ChatGPT | Free, Plus, Team, Enterprise | 0 / 20 / 30 / 120 | `monthly * 12` | Higher enterprise cost for volume deployments |
| Claude | Free, Pro, Team, Max, Enterprise | 0 / 20 / 35 / 100 / 85 | `monthly * 12` | Team tier balances performance and seat count |
| Gemini | Free, Pro, Team, Ultra, Enterprise | 0 / 20 / 45 / 80 / 150 | `monthly * 12` | Enterprise is premium for advanced business workflows |
| GitHub Copilot | Free, Individual, Business, Enterprise | 0 / 10 / 19 / 35 | `monthly * 12` | Individual vs Business seat optimization |
| Anthropic API | Free, Pro, Team, Enterprise | 0 / 25 / 45 / 80 | `monthly * 12` | API-focused pricing with team-level discounts |
| OpenAI API | Free, Plus, Team, Enterprise | 0 / 20 / 45 / 100 | `monthly * 12` | Enterprise pricing reflects heavy usage and support |
| Windsurf / v0 | Free, Pro, Team, Enterprise | 0 / 15 / 30 / 60 | `monthly * 12` | Light SaaS pricing for developer-first tools |
| Cursor | Free, Hobby, Pro, Business, Enterprise | 0 / 0 / 20 / 45 / 90 | `monthly * 12` | Growth pricing for developer productivity |
| Notion AI | Free, Starter, Plus, Business, Enterprise | 0 / 8 / 10 / 20 / 50 | `monthly * 12` | Common knowledge worker pricing |
| Perplexity | Free, Plus, Teams, Enterprise | 0 / 20 / 30 / 55 | `monthly * 12` | Team pricing for shared AI research workflows |
| Midjourney | Free, Basic, Standard, Pro, Corporate | 0 / 10 / 30 / 60 / 120 | `monthly * 12` | Creative plan tiers and corporate license pricing |

## Fallback and Safety

- Unknown tools are matched using alias normalization.
- Unknown plan labels are parsed for explicit numeric values where possible.
- The audit engine includes safe fallbacks to prevent undefined pricing and `toFixed` crashes.

## Usage

The pricing config is imported into the audit engine to calculate:
- `currentCost`
- `optimizedCost`
- `monthlySavings`
- `yearlySavings`
- downgrade recommendations and enterprise optimization
