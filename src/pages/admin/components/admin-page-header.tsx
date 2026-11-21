type AdminPageHeaderProps = {
  title: string
  description: string
}

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <header>
      <h1 className="text-tg-brand-text text-2xl font-bold md:text-3xl">
        {title}
      </h1>
      <p className="text-tg-brand-text font-medium">{description}</p>
    </header>
  )
}
