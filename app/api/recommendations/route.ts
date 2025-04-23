import { NextResponse } from "next/server"

// Este é um sistema de recomendação simplificado
// Em uma aplicação real, isso usaria algoritmos mais sofisticados

interface Patient {
  id: string
  location: {
    latitude: number
    longitude: number
    zipCode: string
  }
  medicalNeeds: string[]
  preferredCost: "free" | "low-cost" | "any"
  preferredDistance: number // in miles
  previousAppointments?: string[]
}

interface Provider {
  id: string
  name: string
  specialty: string
  location: {
    latitude: number
    longitude: number
    address: string
    zipCode: string
  }
  availableSlots: {
    date: string
    time: string
    duration: number
    cost: number | "free"
  }[]
  services: string[]
  ratings: number
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Mock database of providers
const providers: Provider[] = [
  {
    id: "p1",
    name: "Community Health Clinic",
    specialty: "General Practice",
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: "123 Main St, Anytown, USA",
      zipCode: "94107",
    },
    availableSlots: [
      { date: "2023-05-15", time: "10:00", duration: 30, cost: "free" },
      { date: "2023-05-16", time: "14:30", duration: 45, cost: "free" },
    ],
    services: ["checkup", "vaccination", "blood test"],
    ratings: 4.8,
  },
  {
    id: "p2",
    name: "Neighborhood Medical Center",
    specialty: "Pediatrics",
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
      address: "456 Oak Ave, Anytown, USA",
      zipCode: "94108",
    },
    availableSlots: [
      { date: "2023-05-15", time: "09:15", duration: 30, cost: 20 },
      { date: "2023-05-17", time: "11:30", duration: 60, cost: 25 },
    ],
    services: ["pediatric checkup", "vaccination", "developmental screening"],
    ratings: 4.6,
  },
  {
    id: "p3",
    name: "Wellness Care Clinic",
    specialty: "Family Medicine",
    location: {
      latitude: 37.7694,
      longitude: -122.4862,
      address: "789 Pine Rd, Anytown, USA",
      zipCode: "94118",
    },
    availableSlots: [
      { date: "2023-05-16", time: "13:00", duration: 45, cost: 15 },
      { date: "2023-05-18", time: "10:30", duration: 30, cost: "free" },
    ],
    services: ["family checkup", "vaccination", "chronic disease management"],
    ratings: 4.7,
  },
]

export async function POST(request: Request) {
  try {
    const { patient } = await request.json()

    if (!patient || !patient.location || !patient.medicalNeeds) {
      return NextResponse.json({ error: "Missing required patient information" }, { status: 400 })
    }

    // Filter providers based on patient needs
    let matchedProviders = providers.filter((provider) => {
      // Check if provider offers services that match patient needs
      const hasMatchingServices = patient.medicalNeeds.some((need: string) =>
        provider.services.some((service) => service.includes(need.toLowerCase())),
      )

      // Calculate distance
      const distance = calculateDistance(
        patient.location.latitude,
        patient.location.longitude,
        provider.location.latitude,
        provider.location.longitude,
      )

      // Check if provider is within preferred distance
      const isWithinDistance = distance <= patient.preferredDistance

      // Check if cost matches preference
      const hasSuitableCost =
        patient.preferredCost === "any" ||
        (patient.preferredCost === "free" && provider.availableSlots.some((slot) => slot.cost === "free")) ||
        (patient.preferredCost === "low-cost" &&
          provider.availableSlots.some(
            (slot) => slot.cost === "free" || (typeof slot.cost === "number" && slot.cost <= 25),
          ))

      return hasMatchingServices && isWithinDistance && hasSuitableCost
    })

    // Sort by relevance (combination of distance, ratings, and availability)
    matchedProviders = matchedProviders.sort((a, b) => {
      const distanceA = calculateDistance(
        patient.location.latitude,
        patient.location.longitude,
        a.location.latitude,
        a.location.longitude,
      )

      const distanceB = calculateDistance(
        patient.location.latitude,
        patient.location.longitude,
        b.location.latitude,
        b.location.longitude,
      )

      // Calculate a score (lower is better)
      const scoreA = distanceA * 0.5 - a.ratings * 0.3 - a.availableSlots.length * 0.2
      const scoreB = distanceB * 0.5 - b.ratings * 0.3 - b.availableSlots.length * 0.2

      return scoreA - scoreB
    })

    // Return top recommendations
    return NextResponse.json({
      recommendations: matchedProviders.slice(0, 5).map((provider) => ({
        id: provider.id,
        name: provider.name,
        specialty: provider.specialty,
        address: provider.location.address,
        distance:
          calculateDistance(
            patient.location.latitude,
            patient.location.longitude,
            provider.location.latitude,
            provider.location.longitude,
          ).toFixed(1) + " miles",
        nextAvailable: provider.availableSlots[0]
          ? `${provider.availableSlots[0].date} at ${provider.availableSlots[0].time}`
          : "No availability",
        cost: provider.availableSlots.some((slot) => slot.cost === "free")
          ? "Free options available"
          : "Starting at $" +
            Math.min(
              ...provider.availableSlots
                .filter((slot) => typeof slot.cost === "number")
                .map((slot) => slot.cost as number),
            ),
      })),
    })
  } catch (error) {
    console.error("Error in recommendations API:", error)
    return NextResponse.json({ error: "Failed to process recommendation request" }, { status: 500 })
  }
}
