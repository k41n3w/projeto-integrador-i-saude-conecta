import { supabaseDb } from "./supabase"

export type Service = {
  id: string
  provider_id: string
  name: string
  description: string
  specialty: string
  duration: number
  cost: string
  requirements: string
  created_at: string
}

export type ServiceSlot = {
  id: string
  service_id: string
  date: string
  time: string
  duration: number
  cost: string
  is_booked: boolean
}

// Buscar serviços de um provedor
export async function getProviderServices(providerId: string) {
  try {
    // Usar supabaseDb que aponta para o schema saude_conecta
    const { data, error } = await supabaseDb
      .from("services")
      .select(`
        *,
        slots:service_slots(*)
      `)
      .eq("provider_id", providerId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar serviços com relação:", error)

      // Se falhar, tente buscar apenas os serviços
      const { data: servicesOnly, error: servicesError } = await supabaseDb
        .from("services")
        .select("*")
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false })

      if (servicesError) {
        console.error("Erro ao buscar apenas serviços:", servicesError)
        return []
      }

      // Para cada serviço, busque os slots separadamente
      const servicesWithSlots = await Promise.all(
        (servicesOnly || []).map(async (service) => {
          const { data: slots, error: slotsError } = await supabaseDb
            .from("service_slots")
            .select("*")
            .eq("service_id", service.id)

          if (slotsError) {
            console.error(`Erro ao buscar slots para o serviço ${service.id}:`, slotsError)
            return { ...service, slots: [] }
          }

          return { ...service, slots: slots || [] }
        }),
      )

      return servicesWithSlots
    }

    return data || []
  } catch (error) {
    console.error("Erro inesperado ao buscar serviços:", error)
    return []
  }
}

// Buscar todos os serviços disponíveis
export async function getAllServices(filters: { city?: string; specialty?: string } = {}) {
  try {
    // Usar supabaseDb que aponta para o schema saude_conecta
    let query = supabaseDb.from("services").select(`
        *,
        provider:profiles(*),
        slots:service_slots(*)
      `)

    // Aplicar filtros
    if (filters.specialty) {
      query = query.ilike("specialty", `%${filters.specialty}%`)
    }

    if (filters.city) {
      query = query.eq("provider.city", filters.city)
    }

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar serviços com relações:", error)

      // Se falhar, tente uma abordagem alternativa
      const { data: servicesOnly, error: servicesError } = await supabaseDb
        .from("services")
        .select("*")
        .order("created_at", { ascending: false })

      if (servicesError) {
        console.error("Erro ao buscar apenas serviços:", servicesError)
        return []
      }

      // Para cada serviço, busque o provedor e os slots separadamente
      const servicesWithRelations = await Promise.all(
        (servicesOnly || []).map(async (service) => {
          // Buscar o provedor
          const { data: provider, error: providerError } = await supabaseDb
            .from("profiles")
            .select("*")
            .eq("id", service.provider_id)
            .single()

          if (providerError) {
            console.error(`Erro ao buscar provedor para o serviço ${service.id}:`, providerError)
          }

          // Buscar os slots
          const { data: slots, error: slotsError } = await supabaseDb
            .from("service_slots")
            .select("*")
            .eq("service_id", service.id)

          if (slotsError) {
            console.error(`Erro ao buscar slots para o serviço ${service.id}:`, slotsError)
          }

          return {
            ...service,
            provider: provider || null,
            slots: slots || [],
          }
        }),
      )

      // Aplicar filtros manualmente
      let filteredServices = servicesWithRelations

      if (filters.specialty) {
        const specialtyLower = filters.specialty.toLowerCase()
        filteredServices = filteredServices.filter(
          (service) => service.specialty && service.specialty.toLowerCase().includes(specialtyLower),
        )
      }

      if (filters.city && filteredServices[0]?.provider) {
        const cityLower = filters.city.toLowerCase()
        filteredServices = filteredServices.filter(
          (service) => service.provider && service.provider.city && service.provider.city.toLowerCase() === cityLower,
        )
      }

      return filteredServices
    }

    return data || []
  } catch (error) {
    console.error("Erro inesperado ao buscar todos os serviços:", error)
    return []
  }
}

