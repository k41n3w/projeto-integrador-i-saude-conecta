import { NextResponse } from "next/server"

// Mock database for healthcare providers
const providers = [
  {
    id: "provider1",
    name: "Community Health Clinic",
    type: "clinic",
    specialty: "General Practice",
    address: "123 Main St, Anytown, USA",
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      zipCode: "94107",
    },
    phone: "(555) 123-4567",
    email: "info@communityhealthclinic.org",
    website: "https://communityhealthclinic.org",
    services: ["General Checkup", "Vaccination", "Blood Test", "Basic Treatment"],
    acceptingNewPatients: true,
    availableSlots: [
      { date: "2023-05-15", time: "10:00", duration: 30, cost: "Free" },
      { date: "2023-05-15", time: "11:00", duration: 30, cost: "Free" },
      { date: "2023-05-16", time: "14:30", duration: 45, cost: "Free" },
      { date: "2023-05-17", time: "09:00", duration: 30, cost: "Free" },
    ],
    ratings: 4.8,
    reviews: 124,
  },
  {
    id: "provider2",
    name: "Neighborhood Medical Center",
    type: "medical center",
    specialty: "Pediatrics",
    address: "456 Oak Ave, Anytown, USA",
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
      zipCode: "94108",
    },
    phone: "(555) 987-6543",
    email: "contact@neighborhoodmedical.org",
    website: "https://neighborhoodmedical.org",
    services: ["Pediatric Checkup", "Vaccination", "Developmental Screening", "Child Wellness"],
    acceptingNewPatients: true,
    availableSlots: [
      { date: "2023-05-15", time: "09:15", duration: 30, cost: "$20" },
      { date: "2023-05-16", time: "13:00", duration: 45, cost: "$20" },
      { date: "2023-05-17", time: "11:30", duration: 60, cost: "$25" },
      { date: "2023-05-18", time: "15:45", duration: 30, cost: "$20" },
    ],
    ratings: 4.6,
    reviews: 98,
  },
  {
    id: "provider3",
    name: "Wellness Care Clinic",
    type: "clinic",
    specialty: "Family Medicine",
    address: "789 Pine Rd, Anytown, USA",
    location: {
      latitude: 37.7694,
      longitude: -122.4862,
      zipCode: "94118",
    },
    phone: "(555) 456-7890",
    email: "care@wellnessclinic.org",
    website: "https://wellnessclinic.org",
    services: ["Family Checkup", "Vaccination", "Chronic Disease Management", "Preventive Care"],
    acceptingNewPatients: true,
    availableSlots: [
      { date: "2023-05-16", time: "13:00", duration: 45, cost: "$15" },
      { date: "2023-05-17", time: "10:30", duration: 30, cost: "$15" },
      { date: "2023-05-18", time: "14:15", duration: 60, cost: "$25" },
      { date: "2023-05-19", time: "09:45", duration: 30, cost: "Free" },
    ],
    ratings: 4.7,
    reviews: 112,
  },
  {
    id: "provider4",
    name: "Accessible Health Partners",
    type: "healthcare network",
    specialty: "Internal Medicine",
    address: "321 Elm St, Anytown, USA",
    location: {
      latitude: 37.7831,
      longitude: -122.41,
      zipCode: "94109",
    },
    phone: "(555) 789-0123",
    email: "info@accessiblehealth.org",
    website: "https://accessiblehealth.org",
    services: ["Adult Checkup", "Chronic Disease Management", "Preventive Care", "Health Screenings"],
    acceptingNewPatients: true,
    availableSlots: [
      { date: "2023-05-15", time: "14:00", duration: 45, cost: "Free" },
      { date: "2023-05-16", time: "10:30", duration: 30, cost: "Free" },
      { date: "2023-05-17", time: "15:45", duration: 60, cost: "$20" },
      { date: "2023-05-19", time: "11:15", duration: 30, cost: "Free" },
    ],
    ratings: 4.5,
    reviews: 87,
  },
]

// GET handler to retrieve providers
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Filter parameters
  const specialty = searchParams.get("specialty")
  const zipCode = searchParams.get("zipCode")
  const service = searchParams.get("service")
  const cost = searchParams.get("cost")

  let filteredProviders = [...providers]

  // Apply filters
  if (specialty) {
    filteredProviders = filteredProviders.filter((provider) =>
      provider.specialty.toLowerCase().includes(specialty.toLowerCase()),
    )
  }

  if (zipCode) {
    filteredProviders = filteredProviders.filter((provider) => provider.location.zipCode === zipCode)
  }

  if (service) {
    filteredProviders = filteredProviders.filter((provider) =>
      provider.services.some((s) => s.toLowerCase().includes(service.toLowerCase())),
    )
  }

  if (cost === "free") {
    filteredProviders = filteredProviders.filter((provider) =>
      provider.availableSlots.some((slot) => slot.cost === "Free"),
    )
  }

  // Return filtered providers with limited data for list view
  return NextResponse.json({
    providers: filteredProviders.map((provider) => ({
      id: provider.id,
      name: provider.name,
      specialty: provider.specialty,
      address: provider.address,
      services: provider.services,
      acceptingNewPatients: provider.acceptingNewPatients,
      ratings: provider.ratings,
      reviews: provider.reviews,
      nextAvailable: provider.availableSlots[0]
        ? `${provider.availableSlots[0].date} at ${provider.availableSlots[0].time}`
        : "No availability",
    })),
  })
}

// GET handler to retrieve a specific provider by ID
export async function getProviderById(id: string) {
  const provider = providers.find((p) => p.id === id)

  if (!provider) {
    return null
  }

  return provider
}

// POST handler to register a new provider
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = ["name", "type", "specialty", "address", "phone", "email", "services"]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create new provider
    const newProvider = {
      id: `provider${providers.length + 1}`,
      name: data.name,
      type: data.type,
      specialty: data.specialty,
      address: data.address,
      location: data.location || {
        latitude: 0,
        longitude: 0,
        zipCode: "00000",
      },
      phone: data.phone,
      email: data.email,
      website: data.website || "",
      services: data.services,
      acceptingNewPatients: data.acceptingNewPatients !== false,
      availableSlots: data.availableSlots || [],
      ratings: 0,
      reviews: 0,
    }

    // In a real app, this would add to a database
    // providers.push(newProvider);

    return NextResponse.json(
      {
        message: "Provider registered successfully",
        provider: newProvider,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error registering provider:", error)
    return NextResponse.json({ error: "Failed to register provider" }, { status: 500 })
  }
}
