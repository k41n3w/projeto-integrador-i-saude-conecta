-- Configuração do esquema do banco de dados para o SaúdeConecta
-- Este script deve ser executado no Editor SQL do Supabase

-- Habilitar a extensão UUID se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurar o esquema público
-- Nota: O Supabase já cria a tabela auth.users automaticamente

-- ===============================
-- TABELA: PROFILES
-- Armazena informações de perfil para pacientes e profissionais
-- ===============================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('patient', 'provider')),
  organization_name TEXT,
  specialty TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  website TEXT,
  description TEXT,
  latitude FLOAT,
  longitude FLOAT,
  rating FLOAT DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índice para busca por cidade e tipo
CREATE INDEX IF NOT EXISTS idx_profiles_city_type ON profiles(city, type);

-- ===============================
-- TABELA: SERVICES
-- Serviços oferecidos pelos profissionais de saúde
-- ===============================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  specialty TEXT NOT NULL,
  duration INTEGER NOT NULL, -- duração em minutos
  cost TEXT NOT NULL, -- pode ser "Gratuito" ou um valor em R$
  requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para melhorar a performance das buscas
CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_specialty ON services(specialty);

-- ===============================
-- TABELA: SERVICE_SLOTS
-- Horários disponíveis para cada serviço
-- ===============================
CREATE TABLE IF NOT EXISTS service_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL, -- duração em minutos
  cost TEXT NOT NULL, -- pode ser "Gratuito" ou um valor em R$
  is_booked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índice para busca de slots por serviço e disponibilidade
CREATE INDEX IF NOT EXISTS idx_slots_service_booked ON service_slots(service_id, is_booked);
CREATE INDEX IF NOT EXISTS idx_slots_date ON service_slots(date);

-- ===============================
-- TABELA: APPOINTMENTS
-- Agendamentos realizados pelos pacientes
-- ===============================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  slot_id UUID NOT NULL REFERENCES service_slots(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para consultas comuns
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_provider ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_slot ON appointments(slot_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ===============================
-- TRIGGER: Atualizar o campo updated_at
-- ===============================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar o trigger a todas as tabelas
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_slots_updated_at
BEFORE UPDATE ON service_slots
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- CONFIGURAÇÃO DE SEGURANÇA (RLS)
-- ===============================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
-- Qualquer pessoa pode ver perfis públicos
CREATE POLICY profiles_select_policy ON profiles
  FOR SELECT USING (true);

-- Apenas o próprio usuário pode editar seu perfil
CREATE POLICY profiles_update_policy ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para services
-- Qualquer pessoa pode ver serviços
CREATE POLICY services_select_policy ON services
  FOR SELECT USING (true);

-- Apenas o provedor pode criar, atualizar ou excluir seus serviços
CREATE POLICY services_insert_policy ON services
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY services_update_policy ON services
  FOR UPDATE USING (auth.uid() = provider_id);

CREATE POLICY services_delete_policy ON services
  FOR DELETE USING (auth.uid() = provider_id);

-- Políticas para service_slots
-- Qualquer pessoa pode ver slots
CREATE POLICY service_slots_select_policy ON service_slots
  FOR SELECT USING (true);

-- Apenas o provedor do serviço pode criar, atualizar ou excluir slots
CREATE POLICY service_slots_insert_policy ON service_slots
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT provider_id FROM services WHERE id = service_id
    )
  );

CREATE POLICY service_slots_update_policy ON service_slots
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT provider_id FROM services WHERE id = service_id
    )
  );

CREATE POLICY service_slots_delete_policy ON service_slots
  FOR DELETE USING (
    auth.uid() IN (
      SELECT provider_id FROM services WHERE id = service_id
    )
  );

-- Políticas para appointments
-- Pacientes podem ver seus próprios agendamentos
CREATE POLICY appointments_select_patient_policy ON appointments
  FOR SELECT USING (auth.uid() = patient_id);

-- Provedores podem ver agendamentos para seus serviços
CREATE POLICY appointments_select_provider_policy ON appointments
  FOR SELECT USING (auth.uid() = provider_id);

-- Pacientes podem criar agendamentos
CREATE POLICY appointments_insert_policy ON appointments
  FOR INSERT WITH CHECK (
    auth.uid() = patient_id OR 
    auth.uid() IS NOT NULL -- Permitir criação mesmo sem estar logado (para pacientes não registrados)
  );

