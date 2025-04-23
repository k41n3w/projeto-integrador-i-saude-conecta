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

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [patientEmail, setPatientEmail] = useState("")
  const [patientPassword, setPatientPassword] = useState("")
  const [providerEmail, setProviderEmail] = useState("")
  const [providerPassword, setProviderPassword] = useState("")
  const [error, setError] = useState("")

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Simulando autenticação
    if (patientEmail === "paciente@exemplo.com" && patientPassword === "senha123") {
      login({
        id: "patient1",
        name: "João Silva",
        email: patientEmail,
        type: "patient",
      })
      router.push("/patient/dashboard")
    } else {
      setError("Email ou senha inválidos")
    }
  }

  const handleProviderLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Simulando autenticação
    // Em um app real, isso verificaria as credenciais em um banco de dados
    if (providerEmail && providerPassword) {
      login({
        id: "1",
        name: "Dr. Carlos Silva",
        email: providerEmail,
        type: "provider",
      })

      // Redirecionar para a página de perfil do profissional
      router.push(`/providers/1/profile`)
    } else {
      setError("Por favor, preencha todos os campos")
    }
  }

  return (
    <div className="container mx-auto flex h-screen max-w-md items-center justify-center px-4">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Entrar no SaúdeConecta</CardTitle>
          <CardDescription className="text-center">Digite seu email abaixo para acessar sua conta</CardDescription>
          <div className="text-xs text-center text-primary">*Acesso disponível apenas para profissionais de saúde</div>
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
              <form onSubmit={handlePatientLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-email">Email</Label>
                  <Input
                    id="patient-email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="patient-password">Senha</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="patient-password"
                    type="password"
                    required
                    value={patientPassword}
                    onChange={(e) => setPatientPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="provider">
              <form onSubmit={handleProviderLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider-email">Email</Label>
                  <Input
                    id="provider-email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    required
                    value={providerEmail}
                    onChange={(e) => setProviderEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="provider-password">Senha</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="provider-password"
                    type="password"
                    required
                    value={providerPassword}
                    onChange={(e) => setProviderPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
