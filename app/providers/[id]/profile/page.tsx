"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin, Plus, Building, Phone, Mail, User } from "lucide-react"

// Simulação de um armazenamento global para os serviços
// Em uma aplicação real, isso seria gerenciado por um contexto ou estado global
if (typeof window !== "undefined" && !window.globalServices) {
  window.globalServices = []
}

export default function ProviderProfilePage() {
  const params = useParams()
  const providerId = params.id
  const dialogRef = useRef<HTMLButtonElement>(null)

  const [profileData, setProfileData] = useState({
    organizationName: "Clínica Comunitária de Saúde",
    contactName: "Dr. Carlos Silva",
    email: "contato@clinicacomunitaria.org",
    phone: "(11) 3456-7890",
    address: "Rua Principal, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01001-000",
    specialty: "Clínica Geral",
    website: "www.clinicacomunitaria.org",
    description:
      "A Clínica Comunitária de Saúde oferece atendimento médico gratuito para a comunidade local. Nossa equipe de profissionais dedicados está comprometida em fornecer cuidados de saúde de qualidade para todos.",
  })

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    specialty: "",
    duration: "30",
    cost: "",
    requirements: "",
    slots: [{ date: "", time: "", duration: "30", cost: "" }],
  })

  const [services, setServices] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewService((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewService((prev) => ({ ...prev, [name]: value }))
  }

  const handleSlotChange = (index: number, field: string, value: string) => {
    setNewService((prev) => {
      const updatedSlots = [...prev.slots]
      updatedSlots[index] = { ...updatedSlots[index], [field]: value }
      return { ...prev, slots: updatedSlots }
    })
  }

  const addSlot = () => {
    setNewService((prev) => ({
      ...prev,
      slots: [...prev.slots, { date: "", time: "", duration: "30", cost: "" }],
    }))
  }

  const removeSlot = (index: number) => {
    setNewService((prev) => {
      const updatedSlots = prev.slots.filter((_, i) => i !== index)
      return { ...prev, slots: updatedSlots }
    })
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dados do perfil atualizados:", profileData)
    // Em um app real, isso atualizaria o perfil no banco de dados
    alert("Perfil atualizado com sucesso!")
  }

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Novo atendimento:", newService)

    // Criar o novo serviço com todos os campos necessários
    const newServiceItem = {
      id: Date.now(),
      providerId: providerId,
      name: newService.name,
      description: newService.description,
      specialty: newService.specialty,
      duration: `${newService.duration} min`,
      cost: newService.cost || "Gratuito",
      availableSlots: newService.slots.length,
      address: profileData.address,
      city: profileData.city,
      state: profileData.state,
      distance: "2,3 km", // Simulado
      rating: 4.5, // Simulado
      reviews: 10, // Simulado
      phone: profileData.phone,
      email: profileData.email,
      website: profileData.website,
      nextAvailable: newService.slots[0]?.date
        ? `${newService.slots[0].date.split("-").reverse().join("/")} às ${newService.slots[0].time}`
        : "Não disponível",
      requirements: newService.requirements,
      slots: newService.slots,
      // Campos adicionais para compatibilidade com a página de detalhes
      openingHours: [
        { day: "Segunda a Sexta", hours: "08:00 - 18:00" },
        { day: "Sábado e Domingo", hours: "Fechado" },
      ],
      coordinates: {
        lat: -23.55052,
        lng: -46.633308,
      },
      services: [newService.name],
    }

    // Adicionar o serviço à lista local
    setServices((prev) => [...prev, newServiceItem])

    // Adicionar ao "armazenamento global" para compartilhar com a página de busca
    if (typeof window !== "undefined") {
      window.globalServices = [...window.globalServices, newServiceItem]
    }

    // Resetar o formulário
    setNewService({
      name: "",
      description: "",
      specialty: "",
      duration: "30",
      cost: "",
      requirements: "",
      slots: [{ date: "", time: "", duration: "30", cost: "" }],
    })

    // Fechar o diálogo
    setDialogOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Perfil do Profissional</h1>
        <p className="text-muted-foreground">Complete seu perfil e adicione serviços de atendimento</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Profissional</CardTitle>
              <CardDescription>Preencha os dados da sua organização ou clínica</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Nome da Organização</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                        <Building className="h-4 w-4" />
                      </span>
                      <Input
                        id="organizationName"
                        name="organizationName"
                        value={profileData.organizationName}
                        onChange={handleProfileChange}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Nome do Contato</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                        <User className="h-4 w-4" />
                      </span>
                      <Input
                        id="contactName"
                        name="contactName"
                        value={profileData.contactName}
                        onChange={handleProfileChange}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                        <Mail className="h-4 w-4" />
                      </span>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                        <Phone className="h-4 w-4" />
                      </span>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <Input
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" name="city" value={profileData.city} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" name="state" value={profileData.state} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input id="zipCode" name="zipCode" value={profileData.zipCode} onChange={handleProfileChange} />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidade Principal</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      value={profileData.specialty}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website (opcional)</Label>
                    <Input id="website" name="website" value={profileData.website} onChange={handleProfileChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={profileData.description}
                    onChange={handleProfileChange}
                  />
                </div>

                <Button type="submit">Salvar Perfil</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Serviços de Atendimento</CardTitle>
                <CardDescription>Gerencie os serviços que você oferece</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Atendimento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Atendimento</DialogTitle>
                    <DialogDescription>Preencha os detalhes do serviço que você deseja oferecer</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleServiceSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome do Serviço</Label>
                        <Input id="name" name="name" value={newService.name} onChange={handleServiceChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição do Serviço</Label>
                        <Textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={newService.description}
                          onChange={handleServiceChange}
                          required
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="specialty">Especialidade</Label>
                          <Select
                            value={newService.specialty}
                            onValueChange={(value) => handleSelectChange("specialty", value)}
                          >
                            <SelectTrigger id="specialty">
                              <SelectValue placeholder="Selecione" />
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

                        <div className="space-y-2">
                          <Label htmlFor="duration">Duração Padrão (minutos)</Label>
                          <Select
                            value={newService.duration}
                            onValueChange={(value) => handleSelectChange("duration", value)}
                          >
                            <SelectTrigger id="duration">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutos</SelectItem>
                              <SelectItem value="30">30 minutos</SelectItem>
                              <SelectItem value="45">45 minutos</SelectItem>
                              <SelectItem value="60">60 minutos</SelectItem>
                              <SelectItem value="90">90 minutos</SelectItem>
                              <SelectItem value="120">120 minutos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cost">Custo (deixe em branco para gratuito)</Label>
                        <Input
                          id="cost"
                          name="cost"
                          placeholder="Ex: R$ 50"
                          value={newService.cost}
                          onChange={handleServiceChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="requirements">Requisitos/Documentos Necessários</Label>
                        <Textarea
                          id="requirements"
                          name="requirements"
                          rows={2}
                          placeholder="Ex: Documento de identidade, Cartão do SUS"
                          value={newService.requirements}
                          onChange={handleServiceChange}
                        />
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-base">Horários Disponíveis</Label>
                        <p className="text-sm text-muted-foreground mb-4">
                          Adicione os horários em que este serviço estará disponível
                        </p>

                        {newService.slots.map((slot, index) => (
                          <div key={index} className="grid gap-4 md:grid-cols-4 mb-4 items-end">
                            <div className="space-y-2">
                              <Label htmlFor={`date-${index}`}>Data</Label>
                              <Input
                                id={`date-${index}`}
                                type="date"
                                value={slot.date}
                                onChange={(e) => handleSlotChange(index, "date", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`time-${index}`}>Horário</Label>
                              <Input
                                id={`time-${index}`}
                                type="time"
                                value={slot.time}
                                onChange={(e) => handleSlotChange(index, "time", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`slot-duration-${index}`}>Duração</Label>
                              <Select
                                value={slot.duration}
                                onValueChange={(value) => handleSlotChange(index, "duration", value)}
                              >
                                <SelectTrigger id={`slot-duration-${index}`}>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="15">15 min</SelectItem>
                                  <SelectItem value="30">30 min</SelectItem>
                                  <SelectItem value="45">45 min</SelectItem>
                                  <SelectItem value="60">60 min</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-2">
                              {index > 0 && (
                                <Button type="button" variant="destructive" size="sm" onClick={() => removeSlot(index)}>
                                  Remover
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}

                        <Button type="button" variant="outline" size="sm" onClick={addSlot} className="mt-2">
                          <Plus className="h-4 w-4 mr-1" />
                          Adicionar Horário
                        </Button>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Salvar Atendimento</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{service.duration}</span>
                          <span className="mx-2">•</span>
                          <span>{service.specialty}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          <span className="font-medium">{service.availableSlots}</span> horários disponíveis
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-sm ${service.cost === "Gratuito" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary-foreground"}`}
                        >
                          {service.cost}
                        </div>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Você ainda não adicionou nenhum serviço</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Seu Primeiro Atendimento
                      </Button>
                    </DialogTrigger>
                    {/* Conteúdo do diálogo já definido acima */}
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seu Perfil</CardTitle>
              <CardDescription>Visualize como seu perfil aparece para os pacientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Building className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-bold text-lg">{profileData.organizationName}</h3>
                <p className="text-sm text-muted-foreground">{profileData.specialty}</p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm">{profileData.address}</p>
                    <p className="text-sm">
                      {profileData.city}, {profileData.state} - {profileData.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                  <p className="text-sm">{profileData.phone}</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                  <p className="text-sm">{profileData.email}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-medium mb-2">Serviços Oferecidos</h4>
                {services.length > 0 ? (
                  <ul className="space-y-1">
                    {services.map((service) => (
                      <li key={service.id} className="text-sm flex items-center">
                        <span className="text-primary mr-2">•</span>
                        <span>{service.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum serviço cadastrado</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dicas para Completar seu Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">1.</span>
                  <span className="text-sm">
                    Preencha todas as informações de contato para facilitar o acesso dos pacientes.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">2.</span>
                  <span className="text-sm">
                    Adicione uma descrição detalhada sobre seus serviços e especialidades.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">3.</span>
                  <span className="text-sm">
                    Ofereça diversos horários de atendimento para aumentar a disponibilidade.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">4.</span>
                  <span className="text-sm">Mantenha seu perfil atualizado com novos serviços e horários.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
