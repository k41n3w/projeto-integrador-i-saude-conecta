import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Search } from "lucide-react"
import HospitalAnimation from "@/components/hospital-animation"

export default function Home() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Saúde Acessível Para Todos
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Conecte-se com serviços médicos gratuitos e de baixo custo na sua região. Encontre o atendimento que
                  você precisa, quando precisar.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/search">
                  <Button className="gap-1.5">
                    Encontrar Atendimento
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/providers/register">
                  <Button variant="outline">Para Profissionais de Saúde</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center w-full">
              <div className="w-full max-w-[550px] mx-auto">
                <HospitalAnimation />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Recursos
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Conectando Pacientes com Atendimento Acessível
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nossa plataforma facilita encontrar serviços médicos gratuitos ou de baixo custo na sua região.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4 rounded-lg border p-6">
              <Search className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Encontre Atendimento</h3>
                <p className="text-muted-foreground">
                  Busque serviços de saúde por cidade e especialidade disponíveis para você.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 rounded-lg border p-6">
              <Calendar className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Visualize Disponibilidade</h3>
                <p className="text-muted-foreground">
                  Veja os horários disponíveis oferecidos pelas clínicas e profissionais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Como Funciona
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Processo Simples, Melhor Acesso</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nossa plataforma foi projetada para ser simples e acessível para todos.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Crie uma Conta</h3>
                <p className="text-muted-foreground">As clinicas postam as vagas gratuitas e os detalhes pertinentes</p>
              </div>
              <div className="space-y-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Visualize ou Publique Vagas</h3>
                <p className="text-muted-foreground">O pacientes pode visualizar vagas disponíveis.</p>
              </div>
              <div className="space-y-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Encontre o Atendimento Ideal</h3>
                <p className="text-muted-foreground">
                  Sabendo onde tem vaga o paciente pode se inscrever para vagas gratuitas
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/placeholder.svg?height=400&width=400"
                width={400}
                height={400}
                alt="Ilustração do processo passo a passo"
                className="rounded-lg object-cover max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="providers" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex items-center justify-center">
              <img
                src="/placeholder.svg?height=400&width=400"
                width={400}
                height={400}
                alt="Profissional de saúde usando um tablet"
                className="rounded-lg object-cover max-w-full h-auto"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Para Profissionais
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Junte-se à Nossa Rede</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Ajude a reduzir a desigualdade no acesso à saúde oferecendo seus serviços para quem mais precisa.
                </p>
              </div>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                    ✓
                  </div>
                  <span>Liste consultas disponíveis para atendimento gratuito ou de baixo custo</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                    ✓
                  </div>
                  <span>Gerencie sua agenda e disponibilidade</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                    ✓
                  </div>
                  <span>Conecte-se com pacientes que precisam dos seus serviços</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                    ✓
                  </div>
                  <span>Acompanhe seu impacto na comunidade</span>
                </li>
              </ul>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/providers/register">
                  <Button className="gap-1.5">
                    Cadastrar como Profissional
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/providers/learn-more">
                  <Button variant="outline">Saiba Mais</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Pronto para Começar?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Junte-se a milhares de pacientes e profissionais que já usam nossa plataforma.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-1.5">
                  Cadastre-se Agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" size="lg">
                  Explorar Atendimentos Disponíveis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
