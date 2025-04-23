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
  const [providerEmail, setProviderEmail] = useState("")
  const [providerPassword, setProviderPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleProviderLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const { error: loginError } = await login(providerEmail, providerPassword)

      if (loginError) {
        setError(loginError.message || "Erro ao fazer login")
        return
      }

      // Redirecionar para a página de perfil do profissional
      router.push(`/providers/profile`)
    } catch (err) {
      setError("Ocorreu um erro ao fazer login")
      console.error(err)
    } finally {
      setIsLoading(false)
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
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
