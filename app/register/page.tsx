"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState("")

  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [providerData, setProviderData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPatientData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProviderData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (patientData.password !== patientData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    // Simulando registro
    login({
      id: "patient" + Date.now(),
      name: `${patientData.firstName} ${patientData.lastName}`,
      email: patientData.email,
      type: "patient",
    })

    router.push("/patient/dashboard")
  }

  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (providerData.password !== providerData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    // Simulando registro
    const userId = "1" // Simulando um ID gerado

    login({
      id: userId,
      name: providerData.contactName,
      email: providerData.email,
      type: "provider",
    })

    // Redirecionar para a página de perfil do profissional
    router.push(`/providers/${userId}/profile`)
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Criar uma conta</CardTitle>
          <CardDescription className="text-center">
            Cadastre-se para oferecer serviços de saúde acessíveis
          </CardDescription>
          <div className="text-xs text-center text-primary">
            *Cadastro disponível apenas para profissionais de saúde
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="provider" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="patient" disabled className="opacity-50 cursor-not-allowed">
                Paciente
              </TabsTrigger>
              <TabsTrigger value="provider">Profissional</TabsTrigger>
            </TabsList>
            <TabsContent value="patient">
              <form onSubmit={handlePatientSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={patientData.firstName}
                      onChange={handlePatientChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      value={patientData.lastName}
                      onChange={handlePatientChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-email">Email</Label>
                  <Input
                    id="patient-email"
                    name="email"
                    type="email"
                    required
                    value={patientData.email}
                    onChange={handlePatientChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-password">Senha</Label>
                  <Input
                    id="patient-password"
                    name="password"
                    type="password"
                    required
                    value={patientData.password}
                    onChange={handlePatientChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-confirm-password">Confirmar Senha</Label>
                  <Input
                    id="patient-confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={patientData.confirmPassword}
                    onChange={handlePatientChange}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full">
                  Criar Conta de Paciente
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="provider">
              <form onSubmit={handleProviderSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Nome da Organização</Label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    required
                    value={providerData.organizationName}
                    onChange={handleProviderChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Nome do Contato</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    required
                    value={providerData.contactName}
                    onChange={handleProviderChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-email">Email</Label>
                  <Input
                    id="provider-email"
                    name="email"
                    type="email"
                    required
                    value={providerData.email}
                    onChange={handleProviderChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-password">Senha</Label>
                  <Input
                    id="provider-password"
                    name="password"
                    type="password"
                    required
                    value={providerData.password}
                    onChange={handleProviderChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-confirm-password">Confirmar Senha</Label>
                  <Input
                    id="provider-confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={providerData.confirmPassword}
                    onChange={handleProviderChange}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full">
                  Criar Conta de Profissional
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
