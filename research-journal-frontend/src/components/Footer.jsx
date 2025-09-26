const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-slate-500 sm:flex-row">
      <p>&copy; {new Date().getFullYear()} Research Journal Management. All rights reserved.</p>
      <div className="flex gap-4">
        <a href="https://example.com/privacy" target="_blank" rel="noreferrer" className="hover:text-primary">
          Privacy
        </a>
        <a href="https://example.com/terms" target="_blank" rel="noreferrer" className="hover:text-primary">
          Terms
        </a>
        <a href="mailto:support@example.com" className="hover:text-primary">
          Support
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
