import { LogOut, Settings, User } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AvatarUsuario } from '@/components/avatar-usuario'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCurrentUser } from '@/lib/api/queries'
import { signOut, useAuthSession } from '@/lib/auth/session'

type ProfileMenuProps = {
  profileTo?: string
  // items placed above the profile link, e.g. "Voltar ao app" in admin
  extraItems?: ReactNode
  className?: string
}

export function ProfileMenu({
  profileTo = '/app/perfil',
  extraItems,
  className,
}: ProfileMenuProps) {
  const navigate = useNavigate()
  const { data: currentUser } = useCurrentUser()
  // session is available at once; /me can lag behind on first paint
  const { data: session } = useAuthSession()

  async function handleLogout() {
    await signOut()
    navigate('/sign-in', { replace: true })
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Menu do perfil"
              className={className}
            >
              <AvatarUsuario usuario={currentUser} className="size-8" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Perfil</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate">
            {currentUser?.name ?? session?.user.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {currentUser?.email ?? session?.user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {extraItems}
        <DropdownMenuItem asChild>
          <Link to={profileTo}>
            <User className="size-4" />
            Meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings className="size-4" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => {
            void handleLogout()
          }}
        >
          <LogOut className="size-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
