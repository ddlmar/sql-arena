# SQL Arena - SKILLS & Padrões do Projeto ⚔️

Este documento descreve a arquitetura, a finalidade de cada pasta, as convenções de estruturação de código e as melhores práticas adotadas na **SQL Arena** para garantir consistência, legibilidade e manutenibilidade.

---

## 📁 Estrutura de Diretórios

A estrutura de arquivos do projeto é modular e segue o fluxo de dados em uma aplicação full-stack moderna:

```
sql-exercises/
├── public/                 # Assets públicos estáticos (ex. favicon, robots)
├── src/
│   ├── components/         # Componentes React reutilizáveis e isolados
│   ├── data/               # Banco de dados em memória, esquemas e exercícios
│   ├── store/              # Gerenciadores de estado global (Zustand)
│   ├── routes/             # Páginas e layouts estruturados pelo TanStack Router
│   ├── mocks/              # Mock fallbacks para compatibilidade de SSR/Bundler
│   ├── router.tsx          # Configuração básica do TanStack Router
│   ├── routeTree.gen.ts    # Rotas auto-geradas (não modificar manualmente)
│   └── styles.css          # Design System e variáveis CSS globais
├── eslint.config.js        # Regras de qualidade de código (ESLint Flat Config)
├── .prettierrc             # Padronização de formatação
├── tsconfig.json           # Definição e restrições do TypeScript + Aliases
└── vite.config.ts          # Configurações do Vite, SSR, Aliases e Plugins
```

---

## 🧭 Mapeamento e Responsabilidade das Pastas

### 1. `src/components/`

**Objetivo**: Alojar componentes de UI modulares, puros (sempre que possível) e com escopo único.

- **Padrões de Código**:
  - Sempre use importações com alias `@/` em vez de caminhos relativos (ex. `import TableViewer from '@/components/TableViewer'`).
  - Mantenha os componentes focados: um componente deve fazer apenas uma coisa (ex: `SqlEditor` cuida apenas do input de texto e números de linha).
  - Evite efeitos colaterais locais se os estados puderem ser centralizados ou gerenciados pela Store Global.

### 2. `src/data/`

**Objetivo**: Lógica de banco de dados, motor de execução SQL (AlaSQL) e arquivos de dados estáticos.

- **Padrões de Código**:
  - `dbEngine.ts`: Centraliza a inicialização, execução de consultas e grading inteligente dos resultados. Quaisquer alterações em comportamento de query devem ser feitas apenas aqui.
  - `questions.ts`: Contém o gabarito das questões. Mantenha os schemas e objetos de exercícios estruturados usando interfaces TypeScript estritas (`Question`, `TableSchema`).

### 3. `src/store/`

**Objetivo**: Gerenciamento de estado global centralizado usando **Zustand**.

- **Padrões de Código**:
  - Mantenha um único arquivo de estado principal (`gameStore.ts`) para evitar a complexidade de múltiplos contextos.
  - A store deve conter tanto o **estado reativo** quanto as **ações** que o modificam (encapsulamento).
  - Utilize o `localStorage` para persistir recordes de maior pontuação (`highScore`).

### 4. `src/routes/`

**Objetivo**: Roteamento baseado em arquivos gerenciado pelo **TanStack Router**.

- **Padrões de Código**:
  - `__root.tsx` serve como layout global (Header + Conteúdo + Footer).
  - `index.tsx` atua como a página de entrada e deve apenas orquestrar os componentes secundários da UI, injetando os dados provenientes da Store.

---

## 🎨 Padrões de Estilização e Tailwind CSS v4

Para garantir que a interface seja altamente premium e livre de alertas do compilador de CSS, siga estes padrões:

1.  **Sintaxe de Variáveis no Tailwind**:
    - **Proibido**: Usar a sintaxe arbitrária antiga `border-[var(--line)]`.
    - **Obrigatório**: Usar a sintaxe simplificada do Tailwind v4: `border-(--line)`, `bg-(--chip-bg)`, `text-(--sea-ink)`.
2.  **Paleta Harmoniosa**:
    - Utilize as variáveis CSS semânticas definidas no `src/styles.css` (`--sea-ink`, `--lagoon`, `--lagoon-deep`, `--line`, etc.) para suporte automático a temas.

---

## 🤖 Padrões de Código Limpo (Clean Code)

- **TypeScript Estrito**: Nunca utilize `any` se for possível inferir ou criar uma interface adequada. Use `import type` para importar interfaces que são apagadas no build.
- **Sem Comentários Redundantes**: Escreva código autoexplicativo usando nomes descritivos para variáveis e funções. Comentários devem explicar o _porquê_, nunca o _o quê_ o código está fazendo.
- **Importações Limpas**: Use a convenção `@/*` configurada tanto no `tsconfig.json` quanto no `vite.config.ts`.

---

## ⚙️ Scripts Úteis de Verificação

Configure e execute estes comandos no terminal para garantir a consistência do código antes de realizar commits:

- **Formatação automática**:
  ```bash
  pnpm format
  ```
- **Validação de regras (Linter)**:
  ```bash
  pnpm lint
  ```
- **Checagem estrita de tipos**:
  ```bash
  pnpm typecheck
  ```
- **Compilação de produção (Validação de Build)**:
  ```bash
  pnpm build
  ```
