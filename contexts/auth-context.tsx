"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase, supabaseDb } from "@/lib/supabase"
import type { Session, User as SupabaseUser } from "@supabase/supabase-js"

type UserProfile = {
  id: string
  name: string
  email: string
  type: "patient" | "provider"
}

type AuthContextType = {
  user: UserProfile | null
  session: Session | null
  login: (email: string, password: string) => Promise<{ error: any }>
  register: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ error: any }>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (session) {
        setSession(session)
        await fetchUserProfile(session.user)
      }

      setIsLoading(false)
    }

    fetchSession()

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)

      if (session) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Modificar a função fetchUserProfile para buscar apenas no schema saude_conecta
  // e melhorar o tratamento de erros

  // Substituir a função fetchUserProfile atual por esta:
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Buscar apenas no schema saude_conecta, onde as tabelas realmente estão
      const { data, error } = await supabaseDb.from("profiles").select("*").eq("id", supabaseUser.id)

      if (error) {
        console.error("Erro ao buscar perfil:", error)
        return
      }

      // Verificar se encontrou algum perfil
      if (data && data.length > 0) {
        const profile = data[0]
        setUser({
          id: profile.id,
          name: profile.name,
          email: supabaseUser.email || "",
          type: profile.type,
        })
      } else {
        console.log("Nenhum perfil encontrado para o usuário:", supabaseUser.id)
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar perfil:", error)
    }
  }

  // Login com email e senha
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error && data.user) {
      await fetchUserProfile(data.user)
    }

    return { error }
  }

  // Registro com email e senha
  const register = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      // Passo 1: Criar o usuário na autenticação
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
          },
        },
      })

      if (error) {
        console.error("Erro ao criar usuário:", error)
        return { error }
      }

      if (!data.user) {
        return { error: new Error("Falha ao criar usuário") }
      }

      // Aguardar um momento para garantir que o usuário foi criado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Também modificar a função register para inserir apenas no schema saude_conecta

      // Substituir a parte de criação de perfil na função register por esta:
      // Dentro da função register, substituir o bloco try/catch de criação de perfil por:
      try {
        // Inserir diretamente no schema saude_conecta
        const { error: profileError } = await supabaseDb.from("profiles").insert([
          {
            id: data.user.id,
            name: userData.name || "",
            type: userData.type || "provider",
            organization_name: userData.organization_name || "",
            created_at: new Date().toISOString(),
          },
        ])

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError)
          return { error: profileError }
        }
      } catch (insertError) {
        console.error("Erro ao inserir perfil:", insertError)
        return { error: insertError }
      }

      await fetchUserProfile(data.user)
      return { error: null }
    } catch (error) {
      console.error("Erro no registro:", error)
      return { error }
    }
  }

  // Logout
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
