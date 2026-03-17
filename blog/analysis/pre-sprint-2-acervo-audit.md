# Pre-Sprint 2 - Auditoria do Acervo Atual

## Resumo

- Arquivos auditados: 4
- Compatíveis com o contrato canônico/CMS novo: 1
- Incompatíveis com o CMS novo: 3
- Áreas legadas sem correspondência canônica aprovada presentes no acervo: 1

## Resultado por arquivo

| Arquivo | Modelo | Área legada | Correspondência canônica | CMS novo | Observação |
|---|---|---|---|---|---|
| [2026-03-09-divorcio-cartorio-filhos-menores.md](/C:/dev/PAVIE-091025/blog/src/content/blog/2026-03-09-divorcio-cartorio-filhos-menores.md) | legacy | familia-sucessoes-patrimonio | CAT-01, CAT-02, CAT-03, CAT-04 | incompatível | faltam 11 campos canônicos obrigatórios |
| [2026-03-11-como-ler-a-matricula-do-imovel.md](/C:/dev/PAVIE-091025/blog/src/content/blog/2026-03-11-como-ler-a-matricula-do-imovel.md) | legacy | imobiliario-regularizacao-condominios | CAT-05 | incompatível | faltam 11 campos canônicos obrigatórios |
| [2026-03-11-negativa-de-cobertura-plano-de-saude.md](/C:/dev/PAVIE-091025/blog/src/content/blog/2026-03-11-negativa-de-cobertura-plano-de-saude.md) | legacy | consumidor-saude-previdencia | sem aprovação | incompatível | faltam 11 campos canônicos obrigatórios |
| [2026-03-17-modelo-post-canonico.md](/C:/dev/PAVIE-091025/blog/src/content/blog/2026-03-17-modelo-post-canonico.md) | canonical | - | sem aprovação | compatível | apto para edição no CMS novo |

## Observações de hardening

- Posts com sinais canônicos já entram no repositório, mas não devem sair para a superfície pública legada antes do Sprint 2.
- O acervo legado continua validando por compatibilidade estrutural, sem ser considerado compatível com o CMS canônico.
- As áreas legadas sem correspondência aprovada seguem exigindo triagem humana antes de qualquer migração.