-- Pacientes podem atualizar apenas seus próprios agendamentos
CREATE POLICY appointments_update_patient_policy ON appointments
  FOR UPDATE USING (auth.uid() = patient_id);

-- Provedores podem atualizar agendamentos para seus serviços
CREATE POLICY appointments_update_provider_policy ON appointments
  FOR UPDATE USING (auth.uid() = provider_id);

-- ===============================
-- FUNÇÕES AUXILIARES
-- ===============================

-- Função para buscar serviços por cidade e especialidade
CREATE OR REPLACE FUNCTION search_services(
  p_city TEXT DEFAULT NULL,
  p_specialty TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  specialty TEXT,
  duration INTEGER,
  cost TEXT,
  provider_id UUID,
  provider_name TEXT,
  organization_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  available_slots INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.description,
    s.specialty,
    s.duration,
    s.cost,
    p.id as provider_id,
    p.name as provider_name,
    p.organization_name,
    p.address,
    p.city,
    p.state,
    COUNT(ss.id)::INTEGER as available_slots
  FROM 
    services s
    JOIN profiles p ON s.provider_id = p.id
    LEFT JOIN service_slots ss ON s.id = ss.service_id AND ss.is_booked = FALSE
  WHERE 
    (p_city IS NULL OR p.city ILIKE '%' || p_city || '%')
    AND (p_specialty IS NULL OR s.specialty ILIKE '%' || p_specialty || '%')
  GROUP BY 
    s.id, p.id
  ORDER BY 
    available_slots DESC, p.rating DESC;
END;
$$ LANGUAGE plpgsql;

-- Função para marcar um slot como reservado e criar um agendamento
CREATE OR REPLACE FUNCTION book_appointment(
  p_patient_id UUID,
  p_slot_id UUID,
  p_patient_name TEXT,
  p_patient_email TEXT,
  p_patient_phone TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_service_id UUID;
  v_provider_id UUID;
  v_appointment_id UUID;
BEGIN
  -- Verificar se o slot existe e não está reservado
  IF NOT EXISTS (SELECT 1 FROM service_slots WHERE id = p_slot_id AND is_booked = FALSE) THEN
    RAISE EXCEPTION 'Slot não disponível ou não existe';
  END IF;
  
  -- Obter o service_id do slot
  SELECT service_id INTO v_service_id FROM service_slots WHERE id = p_slot_id;
  
  -- Obter o provider_id do serviço
  SELECT provider_id INTO v_provider_id FROM services WHERE id = v_service_id;
  
  -- Marcar o slot como reservado
  UPDATE service_slots SET is_booked = TRUE WHERE id = p_slot_id;
  
  -- Criar o agendamento
  INSERT INTO appointments (
    patient_id,
    provider_id,
    service_id,
    slot_id,
    status,
    patient_name,
    patient_email,
    patient_phone,
    notes
  ) VALUES (
    p_patient_id,
    v_provider_id,
    v_service_id,
    p_slot_id,
    'confirmed',
    p_patient_name,
    p_patient_email,
    p_patient_phone,
    p_notes
  ) RETURNING id INTO v_appointment_id;
  
  RETURN v_appointment_id;
END;
$$ LANGUAGE plpgsql;

-- Função para cancelar um agendamento
CREATE OR REPLACE FUNCTION cancel_appointment(
  p_appointment_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_slot_id UUID;
  v_patient_id UUID;
  v_provider_id UUID;
BEGIN
  -- Verificar se o agendamento existe
  SELECT slot_id, patient_id, provider_id INTO v_slot_id, v_patient_id, v_provider_id
  FROM appointments
  WHERE id = p_appointment_id;
  
  IF v_slot_id IS NULL THEN
    RAISE EXCEPTION 'Agendamento não encontrado';
  END IF;
  
  -- Verificar se o usuário tem permissão para cancelar
  IF p_user_id != v_patient_id AND p_user_id != v_provider_id THEN
    RAISE EXCEPTION 'Sem permissão para cancelar este agendamento';
  END IF;
  
  -- Atualizar o status do agendamento
  UPDATE appointments SET status = 'cancelled' WHERE id = p_appointment_id;
  
  -- Liberar o slot
  UPDATE service_slots SET is_booked = FALSE WHERE id = v_slot_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
