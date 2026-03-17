# Sprint 1 - Pontos de Quebra Potencial

## Compatibilidade de CMS

O CMS agora foi configurado para o modelo canonico. Se um post legado for aberto e salvo no CMS antes de ser migrado, campos antigos fora do novo formulario podem exigir revisao manual.

## Compatibilidade de taxonomia

O runtime ainda agrupa categorias canonicas em buckets legados. Isso preserva rotas atuais, mas mascara a granularidade final ate o Sprint 2.

## Areas sem destino canonico direto

Os buckets legados `consumidor-saude-previdencia` e `compliance-integridade-atuacao-empresarial` nao possuem destino automatico no modelo de 7 categorias.

## Autor e areas

As collections `authors` e `areas` ja existem, mas ainda nao possuem rotas publicas dedicadas. Qualquer consumo publico delas deve esperar o Sprint 2.
