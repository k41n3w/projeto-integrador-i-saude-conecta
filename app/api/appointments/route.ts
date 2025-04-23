import { NextResponse } from "next/server"

// Mock database for appointments
const appointments = [
  {
    id: "a1",
    patientId: "patient1",
    providerId: "provider1",
    providerName: "Community Health Clinic",
    providerAddress: "123 Main St, Anytown, USA",
    date: "2023-05-15",
    time: "10:00",
    duration: 30,
    service: "General Checkup",
    status: "confirmed",
  },
  {
    id: "a2",
    patientId: "patient1",
    providerId: "provider2",
    providerName: "Neighborhood Medical Center",
    providerAddress: "456 Oak Ave, Anytown, USA",
    date: "2023-05-20",
    time: "14:30",
    duration: 45,
    service: "Vaccination",
    status: "confirmed",
  },
  {
    id: "a3",
    patientId: "patient2",
    providerId: "provider1",
    providerName: "Community Health Clinic",
    providerAddress: "123 Main St, Anytown, USA",
    date: "2023-05-16",
    time: "11:30",
    duration: 30,
    service: "Blood Test",
    status: "confirmed",
  },
]

// GET handler to retrieve appointments
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get("patientId")
  const providerId = searchParams.get("providerId")

  let filteredAppointments = [...appointments]

  if (patientId) {
    filteredAppointments = filteredAppointments.filter((appointment) => appointment.patientId === patientId)
  }

  if (providerId) {
    filteredAppointments = filteredAppointments.filter((appointment) => appointment.providerId === providerId)
  }

  return NextResponse.json({ appointments: filteredAppointments })
}

// POST handler to create a new appointment
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = ["patientId", "providerId", "providerName", "providerAddress", "date", "time", "service"]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create new appointment
    const newAppointment = {
      id: `a${appointments.length + 1}`,
      patientId: data.patientId,
      providerId: data.providerId,
      providerName: data.providerName,
      providerAddress: data.providerAddress,
      date: data.date,
      time: data.time,
      duration: data.duration || 30,
      service: data.service,
      status: "confirmed",
    }

    appointments.push(newAppointment)

    return NextResponse.json(
      {
        message: "Appointment created successfully",
        appointment: newAppointment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}

// PUT handler to update an appointment
export async function PUT(request: Request) {
  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: "Missing appointment ID" }, { status: 400 })
    }

    const appointmentIndex = appointments.findIndex((a) => a.id === data.id)

    if (appointmentIndex === -1) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Update appointment
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...data,
    }

    return NextResponse.json({
      message: "Appointment updated successfully",
      appointment: appointments[appointmentIndex],
    })
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}

// DELETE handler to cancel an appointment
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing appointment ID" }, { status: 400 })
  }

  const appointmentIndex = appointments.findIndex((a) => a.id === id)

  if (appointmentIndex === -1) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
  }

  // Update status to cancelled instead of removing
  appointments[appointmentIndex].status = "cancelled"

  return NextResponse.json({
    message: "Appointment cancelled successfully",
  })
}
