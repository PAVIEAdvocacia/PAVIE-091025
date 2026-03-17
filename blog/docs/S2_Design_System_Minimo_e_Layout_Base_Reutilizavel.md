# Sprint S2 — Design System Mínimo e Layout Base Reutilizável

## Objetivo

Transformar a identidade visual e a sobriedade institucional da PAVIE em tokens, shells e componentes compartilháveis, sem cair em excesso decorativo nem reconstrução estética desnecessária.

---

## Resultado esperado

Ao fim da S2, o projeto deve possuir uma espinha visual coerente e leve para sustentar home, páginas de área, páginas institucionais e artigos.

---

## Escopo obrigatório

### 1. Criar tokens visuais mínimos
Definir, em camada central:

- cores semânticas principais e auxiliares;
- tipografia/base de escala;
- spacing scale;
- radius;
- sombra;
- largura de container;
- regras mínimas de foco/hover/estado.

### 2. Criar layouts-base
No mínimo:

- `BaseLayout`
- `PageShell`
- `ArticleShell`
- `AreaShell`

### 3. Criar componentes compartilhados
No mínimo:

- `Header`
- `Footer`
- `Container`
- `SectionHeading`
- `Card`
- `PostCard`
- `AreaCard`
- `CTASection` ou equivalente
- `AuthorBlock`
- `Breadcrumbs`

### 4. Responsividade e legibilidade
Garantir:

- leitura confortável em desktop e mobile;
- espaçamento consistente;
- contraste suficiente;
- heading hierarchy clara;
- cards e botões sem ruído visual.

---

## Adaptação ao repositório real

O domínio atual já possui home e blog publicados. Portanto, esta sprint deve:

1. respeitar a ideia central já percebida na produção — sobriedade, clareza, CTA contido;
2. reduzir improvisos visuais atuais, não trocar a personalidade do projeto;
3. preparar o sistema para receber a nova taxonomia e as novas páginas, sem parecer “site novo desconectado”.

Se houver componentes úteis já existentes, **refatore antes de duplicar**.

---

## Entregáveis obrigatórios

1. arquivo central de tokens (`tokens.css`, `theme.css`, ou equivalente);
2. layouts compartilhados funcionais;
3. header e footer refatorados ou estabilizados;
4. shells de página e artigo prontos para uso;
5. pelo menos uma rota institucional e uma rota do blog usando o novo sistema visual;
6. nota curta de decisões visuais e reversibilidade.

---

## Restrições

Você **não pode**:

1. introduzir framework visual pesado sem justificativa;
2. criar múltiplas variantes arbitrárias do mesmo componente;
3. usar efeitos chamativos sem função;
4. trocar a navegação estrutural nesta sprint além do necessário para suportar o layout base;
5. congelar decisões finas de branding não documentadas.

---

## Critérios de aceite

- [ ] layouts compartilhados funcionando
- [ ] header/footer/componentes reaproveitáveis criados ou refatorados
- [ ] mobile aceitável nas rotas principais tocadas
- [ ] contraste, espaçamento e hierarquia visual melhorados
- [ ] nenhuma regressão institucional de tom ou sobriedade

---

## Prompt pronto para Codex

```text
Sprint S2. Leia AGENTS.md raiz, site/AGENTS.md, 12.03 e 13.05. Converta a identidade visual da PAVIE em um design system mínimo e reutilizável no repositório real do blog.pavieadvocacia.com.br. Crie tokens, layouts-base e componentes compartilhados suficientes para home, páginas institucionais, páginas de área e artigos. Reaproveite o que já estiver bom, refatore antes de duplicar e preserve a sobriedade institucional. Não reabra taxonomia, não invente novos blocos de marketing e não introduza dependência pesada sem justificativa clara.
```
