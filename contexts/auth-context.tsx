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

  // Buscar perfil do usuário no banco de dados (schema saude_conecta)
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Primeiro, tente buscar no schema saude_conecta
      const { data, error } = await supabaseDb.from("profiles").select("*").eq("id", supabaseUser.id).single()

      if (error) {
        console.error("Erro ao buscar perfil no schema saude_conecta:", error)

        // Se não encontrar, tente buscar no schema public
        const { data: publicData, error: publicError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", supabaseUser.id)
          .single()

        if (publicError) {
          console.error("Erro ao buscar perfil no schema public:", publicError)
          return
        }

        if (publicData) {
          setUser({
            id: publicData.id,
            name: publicData.name,
            email: supabaseUser.email || "",
            type: publicData.type,
          })
        }

        return
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: supabaseUser.email || "",
          type: data.type,
        })
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error)
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

      // Passo 2: Criar o perfil no schema saude_conecta
      const profileData = {
        id: data.user.id,
        name: userData.name || "",
        type: userData.type || "provider",
        organization_name: userData.organization_name || "",
        created_at: new Date().toISOString(),
      }

      console.log("Criando perfil com dados:", profileData)

      try {
        // Primeiro, tente inserir no schema saude_conecta
        const { data: profileData, error: profileError } = await supabaseDb.rpc("create_profile", {
          p_id: data.user.id,
          p_name: userData.name || "",
          p_type: userData.type || "provider",
          p_organization_name: userData.organization_name || "",
        })

        if (profileError) {
          console.error("Erro ao criar perfil no schema saude_conecta:", profileError)

          // Se falhar, tente inserir no schema public
          const { error: publicProfileError } = await supabase.from("profiles").insert([profileData])

          if (publicProfileError) {
            console.error("Erro ao criar perfil no schema public:", publicProfileError)
            return { error: publicProfileError }
          }
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
