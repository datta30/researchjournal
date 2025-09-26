const Sidebar = ({ sections, onSelect, active }) => (
  <aside className="w-full max-w-xs border-r border-slate-200 bg-white">
    <div className="sticky top-24 space-y-2 p-6">
      {sections.map((section) => (
        <button
          key={section.key}
          type="button"
          onClick={() => onSelect(section.key)}
          className={`block w-full rounded-lg px-4 py-2 text-left text-sm font-semibold transition ${
            active === section.key ? 'bg-primary text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {section.icon ? <section.icon className="mr-2 inline h-4 w-4" /> : null}
          {section.label}
        </button>
      ))}
    </div>
  </aside>
);

export default Sidebar;
