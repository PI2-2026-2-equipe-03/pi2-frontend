type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={className}>
      Ta<span className="text-brand-yellow">G</span>ravado
    </span>
  )
}
