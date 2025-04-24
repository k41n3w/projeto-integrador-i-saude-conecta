"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin, Plus, Building, Phone, Mail, User, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase, supabaseDb } from "@/lib/supabase"
import { getProviderServices, createService } from "@/lib/services"
import { toast } from "@/components/ui/use-toast"

export default function ProviderProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [serviceSuccessModalOpen, setServiceSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const [profileData, setProfileData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    specialty: "",
    website: "",
    description: "",
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

  // Carregar dados do perfil e serviços
  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const loadProfileData = async () => {
      setIsLoading(true)
      try {
        // Buscar dados do perfil usando supabaseDb (schema saude_conecta)
        const { data: profile, error } = await supabaseDb.from("profiles").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Erro ao buscar perfil:", error)
          // Se falhar no schema saude_conecta, tente no schema public
          const { data: publicProfile, error: publicError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

          if (publicError) {
            console.error("Erro ao buscar perfil no schema public:", publicError)
          } else if (publicProfile) {
            setProfileData({
              organizationName: publicProfile.organization_name || "",
              contactName: publicProfile.name || "",
              email: user.email,
              phone: publicProfile.phone || "",
              address: publicProfile.address || "",
              city: publicProfile.city || "",
              state: publicProfile.state || "",
              zipCode: publicProfile.zip_code || "",
              specialty: publicProfile.specialty || "",
              website: publicProfile.website || "",
              description: publicProfile.description || "",
            })
          }
        } else if (profile) {
          setProfileData({
            organizationName: profile.organization_name || "",
            contactName: profile.name || "",
            email: user.email,
            phone: profile.phone || "",
            address: profile.address || "",
            city: profile.city || "",
            state: profile.state || "",
            zipCode: profile.zip_code || "",
            specialty: profile.specialty || "",
            website: profile.website || "",
            description: profile.description || "",
          })
        }

        // Buscar serviços do provedor
        try {
          const providerServices = await getProviderServices(user.id)
          setServices(providerServices)
        } catch (serviceError) {
          console.error("Erro ao carregar serviços:", serviceError)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfileData()
  }, [user, router])

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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      console.log("Atualizando perfil com dados:", {
        organization_name: profileData.organizationName,
        name: profileData.contactName,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zip_code: profileData.zipCode,
        specialty: profileData.specialty,
        website: profileData.website,
        description: profileData.description,
      })

      // Usar supabaseDb para atualizar o perfil no schema saude_conecta
      const { error } = await supabaseDb
        .from("profiles")
        .update({
          organization_name: profileData.organizationName,
          name: profileData.contactName,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zip_code: profileData.zipCode,
          specialty: profileData.specialty,
          website: profileData.website,
          description: profileData.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        console.error("Erro ao atualizar perfil:", error)
        throw error
      }

      // Mostrar modal de sucesso em vez de toast
      setSuccessMessage("Suas informações foram atualizadas com sucesso.")
      setSuccessModalOpen(true)
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (!user) throw new Error("Usuário não autenticado")

      const serviceData = {
        provider_id: user.id,
        name: newService.name,
        description: newService.description,
        specialty: newService.specialty,
        duration: Number.parseInt(newService.duration),
        cost: newService.cost || "Gratuito",
        requirements: newService.requirements,
      }

      const slots = newService.slots.map((slot) => ({
        date: slot.date,
        time: slot.time,
        duration: Number.parseInt(slot.duration),
        cost: slot.cost || serviceData.cost,
      }))

      const { error, service } = await createService(serviceData, slots)

      if (error) {
        console.error("Erro ao criar serviço:", error)
        throw error
      }

      // Atualizar a lista de serviços
      const updatedServices = await getProviderServices(user.id)
      setServices(updatedServices)

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

      // Fechar o diálogo e mostrar modal de sucesso
      setDialogOpen(false)
      setServiceSuccessModalOpen(true)
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o serviço.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando perfil do profissional...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Modal de sucesso para atualização de perfil */}
      <AlertDialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
              Perfil Atualizado
            </AlertDialogTitle>
            <AlertDialogDescription>{successMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de sucesso para criação de serviço */}
      <AlertDialog open={serviceSuccessModalOpen} onOpenChange={setServiceSuccessModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
              Serviço Adicionado
            </AlertDialogTitle>
            <AlertDialogDescription>O serviço foi adicionado com sucesso.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                        disabled
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

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar Perfil"}
                </Button>
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
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar Atendimento"}
                      </Button>
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
                          <span>{service.duration} min</span>
                          <span className="mx-2">•</span>
                          <span>{service.specialty}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          <span className="font-medium">{service.slots?.length || 0}</span> horários disponíveis
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
        </div>
      </div>
    </div>
  )
}
