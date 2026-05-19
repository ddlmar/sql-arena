export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-(--line) px-4 pb-14 pt-10 text-(--sea-ink-soft)">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">&copy; {year} SQL Arena. Todos os direitos reservados.</p>
        <p className="island-kicker m-0">
          <a
            href="https://github.com/ddlmar/sql-arena"
            target="_blank"
            rel="noreferrer"
            className="no-underline text-(--sea-ink-soft) hover:text-(--hover-text)"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
