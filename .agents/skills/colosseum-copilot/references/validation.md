# Colosseum Copilot — Validation Guide

This guide consolidates all validation criteria, quality checks, and verification standards for the Colosseum Copilot skill. Use this to ensure outputs meet research quality standards.

---

## Table of Contents

1. [Pre-Flight Auth Validation](#pre-flight-auth-validation)
2. [Conversational Mode Validation](#conversational-mode-validation)
3. [Deep Dive Mode Validation](#deep-dive-mode-validation)
4. [Evidence Floors](#evidence-floors)
5. [Output Quality Standards](#output-quality-standards)
6. [Error Handling Validation](#error-handling-validation)
7. [Version Check Validation](#version-check-validation)

---

## Pre-Flight Auth Validation

**REQUIRED before any API call.** Do not skip this validation.

### Checklist

- [ ] `COLOSSEUM_COPILOT_PAT` is set in environment
- [ ] `COLOSSEUM_COPILOT_API_BASE` is set (default: `https://copilot.colosseum.com/api/v1`)
- [ ] `GET /status` returns `{ "authenticated": true }`
- [ ] If 401 or missing env vars → STOP and guide user to https://arena.colosseum.org/copilot

### Validation Action

```bash
# Verify connection before proceeding
curl -s "$COLOSSEUM_COPILOT_API_BASE/status" \
  -H "Authorization: Bearer $COLOSSEUM_COPILOT_PAT"
```

Expected response: `{ "authenticated": true, "expiresAt": "...", "scope": "..." }`

---

## Conversational Mode Validation

Conversational mode activates by default for all non-deep-dive queries.

### Required Quality Checks

| Check | Description | Fail Condition |
|-------|-------------|----------------|
| **Archive integration** | At least one `search/archives` call for non-trivial questions | No archive sources cited |
| **Accelerator check** | Run with `acceleratorOnly: true` for landscape questions | No accelerator results reported |
| **Freshness anchor** | Use `hackathon.startDate` for chronology claims | Using names/memory for dates |
| **Entity coverage** | Address each named company/protocol/entity | Mentioned entities not addressed |
| **Landscape check** | Never claim "nobody has done this" without accelerator check | Unvalidated "no competition" claims |

### Evidence Floor Validation

| Query Type | Required Evidence | Minimum Sources |
|------------|-------------------|-----------------|
| **Pure retrieval** | Builder projects (slugs from `/search/projects`) | 3+ projects |
| **Archive retrieval** | Archive documents (title/doc from `/search/archives`) | 2+ sources |
| **Comparison** | Projects for each side + archive citation | 2+ projects + 1 archive |
| **Evaluative** | Projects + archive + landscape (Grid/web) | 2+ projects + 1 archive + 1 landscape |
| **Build guidance** | Projects + archive + incumbents | 2+ projects + 1 archive + 1 incumbent |

### Output Format Validation

- [ ] Bullet points, not tables (except in reference docs)
- [ ] Inline citations (project slugs, archive titles, URLs)
- [ ] Concise (typically 5-15 bullets)
- [ ] No meta-commentary about process
- [ ] Offer deep-dive when warranted

---

## Deep Dive Mode Validation

Deep dive mode activates ONLY on explicit opt-in:
- "vet this idea", "deep dive", "full analysis", "validate this"
- "is X worth building?", "should I build X?"
- User accepts offer: "Want me to do a full deep-dive on this?"

### Step 2: Parallel Search Validation

#### Project Search Requirements

- [ ] **2+ distinct queries** with different formulations (semantic + problem-space)
- [ ] **Tag-filtered follow-up** using facets from initial results
- [ ] **Cross-hackathon coverage** — results span multiple hackathons OR single-hackathon dominance explained
- [ ] **Accelerator portfolio check** (`acceleratorOnly: true`) executed and documented

#### Archive Search Requirements

- [ ] **Dual-track search** — conceptual + implementation-focused queries
- [ ] Queries are **3-6 focused keywords** (not 1-2 words, not full sentences)
- [ ] **3-4 high-quality citations** (not padded with tangential references)
- [ ] If top results pre-2010 for modern topic — re-queried with ecosystem terms

#### Hackathon Analysis Requirements

- [ ] Topic-aware routing to relevant hackathon(s)
- [ ] Chronology verified via `GET /filters` `hackathons[].startDate`
- [ ] Tag distributions used to identify crowded vs. underexplored areas

#### Grid (Ecosystem) Check Requirements

- [ ] **Phase 1**: Category search with 1-3 `productType` slugs
- [ ] **Phase 2**: Keyword recall for products not in standard categories
- [ ] **Phase 3**: Saturation check (total products, distinct roots)
- [ ] Top 5-10 key players identified with product IDs, root slugs

### Step 3: Research Angles Validation

- [ ] 2-3 distinct angles identified
- [ ] Each angle connects to hackathon data if available
- [ ] Each angle has web search query for validation
- [ ] Angles are specific enough to validate via web search

### Step 4: Landscape Analysis Validation

- [ ] Web search called for **EACH** angle (not just one)
- [ ] Each result summarizes: key players, recent developments, research/standards, maturity level
- [ ] Maturity level assigned: Emerging | Growing | Established | Saturated

### Step 5: Verification Checklist (Internal)

**Complete ALL before synthesis:**

- [ ] `search/projects` returned results (if empty, broaden query)
- [ ] `search/archives` returned results (if empty, try different framing)
- [ ] Web search completed for EACH angle
- [ ] At least one `projects/by-slug` call for detailed evidence
- [ ] 2+ distinct project queries executed
- [ ] One tag/filter follow-up query executed
- [ ] Cross-hackathon coverage confirmed OR explained
- [ ] Accelerator portfolio checked and outcome documented

### Step 6: Market Landscape Research Validation

**CRITICAL — Do not skip.**

- [ ] Key players identified (names + product/root IDs from Grid)
- [ ] Existing players' offerings researched via web search
- [ ] Product support graph checked for integration opportunities
- [ ] Landscape classification applied (Open space | Differentiation opportunity | Well-covered)
- [ ] Related builders highlighted if high semantic overlap
- [ ] Evidence cited (Grid product IDs, root slugs, saturation counts)

### Step 7: Deep Opportunity Research Validation

**ONLY after Step 6 market research completes.**

- [ ] Problem & user research completed (web search: TAM, friction, pain points)
- [ ] Revenue model research completed (web search: business model, pricing, funding)
- [ ] Foundational archive search completed (with `maxChunksPerDoc: 2` for deep-dive)
- [ ] Full document fetch for promising archives (`/archives/:documentId?maxChars=8000`)
- [ ] Go-to-market case studies completed (web search: cold start, bootstrap strategies)

### Step 8: Report Structure Validation

**Required sections in this exact order:**

1. [ ] Similar Projects (5-8 bullets)
2. [ ] Archive Insights (3-5 bullets)
3. [ ] Current Landscape (one subsection per angle)
4. [ ] Key Insights
5. [ ] Opportunities & Gaps
6. [ ] **Deep Dive: Top Opportunity** with all subsections:
   - [ ] Market Landscape (REQUIRED)
   - [ ] The Problem
   - [ ] Revenue Model
   - [ ] Go-to-Market Friction
   - [ ] Founder-Market Fit (may omit if self-evident in compact mode)
   - [ ] Why Crypto/Solana? (may reduce to 1-2 bullets in compact mode)
   - [ ] Risk Assessment
7. [ ] Appendix: Further Reading (optional, omit if needed)

---

## Evidence Floors

### By Query Type (Conversational)

| Query Type | Required Sources |
|------------|-----------------|
| Pure retrieval | Builder projects only |
| Archive retrieval | Archive documents only |
| Comparison | Projects (each side) + archive |
| Evaluative | Projects + archive + current landscape |
| Build guidance | Projects + archive + incumbents |

### By Deep Dive Section

| Section | Required Evidence |
|---------|-------------------|
| Similar Projects | 5-8 project slugs with descriptions |
| Archive Insights | 3-5 archive sources with titles |
| Current Landscape | Web search results per angle |
| Market Landscape | Grid product IDs, root slugs, saturation counts |
| The Problem | Web search with TAM/friction data |
| Revenue Model | Web search with comparable business models |
| Why Crypto/Solana? | Specific blockchain-enabled capabilities |

---

## Output Quality Standards

### Format Requirements

- **Bullet points only** — no tables in user-facing output
- **Inline citations** — project slugs, archive titles, URLs inline
- **No separate sources section** — cite inline only
- **Concise descriptions** — 1-2 sentences max per bullet
- **No meta-commentary** — don't narrate process

### Content Requirements

- **Evidence-based** — every claim traces to a source
- **Specific** — "SMEs wait 60-90 days for payment" not "gap in payments"
- **No speculation** — if you can't cite it, don't claim it
- **Address hard questions** — regulatory risk, cold start, competition

### Required Disclaimers (Deep Dive)

Include in every report:

> **Note:** These are hackathon submissions — demos and prototypes, not production products. Many may no longer be active. They're included as inspiration and to show what's been tried before.

---

## Error Handling Validation

### API Error Response Validation

All errors return: `{ "error": "<message>", "code": "<ERROR_CODE>", "retryable": <boolean> }`

### Common Error Codes

| Code | Status | Retryable | Action |
|------|--------|-----------|--------|
| `INVALID_JSON` | 400 | No | Fix JSON syntax |
| `INVALID_QUERY` | 400 | No | Check params (field names, value ranges) |
| `PAYLOAD_TOO_LARGE` | 413 | No | Reduce body size (1 MB limit) |
| `RATE_LIMITED` | 429 | Yes | Back off per `Retry-After` header |
| `UNAUTHORIZED` | 401 | No | Check PAT at https://arena.colosseum.org/copilot |
| 5xx errors | 500+ | Yes | Note in report, include `requestId` |

### Empty Results Handling

| Endpoint | Empty Action |
|----------|--------------|
| `/search/projects` | Broaden query, remove filters |
| `/search/archives` | Try synonyms, broader concepts, different angle |
| Web search | Refine query pattern, check spelling |

---

## Version Check Validation

### When to Check

After your first API call, check the `X-Copilot-Skill-Version` response header.

### Action if Outdated

If header value > skill version:

> "A newer version of the Copilot skill is available (vX.X.X). Update with:
> `npx skills add ColosseumOrg/colosseum-copilot`"

### Current Skill Version

This validation guide is for skill version **1.2.1**.

---

## Quick Validation Checklist

### Before Any Response

- [ ] Auth validated via `/status`
- [ ] Correct mode identified (conversational vs deep dive)
- [ ] Evidence floor met for query type
- [ ] Inline citations included
- [ ] No meta-commentary about process

### Deep Dive Specific

- [ ] All 2-8 steps completed in order
- [ ] Step 5 verification checklist passed
- [ ] Market landscape research (Step 6) completed
- [ ] All deep dive subsections included
- [ ] Disclaimers included
- [ ] Related builders highlighted if applicable

---

## Reference

- **Main skill file:** `SKILL.md`
- **Deep workflow:** `workflow-deep.md`
- **API reference:** `api-reference.md`
- **Grid recipes:** `grid-recipes.md`

