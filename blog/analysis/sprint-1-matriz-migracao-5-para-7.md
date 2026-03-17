# Sprint 1 - Matriz de Migracao 5 Areas -> 7 Categorias

## Regra de uso

Esta matriz governa a migracao sem alterar rotas publicas no Sprint 1. Ela serve para classificacao, triagem e preparo do Sprint 2.

| Runtime legado (5 areas) | Destino canonico | Regra de migracao | Estado |
|---|---|---|---|
| `familia-sucessoes-patrimonio` | `CAT-01`, `CAT-02`, `CAT-03`, `CAT-04` | Separar por natureza do caso: sucessoes/inventarios, planejamento, dissolucoes familiares ou internacional/documental. | exige triagem fina |
| `contratos-obrigacoes-responsabilidade-civil` | `CAT-06` | Migrar quando o texto reforcar cobranca, execucao, contratos ou recuperacao de credito seletiva. | migracao direta |
| `imobiliario-regularizacao-condominios` | `CAT-05` | Migrar para imoveis, registro, regularizacoes e litigios patrimoniais. | migracao direta |
| `consumidor-saude-previdencia` | sem destino direto | Nao existe categoria canonica equivalente. Exige decisao manual: reclassificar, fundir, arquivar ou manter fora do novo modelo. | bloqueio formal |
| `compliance-integridade-atuacao-empresarial` | sem destino direto | Nao existe categoria canonica equivalente. Exige decisao manual: reclassificar, fundir, arquivar ou manter fora do novo modelo. | bloqueio formal |

## Compatibilidade temporaria no runtime atual

| Categoria canonica | Bucket temporario no runtime atual |
|---|---|
| `CAT-01` | `familia-sucessoes-patrimonio` |
| `CAT-02` | `familia-sucessoes-patrimonio` |
| `CAT-03` | `familia-sucessoes-patrimonio` |
| `CAT-04` | `familia-sucessoes-patrimonio` |
| `CAT-05` | `imobiliario-regularizacao-condominios` |
| `CAT-06` | `contratos-obrigacoes-responsabilidade-civil` |
| `CAT-07` | `familia-sucessoes-patrimonio` |

## Observacoes obrigatorias

- `CAT-07` usa mapeamento temporario apenas para nao quebrar o runtime de 5 areas. Isso nao define arquitetura final.
- Nenhuma categoria canonica nova pode abrir rota publica nesta sprint.
- Nenhum conteudo legado fora da matriz direta pode ser salvo como migrado sem triagem humana.
