interface PageHeaderProps {
  title: string;
  description?: string;
}

/** Branded page title with indigo accent bar. */
export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="page-header mb-8">
      <div className="brand-page-accent mb-3" aria-hidden />
      <h1 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">{title}</h1>
      {description && (
        <p className="text-secondary-text mt-2 max-w-2xl leading-relaxed">{description}</p>
      )}
    </div>
  );
}
