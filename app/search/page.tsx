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
import { getAllServices } from "@/lib/services"

export default function SearchPage() {
  const [city, setCity] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true)
      try {
        const services = await getAllServices()
        setSearchResults(
          services.map((service: any) => ({
            id: service.id,
            name: service.provider?.organization_name || "Clínica",
            specialty: service.specialty,
            address: `${service.provider?.address || ""}, ${service.provider?.city || ""}, ${service.provider?.state || ""}`,
            distance: "2,3 km", // Simulado
            rating: service.provider?.rating || 4.5,
            nextAvailable:
              service.slots && service.slots.length > 0
                ? `${new Date(service.slots[0].date).toLocaleDateString("pt-BR")}, ${service.slots[0].time}`
                : "Não disponível",
            cost: service.cost,
          })),
        )
      } catch (error) {
        console.error("Erro ao carregar serviços:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const services = await getAllServices({
        city: city || undefined,
        specialty: specialty || undefined,
      })

      setSearchResults(
        services.map((service: any) => ({
          id: service.id,
          name: service.provider?.organization_name || "Clínica",
          specialty: service.specialty,
          address: `${service.provider?.address || ""}, ${service.provider?.city || ""}, ${service.provider?.state || ""}`,
          distance: "2,3 km", // Simulado
          rating: service.provider?.rating || 4.5,
          nextAvailable:
            service.slots && service.slots.length > 0
              ? `${new Date(service.slots[0].date).toLocaleDateString("pt-BR")}, ${service.slots[0].time}`
              : "Não disponível",
          cost: service.cost,
        })),
      )
    } catch (error) {
      console.error("Erro ao buscar serviços:", error)
    } finally {
      setIsLoading(false)
    }
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
                      <SelectItem value="Clínica Geral">Clínica Geral</SelectItem>
                      <SelectItem value="Pediatria">Pediatria</SelectItem>
                      <SelectItem value="Ginecologia">Ginecologia</SelectItem>
                      <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                      <SelectItem value="Ortopedia">Ortopedia</SelectItem>
                      <SelectItem value="Dermatologia">Dermatologia</SelectItem>
                      <SelectItem value="Psicologia">Psicologia</SelectItem>
                      <SelectItem value="Nutrição">Nutrição</SelectItem>
                      <SelectItem value="Fisioterapia">Fisioterapia</SelectItem>
                      <SelectItem value="Odontologia">Odontologia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <SearchIcon className="mr-2 h-4 w-4" />
                  {isLoading ? "Buscando..." : "Buscar"}
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

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-9 bg-muted rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
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
                ))
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground mb-4">Nenhum resultado encontrado</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Tente ajustar seus filtros de busca ou procurar por outra especialidade
                  </p>
                  <Button
                    onClick={() => {
                      setCity("")
                      setSpecialty("")
                      handleSearch(new Event("submit") as any)
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
