import Link from "next/link"
import { Calendar } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t w-full">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12 mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Calendar className="h-6 w-6 text-primary" />
            <span>SaúdeConecta</span>
          </Link>
          <p className="text-sm text-muted-foreground">Conectando pacientes com saúde acessível desde 2023.</p>
        </div>
        <nav className="grid grid-cols-2 gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Plataforma</h3>
            <Link href="/#features" className="text-sm text-muted-foreground hover:underline">
              Recursos
            </Link>
            <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:underline">
              Como Funciona
            </Link>
            <Link href="/#providers" className="text-sm text-muted-foreground hover:underline">
              Para Profissionais
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Contato</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              suporte@saudeconecta.org
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              (11) 3456-7890
            </Link>
          </div>
        </nav>
      </div>
      <div className="border-t py-6 w-full">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © Projeto Integrador I - SaúdeConecta. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
