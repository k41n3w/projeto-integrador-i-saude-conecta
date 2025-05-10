"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, User, LogOut, ChevronDown, Database } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // Verificar se o usuário é administrador (para fins de demonstração, usamos o email)
  const isAdmin = user?.email === "admin@example.com"

  return (
    <header className="border-b w-full">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="truncate">SaúdeConecta</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/#features" className="text-sm font-medium hover:underline underline-offset-4">
            Recursos
          </Link>
          <Link href="/#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
            Como Funciona
          </Link>
          <Link href="/#providers" className="text-sm font-medium hover:underline underline-offset-4">
            Para Profissionais
          </Link>
          <Link href="/search" className="text-sm font-medium hover:underline underline-offset-4">
            Encontrar Atendimento
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user.name.split(" ")[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={user.type === "provider" ? `/providers/profile` : "/patient/dashboard"}>Meu Perfil</Link>
                </DropdownMenuItem>
                {user.type === "provider" && (
                  <DropdownMenuItem asChild>
                    <Link href="/providers/profile">Gerenciar Serviços</Link>
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Administração</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/database">
                        <Database className="h-4 w-4 mr-2" />
                        Configurar Banco de Dados
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
