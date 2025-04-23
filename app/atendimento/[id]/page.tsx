"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, ChevronLeft } from "lucide-react"
import { getServiceById } from "@/lib/services"

export default function AtendimentoDetalhes() {
  const params = useParams()
  const id = params.id as string
  const [atendimento, setAtendimento] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServiceDetails = async () => {
      setLoading(true)
      try {
        const service = await getServiceById(id)

        if (service) {
          // Formatar os dados do serviço para o formato esperado pelo componente
          const formattedService = {
            id: service.id,
            name: service.provider?.organization_name || "Clínica",
            specialty: service.specialty,
            description: service.description || "Sem descrição disponível.",
            address: `${service.provider?.address || ""}, ${service.provider?.city || ""}, ${service.provider?.state || ""}`,
            distance: "2,3 km", // Simulado
            coordinates: {
              lat: service.provider?.latitude || -23.55052,
              lng: service.provider?.longitude || -46.633308,
            },
            rating: service.provider?.rating || 4.5,
            reviews: service.provider?.reviews || 0,
            phone: service.provider?.phone || "(11) 3456-7890",
            email: service.provider?.email || "contato@clinica.org",
            website: service.provider?.website || "www.clinica.org",
            openingHours: [
              { day: "Segunda a Sexta", hours: "08:00 - 18:00" },
              { day: "Sábado e Domingo", hours: "Fechado" },
            ],
            availableSlots:
              service.slots?.map((slot: any) => ({
                date: new Date(slot.date).toLocaleDateString("pt-BR"),
                time: slot.time,
                duration: `${slot.duration} min`,
                cost: slot.cost || service.cost,
              })) || [],
            services: [service.name],
            requirements: service.requirements
              ? service.requirements.split(",").map((req: string) => req.trim())
              : ["Documento de identidade com foto", "Cartão do SUS (se tiver)"],
          }

          setAtendimento(formattedService)
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes do serviço:", error)
      } finally {
        setLoading(false)
      }
    }

    loadServiceDetails()
  }, [id])

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
              {atendimento.availableSlots.length > 0 ? (
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
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Não há horários disponíveis para este atendimento.</p>
                </div>
              )}
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
