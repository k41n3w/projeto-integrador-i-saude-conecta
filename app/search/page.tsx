"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, SearchIcon, Star } from "lucide-react"

export default function SearchPage() {
  const [city, setCity] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      name: "Clínica Comunitária de Saúde",
      specialty: "Clínica Geral",
      address: "Rua Principal, 123, São Paulo, SP",
      distance: "2,3 km",
      rating: 4.8,
      nextAvailable: "Amanhã, 10:00",
      cost: "Gratuito",
    },
    {
      id: 2,
      name: "Centro Médico do Bairro",
      specialty: "Pediatria",
      address: "Av. das Flores, 456, São Paulo, SP",
      distance: "3,5 km",
      rating: 4.6,
      nextAvailable: "Hoje, 14:30",
      cost: "R$ 20",
    },
    {
      id: 3,
      name: "Clínica Bem-Estar",
      specialty: "Medicina Familiar",
      address: "Rua dos Pinheiros, 789, São Paulo, SP",
      distance: "5,1 km",
      rating: 4.7,
      nextAvailable: "Quinta-feira, 9:15",
      cost: "R$ 15",
    },
    {
      id: 4,
      name: "Parceiros de Saúde Acessível",
      specialty: "Medicina Interna",
      address: "Rua das Oliveiras, 321, São Paulo, SP",
      distance: "4,2 km",
      rating: 4.5,
      nextAvailable: "Sexta-feira, 11:30",
      cost: "Gratuito",
    },
  ])

  // Verificar se há novos serviços adicionados
  useEffect(() => {
    if (typeof window !== "undefined" && window.globalServices) {
      // Adicionar novos serviços à lista de resultados de busca
      const newServices = window.globalServices.filter(
        (service: any) => !searchResults.some((result) => result.id === service.id),
      )

      if (newServices.length > 0) {
        setSearchResults((prev) => [
          ...prev,
          ...newServices.map((service: any) => ({
            id: service.id,
            name: service.name,
            specialty: service.specialty,
            address: `${service.address}, ${service.city}, ${service.state}`,
            distance: service.distance || "2,3 km",
            rating: service.rating || 4.5,
            nextAvailable: service.nextAvailable || "Não disponível",
            cost: service.cost || "Gratuito",
          })),
        ])
      }
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Em uma aplicação real, isso chamaria uma API para obter resultados de pesquisa
    console.log("Pesquisando por:", { city, specialty })
    // Por enquanto, vamos apenas usar nossos dados de exemplo
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Encontre Atendimento Acessível</h1>
        <p className="text-muted-foreground">Busque serviços médicos gratuitos e de baixo custo na sua região</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros de Busca</CardTitle>
              <CardDescription>Refine sua busca por serviços de saúde</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    placeholder="Digite sua cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Selecione especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Clínica Geral</SelectItem>
                      <SelectItem value="pediatrics">Pediatria</SelectItem>
                      <SelectItem value="internal">Medicina Interna</SelectItem>
                      <SelectItem value="family">Medicina Familiar</SelectItem>
                      <SelectItem value="obgyn">Ginecologia/Obstetrícia</SelectItem>
                      <SelectItem value="dental">Odontologia</SelectItem>
                      <SelectItem value="mental">Saúde Mental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">{searchResults.length} resultados encontrados</p>
            <Select defaultValue="distance">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distância</SelectItem>
                <SelectItem value="availability">Disponibilidade</SelectItem>
                <SelectItem value="rating">Avaliação</SelectItem>
                <SelectItem value="cost">Custo (Menor para Maior)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {searchResults.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <Link href={`/atendimento/${result.id}`} className="block">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{result.name}</CardTitle>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                        <span>{result.rating}</span>
                      </div>
                    </div>
                    <CardDescription>{result.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-2">
                      <div className="flex items-start">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm">{result.address}</p>
                          <p className="text-sm text-muted-foreground">{result.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          <span className="font-medium">Próxima Disponível:</span> {result.nextAvailable}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          <span className="font-medium">Custo:</span> {result.cost}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
