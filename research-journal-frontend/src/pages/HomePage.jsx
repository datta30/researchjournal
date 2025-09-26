import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Streamlined Submissions',
    description: 'Upload and manage manuscripts with version tracking, reviewer feedback, and revision workflows.',
    accent: 'bg-primary/10 text-primary'
  },
  {
    title: 'Collaborative Reviews',
    description: 'Editors can assign reviewers, monitor plagiarism checks, and communicate decisions effortlessly.',
    accent: 'bg-secondary/10 text-secondary'
  },
  {
    title: 'Transparent Publishing',
    description: 'Publish accepted research with searchable filters so your community can discover new knowledge faster.',
    accent: 'bg-accent/10 text-accent'
  }
];

const HomePage = () => (
  <section className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div className="space-y-6">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          Research Journal Management
        </span>
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Coordinate submissions, reviews, and publication in one intuitive workspace.
        </h1>
        <p className="text-lg text-slate-600">
          Empower authors, editors, reviewers, and administrators with tailored dashboards, insightful analytics, and secure
          access controls. Stay focused on advancing research—not paperwork.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/signup"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            Get Started
          </Link>
          <Link
            to="/published"
            className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
          >
            Explore Published Papers
          </Link>
        </div>
      </div>
      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
            <span className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${feature.accent}`}>
              {feature.title}
            </span>
            <p className="text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
      <h2 className="text-2xl font-semibold text-slate-900">Why teams choose Research Journal</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-4xl font-semibold text-primary">4</p>
          <p className="mt-1 text-sm text-slate-500">Role-specific workspaces to maintain focus and clarity.</p>
        </div>
        <div>
          <p className="text-4xl font-semibold text-secondary">20MB</p>
          <p className="mt-1 text-sm text-slate-500">Secure PDF uploads with version history and audit trails.</p>
        </div>
        <div>
          <p className="text-4xl font-semibold text-accent">100%</p>
          <p className="mt-1 text-sm text-slate-500">Built with modern tooling—React 18 and Spring Boot 3.</p>
        </div>
      </div>
    </div>
  </section>
);

export default HomePage;
