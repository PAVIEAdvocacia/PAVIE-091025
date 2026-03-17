# Sprint 1 - Content Model Decisions

## Scope

Sprint 1 implements the canonical content contract without changing public routes, sitemap behavior, or institutional pages. Legacy runtime behavior stays intact.

## Decisions

1. `posts`, `areas`, and `authors` were created as first-class Astro collections.
2. `posts` accepts a hybrid schema:
   - canonical fields are required for new content;
   - legacy fields remain readable so the current runtime can keep rendering existing posts.
3. Runtime adapters stay in [`/C:/dev/PAVIE-091025/blog/src/lib/posts.ts`](/C:/dev/PAVIE-091025/blog/src/lib/posts.ts):
   - canonical `categoryCode` is temporarily mapped back to the 5-area runtime buckets;
   - canonical `readerStage` is mapped back to the current funnel model;
   - canonical `ctaType` and `ctaTarget` are translated into the current CTA contract.
4. No public legacy post was rewritten in Sprint 1. A single draft-only canonical example validates the new schema without changing public output.
5. The 7 canonical areas now exist as structured content files, but no public route consumes them yet.
6. CMS was moved to the canonical contract for new entries. Editing old legacy posts in the CMS before migration remains a controlled risk and requires manual review.

## Why this is the minimum viable change

- It makes Sprint 2 possible without forcing route work now.
- It keeps the existing blog render path operational.
- It avoids destructive migration of published files.
- It creates an explicit seam between canonical governance and legacy runtime behavior.

## Manual review flags

- `CAT-07` has no dedicated runtime bucket yet and is temporarily mapped for compatibility only.
- Legacy areas `consumidor-saude-previdencia` and `compliance-integridade-atuacao-empresarial` still require manual triage before canonical migration.
- Author and area content remain internal baseline artifacts until routed and reviewed.
