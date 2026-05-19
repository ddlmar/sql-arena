import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Sobre</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Domine a Linguagem de Consulta com o SQL Arena.
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">
          O SQL Arena é um ambiente de aprendizado e treinamento prático para comandos SQL. Aqui
          você pode testar suas habilidades em tempo real, resolvendo desafios de filtragem, junção,
          ordenação e agrupamento sobre um banco de dados relacional simulado! Acompanhe seus
          pontos, crie combos de acertos e se torne um mestre das consultas relacionais.
        </p>
      </section>
    </main>
  );
}
