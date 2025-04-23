"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseDb } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

export default function FixServicesRLSPage() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  const fixRLSPolicies = async () => {
    setIsExecuting(true)
    addLog("Iniciando ajuste das políticas de RLS...")

    try {
      // 1. Verificar se as tabelas existem
      addLog("Verificando tabelas...")
      const { data: tablesData, error: tablesError } = await supabaseDb.rpc("exec_sql", {
        sql_query: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'saude_conecta' 
          AND table_name IN ('services', 'service_slots');
        `,
      })

      if (tablesError) {
        addLog(`Erro ao verificar tabelas: ${tablesError.message}`)
        throw tablesError
      }

      addLog(`Tabelas encontradas: ${JSON.stringify(tablesData)}`)

      // 2. Desabilitar temporariamente RLS para ajustar as políticas
      addLog("Desabilitando temporariamente RLS...")
      const { error: disableRLSError } = await supabaseDb.rpc("exec_sql", {
        sql_query: `
          ALTER TABLE saude_conecta.services DISABLE ROW LEVEL SECURITY;
          ALTER TABLE saude_conecta.service_slots DISABLE ROW LEVEL SECURITY;
        `,
      })

      if (disableRLSError) {
        addLog(`Erro ao desabilitar RLS: ${disableRLSError.message}`)
        throw disableRLSError
      }

      // 3. Remover políticas existentes
      addLog("Removendo políticas existentes...")
      const { error: dropPoliciesError } = await supabaseDb.rpc("exec_sql", {
        sql_query: `
          DROP POLICY IF EXISTS services_insert_policy ON saude_conecta.services;
          DROP POLICY IF EXISTS services_select_policy ON saude_conecta.services;
          DROP POLICY IF EXISTS services_update_policy ON saude_conecta.services;
          DROP POLICY IF EXISTS services_delete_policy ON saude_conecta.services;
          
          DROP POLICY IF EXISTS service_slots_insert_policy ON saude_conecta.service_slots;
          DROP POLICY IF EXISTS service_slots_select_policy ON saude_conecta.service_slots;
          DROP POLICY IF EXISTS service_slots_update_policy ON saude_conecta.service_slots;
          DROP POLICY IF EXISTS service_slots_delete_policy ON saude_conecta.service_slots;
        `,
      })

      if (dropPoliciesError) {
        addLog(`Erro ao remover políticas: ${dropPoliciesError.message}`)
        throw dropPoliciesError
      }

      // 4. Criar novas políticas
      addLog("Criando novas políticas...")
      const { error: createPoliciesError } = await supabaseDb.rpc("exec_sql", {
        sql_query: `
          -- Políticas para services
          CREATE POLICY services_select_policy ON saude_conecta.services
            FOR SELECT USING (true);
          
          CREATE POLICY services_insert_policy ON saude_conecta.services
            FOR INSERT WITH CHECK (true);
          
          CREATE POLICY services_update_policy ON saude_conecta.services
            FOR UPDATE USING (auth.uid() = provider_id);
          
          CREATE POLICY services_delete_policy ON saude_conecta.services
            FOR DELETE USING (auth.uid() = provider_id);
          
          -- Políticas para service_slots
          CREATE POLICY service_slots_select_policy ON saude_conecta.service_slots
            FOR SELECT USING (true);
          
          CREATE POLICY service_slots_insert_policy ON saude_conecta.service_slots
            FOR INSERT WITH CHECK (true);
          
          CREATE POLICY service_slots_update_policy ON saude_conecta.service_slots
            FOR UPDATE USING (true);
          
          CREATE POLICY service_slots_delete_policy ON saude_conecta.service_slots
            FOR DELETE USING (true);
        `,
      })

      if (createPoliciesError) {
        addLog(`Erro ao criar políticas: ${createPoliciesError.message}`)
        throw createPoliciesError
      }

      // 5. Habilitar RLS novamente
      addLog("Habilitando RLS novamente...")
      const { error: enableRLSError } = await supabaseDb.rpc("exec_sql", {
        sql_query: `
          ALTER TABLE saude_conecta.services ENABLE ROW LEVEL SECURITY;
          ALTER TABLE saude_conecta.service_slots ENABLE ROW LEVEL SECURITY;
        `,
      })

      if (enableRLSError) {
        addLog(`Erro ao habilitar RLS: ${enableRLSError.message}`)
        throw enableRLSError
      }

      // 6. Conceder permissões ao role anônimo e autenticado
      addLog("Concedendo permissões...")
      const { error: grantPermissionsError } = await supabaseDb.rpc("exec_sql", {
        sql_query: `
          GRANT USAGE ON SCHEMA saude_conecta TO anon, authenticated;
          GRANT ALL ON saude_conecta.services TO anon, authenticated;
          GRANT ALL ON saude_conecta.service_slots TO anon, authenticated;
        `,
      })

      if (grantPermissionsError) {
        addLog(`Erro ao conceder permissões: ${grantPermissionsError.message}`)
        throw grantPermissionsError
      }

      // 7. Atualizar o cache do Supabase
      addLog("Atualizando cache do Supabase...")
      const { error: refreshCacheError } = await supabaseDb.rpc("exec_sql", {
        sql_query: `
          SELECT pg_notify('pgrst', 'reload schema');
        `,
      })

      if (refreshCacheError) {
        addLog(`Erro ao atualizar cache: ${refreshCacheError.message}`)
        throw refreshCacheError
      }

      addLog("Políticas de RLS ajustadas com sucesso!")
      toast({
        title: "Sucesso",
        description: "As políticas de RLS foram ajustadas com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao ajustar políticas de RLS:", error)
      addLog(`Erro ao ajustar políticas de RLS: ${error instanceof Error ? error.message : String(error)}`)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao ajustar as políticas de RLS.",
        variant: "destructive",
      })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ajustar Políticas de RLS para Serviços</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Corrigir Políticas de Segurança</CardTitle>
          <CardDescription>
            Esta página ajusta as políticas de Row Level Security (RLS) para permitir a criação de serviços.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fixRLSPolicies} disabled={isExecuting} className="mb-4">
            {isExecuting ? "Executando..." : "Ajustar Políticas de RLS"}
          </Button>

          <div className="bg-muted p-4 rounded-md h-80 overflow-y-auto">
            <h3 className="font-medium mb-2">Logs:</h3>
            {logs.length === 0 ? (
              <p className="text-muted-foreground">Nenhum log disponível. Clique no botão para iniciar.</p>
            ) : (
              <ul className="space-y-1 text-sm font-mono">
                {logs.map((log, index) => (
                  <li key={index}>{log}</li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instruções</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Clique no botão "Ajustar Políticas de RLS" acima para corrigir as permissões.</li>
            <li>Aguarde até que todos os passos sejam concluídos.</li>
            <li>Após a conclusão, volte para a página de perfil e tente criar um serviço novamente.</li>
            <li>Se o problema persistir, verifique os logs para mais informações.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
