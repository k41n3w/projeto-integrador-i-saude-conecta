"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, ChevronLeft } from "lucide-react"

// Dados de exemplo para um atendimento específico
const atendimentoData = {
  1: {
    id: 1,
    name: "Clínica Comunitária de Saúde",
    specialty: "Clínica Geral",
    description:
      "A Clínica Comunitária de Saúde oferece atendimento médico gratuito para a comunidade local. Nossa equipe de profissionais dedicados está comprometida em fornecer cuidados de saúde de qualidade para todos.",
    address: "Rua Principal, 123, São Paulo, SP",
    distance: "2,3 km",
    coordinates: {
      lat: -23.55052,
      lng: -46.633308,
    },
    rating: 4.8,
    reviews: 124,
    phone: "(11) 3456-7890",
    email: "contato@clinicacomunitaria.org",
    website: "www.clinicacomunitaria.org",
    openingHours: [
      { day: "Segunda-feira", hours: "08:00 - 18:00" },
      { day: "Terça-feira", hours: "08:00 - 18:00" },
      { day: "Quarta-feira", hours: "08:00 - 18:00" },
      { day: "Quinta-feira", hours: "08:00 - 18:00" },
      { day: "Sexta-feira", hours: "08:00 - 18:00" },
      { day: "Sábado", hours: "08:00 - 12:00" },
      { day: "Domingo", hours: "Fechado" },
    ],
    availableSlots: [
      { date: "Amanhã", time: "10:00", duration: "30 min", cost: "Gratuito" },
      { date: "Amanhã", time: "11:00", duration: "30 min", cost: "Gratuito" },
      { date: "15/05/2023", time: "14:30", duration: "45 min", cost: "Gratuito" },
      { date: "16/05/2023", time: "09:00", duration: "30 min", cost: "Gratuito" },
    ],
    services: [
      "Consultas médicas gerais",
      "Exames básicos",
      "Vacinação",
      "Acompanhamento de doenças crônicas",
      "Orientação de saúde",
    ],
    requirements: [
      "Documento de identidade com foto",
      "Cartão do SUS (se tiver)",
      "Comprovante de residência",
      "Receitas médicas anteriores (se aplicável)",
    ],
  },
  2: {
    id: 2,
    name: "Centro Médico do Bairro",
    specialty: "Pediatria",
    description:
      "O Centro Médico do Bairro é especializado em atendimento pediátrico de qualidade. Oferecemos consultas a preços acessíveis para garantir que todas as crianças tenham acesso aos cuidados de saúde necessários.",
    address: "Av. das Flores, 456, São Paulo, SP",
    distance: "3,5 km",
    coordinates: {
      lat: -23.55782,
      lng: -46.639847,
    },
    rating: 4.6,
    reviews: 98,
    phone: "(11) 2345-6789",
    email: "contato@centromedicobairro.org",
    website: "www.centromedicobairro.org",
    openingHours: [
      { day: "Segunda-feira", hours: "08:00 - 17:00" },
      { day: "Terça-feira", hours: "08:00 - 17:00" },
      { day: "Quarta-feira", hours: "08:00 - 17:00" },
      { day: "Quinta-feira", hours: "08:00 - 17:00" },
      { day: "Sexta-feira", hours: "08:00 - 17:00" },
      { day: "Sábado", hours: "09:00 - 12:00" },
      { day: "Domingo", hours: "Fechado" },
    ],
    availableSlots: [
      { date: "Hoje", time: "14:30", duration: "30 min", cost: "R$ 20" },
      { date: "Amanhã", time: "09:15", duration: "30 min", cost: "R$ 20" },
      { date: "Amanhã", time: "10:45", duration: "30 min", cost: "R$ 20" },
      { date: "17/05/2023", time: "11:30", duration: "60 min", cost: "R$ 25" },
    ],
    services: [
      "Consultas pediátricas",
      "Acompanhamento do desenvolvimento infantil",
      "Vacinação infantil",
      "Tratamento de doenças comuns da infância",
      "Orientação aos pais",
    ],
    requirements: [
      "Documento de identidade da criança (certidão de nascimento)",
      "Documento de identidade do responsável",
      "Cartão de vacinação",
      "Cartão do SUS (se tiver)",
    ],
  },
  3: {
    id: 3,
    name: "Clínica Bem-Estar",
    specialty: "Medicina Familiar",
    description:
      "A Clínica Bem-Estar oferece atendimento médico familiar a preços acessíveis. Nossa abordagem integrada cuida da saúde de toda a família, desde crianças até idosos.",
    address: "Rua dos Pinheiros, 789, São Paulo, SP",
    distance: "5,1 km",
    coordinates: {
      lat: -23.56637,
      lng: -46.64202,
    },
    rating: 4.7,
    reviews: 112,
    phone: "(11) 3456-7891",
    email: "contato@clinicabemestar.org",
    website: "www.clinicabemestar.org",
    openingHours: [
      { day: "Segunda-feira", hours: "09:00 - 18:00" },
      { day: "Terça-feira", hours: "09:00 - 18:00" },
      { day: "Quarta-feira", hours: "09:00 - 18:00" },
      { day: "Quinta-feira", hours: "09:00 - 18:00" },
      { day: "Sexta-feira", hours: "09:00 - 18:00" },
      { day: "Sábado", hours: "09:00 - 13:00" },
      { day: "Domingo", hours: "Fechado" },
    ],
    availableSlots: [
      { date: "Quinta-feira", time: "09:15", duration: "45 min", cost: "R$ 15" },
      { date: "Quinta-feira", time: "14:00", duration: "45 min", cost: "R$ 15" },
      { date: "Sexta-feira", time: "10:30", duration: "45 min", cost: "R$ 15" },
      { date: "18/05/2023", time: "16:15", duration: "45 min", cost: "R$ 15" },
    ],
    services: [
      "Medicina familiar",
      "Consultas para todas as idades",
      "Acompanhamento de doenças crônicas",
      "Prevenção e promoção da saúde",
      "Orientação nutricional",
    ],
    requirements: [
      "Documento de identidade com foto",
      "Cartão do SUS (se tiver)",
      "Comprovante de residência",
      "Histórico médico (se disponível)",
    ],
  },
  4: {
    id: 4,
    name: "Parceiros de Saúde Acessível",
    specialty: "Medicina Interna",
    description:
      "Parceiros de Saúde Acessível é uma organização sem fins lucrativos que oferece atendimento médico gratuito para pessoas de baixa renda. Nosso foco é medicina interna e cuidados preventivos.",
    address: "Rua das Oliveiras, 321, São Paulo, SP",
    distance: "4,2 km",
    coordinates: {
      lat: -23.55343,
      lng: -46.65289,
    },
    rating: 4.5,
    reviews: 87,
    phone: "(11) 2345-6780",
    email: "contato@parceirossaude.org",
    website: "www.parceirossaude.org",
    openingHours: [
      { day: "Segunda-feira", hours: "08:30 - 17:30" },
      { day: "Terça-feira", hours: "08:30 - 17:30" },
      { day: "Quarta-feira", hours: "08:30 - 17:30" },
      { day: "Quinta-feira", hours: "08:30 - 17:30" },
      { day: "Sexta-feira", hours: "08:30 - 17:30" },
      { day: "Sábado", hours: "Fechado" },
      { day: "Domingo", hours: "Fechado" },
    ],
    availableSlots: [
      { date: "Sexta-feira", time: "11:30", duration: "30 min", cost: "Gratuito" },
      { date: "Sexta-feira", time: "14:00", duration: "30 min", cost: "Gratuito" },
      { date: "Segunda-feira", time: "09:30", duration: "30 min", cost: "Gratuito" },
      { date: "Segunda-feira", time: "15:45", duration: "30 min", cost: "Gratuito" },
    ],
    services: [
      "Medicina interna",
      "Exames preventivos",
      "Gerenciamento de doenças crônicas",
      "Aconselhamento de saúde",
      "Encaminhamentos para especialistas",
    ],
    requirements: [
      "Documento de identidade com foto",
      "Comprovante de renda (para atendimento gratuito)",
      "Cartão do SUS",
      "Comprovante de residência",
    ],
  },
}

