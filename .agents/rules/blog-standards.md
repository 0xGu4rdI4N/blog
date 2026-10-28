# Blog Writing Standards & Workflow Guidelines

## Post Structure Requirements
1. **Footer Tribute Requirement**:
   All blog posts must include or acknowledge the tribute footer:
   > *"If I have seen further, it is by standing on the shoulders of giants."*
   The Next.js rendering engine in `src/app/writings/[slug]/page.js` automatically renders this footer at the bottom of every post if no custom `:::footer` block is present. When drafting or modifying posts, ensure this tribute is preserved.

2. **Custom Directives**:
   Use the established remark directives for post formatting:
   - `:::cent`: Center math equations, quotes, or key formulas.
   - `:::pink`: Important takeaways, axioms, or highlight callouts.
   - `:::note`: Contextual notes, collaborative LLM disclaimers, or auxiliary insights.
   - `:::dropdown[Title]`: Collapsible accordion sections for deep mathematical derivations, code listings, or verbose logs.
   - `:::footer`: Custom footer note if extending beyond the standard giants tribute.

3. **Author Voice & Editorial Integrity**:
   - Preserve the author's authentic voice, specific analogies, and phrasing.
   - Only correct grammar, spelling, and syntax while keeping the original intent, tone, and metaphors intact.