// Buscar um serviço específico
export async function getServiceById(serviceId: string) {
  try {
    // Usar supabaseDb que aponta para o schema saude_conecta
    const { data, error } = await supabaseDb
      .from("services")
      .select(`
        *,
        provider:profiles(*),
        slots:service_slots(*)
      `)
      .eq("id", serviceId)
      .single()

    if (error) {
      console.error("Erro ao buscar serviço com relações:", error)

      // Se falhar, tente uma abordagem alternativa
      const { data: service, error: serviceError } = await supabaseDb
        .from("services")
        .select("*")
        .eq("id", serviceId)
        .single()

      if (serviceError) {
        console.error("Erro ao buscar apenas o serviço:", serviceError)
        return null
      }

      // Buscar o provedor
      const { data: provider, error: providerError } = await supabaseDb
        .from("profiles")
        .select("*")
        .eq("id", service.provider_id)
        .single()

      if (providerError) {
        console.error(`Erro ao buscar provedor para o serviço ${serviceId}:`, providerError)
      }

      // Buscar os slots
      const { data: slots, error: slotsError } = await supabaseDb
        .from("service_slots")
        .select("*")
        .eq("service_id", serviceId)

      if (slotsError) {
        console.error(`Erro ao buscar slots para o serviço ${serviceId}:`, slotsError)
      }

      return {
        ...service,
        provider: provider || null,
        slots: slots || [],
      }
    }

    return data
  } catch (error) {
    console.error("Erro inesperado ao buscar serviço por ID:", error)
    return null
  }
}

// Criar um novo serviço
export async function createService(
  serviceData: Omit<Service, "id" | "created_at">,
  slots: Omit<ServiceSlot, "id" | "service_id">[],
) {
  try {
    // Usar supabaseDb que aponta para o schema saude_conecta
    const { data: service, error } = await supabaseDb
      .from("services")
      .insert([
        {
          ...serviceData,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error || !service) {
      console.error("Erro ao criar serviço:", error)
      return { error }
    }

    // Inserir os slots do serviço
    if (slots.length > 0) {
      const { error: slotsError } = await supabaseDb.from("service_slots").insert(
        slots.map((slot) => ({
          ...slot,
          service_id: service.id,
          is_booked: false,
        })),
      )

      if (slotsError) {
        console.error("Erro ao criar slots:", slotsError)
        return { error: slotsError }
      }
    }

    return { service }
  } catch (error) {
    console.error("Erro inesperado ao criar serviço:", error)
    return { error }
  }
}

// Atualizar um serviço existente
export async function updateService(serviceId: string, serviceData: Partial<Service>) {
  // Usar supabaseDb que aponta para o schema saude_conecta
  const { data, error } = await supabaseDb.from("services").update(serviceData).eq("id", serviceId).select().single()

  if (error) {
    console.error("Erro ao atualizar serviço:", error)
    return { error }
  }

  return { service: data }
}

// Excluir um serviço
export async function deleteService(serviceId: string) {
  try {
    // Usar supabaseDb que aponta para o schema saude_conecta
    // Primeiro excluir os slots relacionados
    const { error: slotsError } = await supabaseDb.from("service_slots").delete().eq("service_id", serviceId)

    if (slotsError) {
      console.error("Erro ao excluir slots:", slotsError)
      return { error: slotsError }
    }

    // Depois excluir o serviço
    const { error } = await supabaseDb.from("services").delete().eq("id", serviceId)

    if (error) {
      console.error("Erro ao excluir serviço:", error)
      return { error }
    }

    return { success: true }
  } catch (error) {
    console.error("Erro inesperado ao excluir serviço:", error)
    return { error }
  }
}
