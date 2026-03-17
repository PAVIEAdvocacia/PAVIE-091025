# AGENTS.md — Escopo `site/`

## 1. Finalidade

Este arquivo rege a implementação e manutenção das páginas institucionais e componentes estruturais do site da PAVIE, especialmente:

- home;
- `/sobre`;
- `/areas/`;
- páginas de área;
- navegação principal;
- footer;
- schema institucional;
- componentes compartilhados de layout.

Ele complementa o `AGENTS.md` raiz e prevalece dentro deste diretório e escopo.

---

## 2. Fontes obrigatórias de leitura

Antes de editar qualquer página estratégica do site, o agente deve ler:

1. `../12.03_Design_System_Institucional_PAVIE_para_Web.md`
2. `../12.02_Arquitetura_Editorial_do_Blog_Juridico_da_PAVIE_Advocacia.md`
3. `../13.05_Politica_de_Controle_de_Qualidade_Testes_e_Validacao_de_Entregas_da_PAVIE_Advocacia.md`

E, sempre que houver copy pública sensível:

4. `../legal-copy/AGENTS.md`

---

## 3. Regras de superfície

## 3.1 Home

A home:

- apresenta proposta de valor;
- orienta leitura do visitante;
- introduz áreas canônicas;
- não funciona como catálogo exaustivo;
- não deve ser dominada por repertório biográfico.

## 3.2 `/sobre`

A página `/sobre` pode ser mais densa, mas:

- não pode competir com `/areas/`;
- não pode ampliar artificialmente o portfólio;
- não pode transformar biografia em prova de tudo.

## 3.3 `/areas/` e páginas de área

Devem usar apenas os 7 rótulos canônicos.

É vedado:

- criar cards adicionais por entusiasmo;
- mudar nomes das áreas sem documento superior;
- usar microcopy promocional agressiva.

---

## 4. Componentes compartilhados

O agente deve preferir componentes reutilizáveis para:

- hero institucional;
- card de área;
- card de post;
- CTA block;
- seção de prova/autoria;
- breadcrumb;
- shell de página.

Evitar componentes quase idênticos com pequenas variações arbitrárias.

---

## 5. Schema e metadados

O agente deve preservar ou implementar:

- metadata consistente por página;
- schema compatível com cada superfície;
- canonical correta;
- Open Graph básico;
- títulos e descrições proporcionais.

Não inflar metadata com palavras-chave repetidas.

---

## 6. Regras de navegação

A navegação principal deve ser curta e estável.

Preferir:

- poucos itens;
- nomes claros;
- lógica previsível entre desktop e mobile.

Evitar:

- menu superlotado;
- dropdowns excessivos;
- caminhos redundantes para a mesma função.

---

## 7. Regra visual

Na dúvida, usar a solução mais limpa e reversível.

Evitar:

- hero ilustrado sem necessidade;
- excesso de cor de acento;
- badges decorativos;
- grids ruidosos;
- múltiplos estilos de botão.

---

## 8. Condições de parada

Parar e sinalizar lacuna se faltar:

- texto canônico para superfície institucional sensível;
- decisão de navegação estrutural controversa;
- regra pública consolidada de privacidade/contratação.

---

## 9. Critério de aceite

Uma alteração em `site/` só deve ser considerada boa quando:

1. melhora ou preserva a clareza institucional;
2. não rompe a matriz pública;
3. reduz ou preserva complexidade;
4. não amplia indevidamente o portfólio;
5. funciona bem em mobile.
