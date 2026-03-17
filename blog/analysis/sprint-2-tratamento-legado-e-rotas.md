# Sprint 2 - Tratamento de Legado e Arquitetura de Rotas

## Baseline aplicada

- Fonte obrigatoria: `analysis/pre-sprint-2-acervo-audit.md`
- Fonte obrigatoria: `analysis/pre-sprint-2-cms-gap-report.md`
- Fonte obrigatoria: `analysis/pre-sprint-2-unsupported-legacy-areas.md`
- Fonte obrigatoria: `analysis/pre-sprint-2-validation.md`

## Rotas canonicas tratadas neste sprint

- `/areas/`
- `/areas/[slug]/`
- `/autor/[slug]/`
- `/blog/`
- `/blog/categoria/`
- `/blog/categoria/[category]/`
- `/blog/[slug]/`

## Regra aplicada

- Navegacao primaria, breadcrumbs, related posts, CTA editorial de descoberta e metadata passaram a operar apenas com `categoryCode` aprovado.
- Posts sem categoria canonica aprovada continuam fora de indices, categorias, areas, related posts e SEO primario.
- O artigo legado sem taxonomia aprovada pode permanecer acessivel por URL direta, mas com `noindex` e sem sinal taxonomico publico derivado de cluster legado.

## Tratamento explicito das areas legadas sem correspondencia canonica aprovada

### `consumidor-saude-previdencia`

- Status no Sprint 2: bloqueada para navegacao canonica.
- Efeito: nenhum post dessa area entra em `/areas/`, `/areas/[slug]/`, `/blog/`, `/blog/categoria/`, related posts ou breadcrumbs canonicos.
- Rota legada: pode existir apenas como ponte `noindex`, sem promocao estrutural.
- Proximo passo valido: triagem humana para reclassificar de forma extraordinaria ou arquivar.

### `compliance-integridade-atuacao-empresarial`

- Status no Sprint 2: bloqueada para navegacao canonica.
- Efeito: nenhuma superficie canonica e gerada a partir desta area.
- Rota legada: pode existir apenas como ponte `noindex`, sem promocao estrutural.
- Proximo passo valido: triagem humana para reclassificar de forma extraordinaria ou arquivar.

## Tratamento explicito da area legada com correspondencia ambigua

### `familia-sucessoes-patrimonio`

- Status no Sprint 2: sem mapeamento automatico para superficie canonica.
- Motivo: a matriz 5->7 exige individualizacao entre `CAT-01`, `CAT-02`, `CAT-03` ou `CAT-04`.
- Efeito: posts legados dessa familia nao entram em categorias/areas publicas ate receberem `categoryCode` explicito.

## Bridges mantidos

- `/blog/areas/` e `/blog/areas/[area]/`: agora funcionam apenas como superficie legada de continuidade, com `noindex` e apontamento para destinos canonicos.
- `/blog/temas/` e `/blog/temas/[tema]/`: permanecem secundarios, tambem com `noindex`.
- `/blog/sobre/`: mantida como duplicata controlada da pagina canonica de autor, com `noindex`.

## Impacto esperado para o Sprint 3

- O Sprint 3 pode tratar redirects reais ou desativacao progressiva das superfices legadas sem reabrir a discussao taxonomica.
- O Sprint 3 deve migrar ou reclassificar os posts hoje bloqueados se houver aprovacao humana de `categoryCode`.
