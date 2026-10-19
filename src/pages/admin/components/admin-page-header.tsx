type AdminPageHeaderProps = {
  title: string
  description: string
}

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <header>
      {/* o azul da marca some sobre o fundo escuro, então o dark usa o texto do tema */}
      <h1 className="text-tg-brand-blue dark:text-foreground text-2xl font-bold md:text-3xl">
        {title}
      </h1>
      <p className="text-tg-brand-blue dark:text-muted-foreground font-medium">
        {description}
      </p>
    </header>
  )
}
