# Changelog (pt-BR)

Todas as mudancas relevantes do Auralith Stack estao documentadas neste arquivo.

## v0.1.3 - 2026-04-19

### Milestone 1 - Fundacao do CLI

- Estrutura inicial do monorepo com `packages/`, `templates/` e `docs/`.
- Implementacao do CLI `create-auralith-app` com parsing de argumentos e saida de ajuda.
- Fluxo de scaffold com copia de template e substituicao de placeholders (`__APP_NAME__`, `__PACKAGE_NAME__`).
- Automacao opcional de instalacao de dependencias e `git init` com proximos passos no final.

### Milestone 2 - Qualidade dos Templates

- Entrega dos templates `landing` e `dashboard` com convencoes compartilhadas.
- Recursos base de UX nos dois templates: tema, troca de idioma PT/EN, layout responsivo e estados de formulario.
- Convencoes da stack documentadas em `docs/conventions.md`.

### Milestone 3 - Contato + Receitas de Deploy

- Padronizacao das variaveis de ambiente de contato nos dois templates via `.env.example`.
- Estrategia de envio de contato com Supabase como primario e FormSubmit como espelho/fallback.
- Receita de GitHub Pages com `VITE_BASE_PATH` dinamico e deploy em branch `gh-pages`.
- Receita de deploy para Vercel em projetos Vite SPA.
- Validacao dos issues do milestone e smoke builds (landing + dashboard).

### Milestone 4 - Polimento + Release

- Melhorias de DX no CLI com mensagens acionaveis e dicas de recuperacao:
  - opcoes desconhecidas,
  - valores ausentes/invalidos,
  - nome de projeto invalido,
  - pasta de destino nao vazia,
  - comportamento de recuperacao para install/git.
- Expansao da documentacao de onboarding (`README.md`, `docs/getting-started.md`) com quickstart e exemplos de comando.
- Correcao do empacotamento npm do CLI publicado:
  - pacote envia apenas `dist` e `templates`,
  - resolucao de templates funciona em modo monorepo e pacote publicado.
- Adicao de `@types/node` nos templates para garantir build sem ajustes manuais.
- Validacao dogfood completa com pacote publicado (`npx create-auralith-app@0.1.3`) nos dois templates (`dev` + `build`).

### Notas de release

- Tag: `v0.1.3`
- npm: `create-auralith-app@0.1.3`
- Versoes npm deprecated: `0.1.0`, `0.1.1`, `0.1.2` (substituidas por `0.1.3`).
