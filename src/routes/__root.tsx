import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { validationErrors } from '@/data/validation-errors';

import appCss from '../styles.css?url';

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

const typedErrors = validationErrors;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'SQL Arena',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-[#0a1012] text-slate-100 font-sans">
        <div className="rounded-full bg-rose-500/10 p-4 text-rose-500 border border-rose-500/20 mb-6 shadow-md">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-rose-500 mb-2">Página Não Encontrada (404)</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Ops! O endereço acessado não existe ou a rota informada está incorreta.
        </p>
        <a
          href="/"
          className="px-6 py-3 rounded-full bg-(--lagoon-deep) text-white font-bold text-sm shadow-md hover:bg-(--lagoon) transition"
        >
          Voltar para a Arena Principal ⚔️
        </a>
      </div>
    );
  },
});

function ContentErrorScreen({
  errors,
}: {
  errors: { file: string; path: string; message: string }[];
}) {
  return (
    <div className="min-h-screen bg-[#0a1012] text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-3xl w-full bg-[#101e22]/90 border border-rose-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.12),transparent_66%)] pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.06),transparent_66%)] pointer-events-none" />

        <div className="flex items-center gap-4 mb-6 border-b border-rose-500/20 pb-5">
          <div className="rounded-full bg-rose-500/10 p-3 text-rose-500 border border-rose-500/20 animate-pulse">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-rose-500 tracking-tight">
              Erro de Validação de Conteúdo (Zod)
            </h1>
            <p className="text-xs text-rose-400/80 font-medium mt-1">
              O banco de dados relacional simulado ou os desafios JSON violam as regras do sistema.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Encontramos <strong>{errors.length} erro(s)</strong> de validação nos arquivos do
          diretório{' '}
          <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono text-xs">
            /content/
          </code>
          . A aplicação voltará a funcionar assim que os erros forem resolvidos e o comando de
          sincronização for executado.
        </p>

        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin mb-8">
          {errors.map((err, idx) => (
            <div
              key={idx}
              className="bg-rose-950/20 border border-rose-500/10 p-4 rounded-xl font-mono text-xs space-y-2"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                  Arquivo
                </span>
                <span className="text-amber-400 font-semibold">{err.file}</span>
              </div>

              {err.path && (
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px] bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                    Caminho
                  </span>
                  <span className="text-cyan-300 font-semibold">{err.path}</span>
                </div>
              )}

              <div className="pt-1.5 border-t border-rose-500/5 flex items-start gap-1.5">
                <span className="text-rose-500 shrink-0 font-bold">↳</span>
                <span className="text-rose-200 leading-relaxed font-semibold">{err.message}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-emerald-400/80 leading-relaxed text-center sm:text-left">
            <h4 className="font-bold text-emerald-400">Como resolver isso?</h4>
            <p className="mt-0.5 font-medium">
              Corrija os arquivos JSON e execute o comando abaixo no seu terminal:
            </p>
          </div>
          <div className="bg-black/50 border border-emerald-500/20 px-4 py-2.5 rounded-lg font-mono text-xs text-emerald-300 font-bold select-all cursor-pointer shadow-inner">
            pnpm sync-content
          </div>
        </div>
      </div>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const hasErrors = typedErrors.length > 0;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        {hasErrors ? (
          <ContentErrorScreen errors={typedErrors} />
        ) : (
          <>
            <Header />
            {children}
            <Footer />
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          </>
        )}
        <Scripts />
      </body>
    </html>
  );
}
