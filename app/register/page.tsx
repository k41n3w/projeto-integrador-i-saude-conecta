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
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [providerData, setProviderData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProviderData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (providerData.password !== providerData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    setIsLoading(true)

    try {
      const { error: registerError } = await register(providerData.email, providerData.password, {
        name: providerData.contactName,
        type: "provider",
        organization_name: providerData.organizationName,
      })

      if (registerError) {
        setError(registerError.message || "Erro ao criar conta")
        return
      }

      // Redirecionar para a página de perfil do profissional
      router.push(`/providers/profile`)
    } catch (err: any) {
      setError("Ocorreu um erro ao criar a conta: " + (err.message || "Erro desconhecido"))
      console.error(err)
    } finally {
      setIsLoading(false)
    }
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Criar Conta de Profissional"}
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