export default function AtendimentoDetalhes() {
  const params = useParams()
  const id = params.id
  const [atendimento, setAtendimento] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulando um carregamento de dados
    setTimeout(() => {
      // Primeiro, verificar se o atendimento existe nos dados estáticos
      const staticAtendimento = atendimentoData[id as keyof typeof atendimentoData]

      // Se não existir nos dados estáticos, verificar nos serviços adicionados pelo usuário
      if (!staticAtendimento && typeof window !== "undefined" && window.globalServices) {
        const customService = window.globalServices.find((service: any) => service.id.toString() === id)

        if (customService) {
          // Formatar o serviço personalizado para corresponder à estrutura esperada
          const formattedService = {
            id: customService.id,
            name: customService.name,
            specialty: customService.specialty,
            description: customService.description || "Sem descrição disponível.",
            address: `${customService.address}, ${customService.city}, ${customService.state}`,
            distance: customService.distance || "2,3 km",
            coordinates: customService.coordinates || {
              lat: -23.55052,
              lng: -46.633308,
            },
            rating: customService.rating || 4.5,
            reviews: customService.reviews || 0,
            phone: customService.phone || "(11) 3456-7890",
            email: customService.email || "contato@clinica.org",
            website: customService.website || "www.clinica.org",
            openingHours: customService.openingHours || [
              { day: "Segunda a Sexta", hours: "08:00 - 18:00" },
              { day: "Sábado e Domingo", hours: "Fechado" },
            ],
            availableSlots: customService.slots.map((slot: any) => ({
              date: formatDate(slot.date),
              time: slot.time,
              duration: `${slot.duration} min`,
              cost: slot.cost || "Gratuito",
            })),
            services: [customService.name],
            requirements: customService.requirements
              ? customService.requirements.split(",").map((req: string) => req.trim())
              : ["Documento de identidade com foto", "Cartão do SUS (se tiver)"],
          }

          setAtendimento(formattedService)
        }
      } else {
        setAtendimento(staticAtendimento)
      }

      setLoading(false)
    }, 500)
  }, [id])

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    if (!dateString) return "Data não disponível"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando informações do atendimento...</p>
        </div>
      </div>
    )
  }

  if (!atendimento) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Atendimento não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            O atendimento que você está procurando não existe ou foi removido.
          </p>
          <Link href="/search">
            <Button>Voltar para a busca</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/search" className="inline-flex items-center text-primary hover:underline mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para resultados
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{atendimento.name}</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre este atendimento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{atendimento.description}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-2">Serviços oferecidos</h3>
                  <ul className="space-y-1">
                    {atendimento.services.map((service: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">O que levar</h3>
                  <ul className="space-y-1">
                    {atendimento.requirements.map((requirement: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horários Disponíveis</CardTitle>
              <CardDescription>Vagas disponíveis para atendimento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {atendimento.availableSlots.map((slot: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="font-medium">{slot.date}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {slot.time} • {slot.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`px-2 py-1 rounded-full text-sm ${slot.cost === "Gratuito" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary-foreground"}`}
                      >
                        {slot.cost}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p>{atendimento.address}</p>
                    <p className="text-sm text-muted-foreground">{atendimento.distance} de distância</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Especialidade</span>
                  <span className="font-medium">{atendimento.specialty}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Próxima vaga</span>
                  <span className="font-medium">
                    {atendimento.availableSlots[0]?.date}, {atendimento.availableSlots[0]?.time}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Custo</span>
                  <span className="font-medium">{atendimento.availableSlots[0]?.cost}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duração</span>
                  <span className="font-medium">{atendimento.availableSlots[0]?.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
