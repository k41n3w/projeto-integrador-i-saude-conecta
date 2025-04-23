"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Search } from "lucide-react"

export default function PatientDashboard() {
  // Mock data for appointments
  const upcomingAppointments = [
    {
      id: 1,
      providerName: "Community Health Clinic",
      providerAddress: "123 Main St, Anytown, USA",
      date: "May 12, 2023",
      time: "2:30 PM",
      service: "General Checkup",
    },
    {
      id: 2,
      providerName: "Neighborhood Medical Center",
      providerAddress: "456 Oak Ave, Anytown, USA",
      date: "May 20, 2023",
      time: "10:15 AM",
      service: "Vaccination",
    },
  ]

  const pastAppointments = [
    {
      id: 1,
      providerName: "Wellness Care Clinic",
      providerAddress: "789 Pine Rd, Anytown, USA",
      date: "April 15, 2023",
      time: "3:45 PM",
      service: "Blood Test",
    },
    {
      id: 2,
      providerName: "Community Health Clinic",
      providerAddress: "123 Main St, Anytown, USA",
      date: "March 22, 2023",
      time: "11:30 AM",
      service: "Annual Physical",
    },
  ]

  // Mock data for recommended providers
  const recommendedProviders = [
    {
      id: 1,
      name: "Community Health Clinic",
      specialty: "General Practice",
      address: "123 Main St, Anytown, USA",
      distance: "2.3 miles",
      nextAvailable: "Tomorrow, 10:00 AM",
    },
    {
      id: 2,
      name: "Neighborhood Medical Center",
      specialty: "Pediatrics",
      address: "456 Oak Ave, Anytown, USA",
      distance: "3.5 miles",
      nextAvailable: "Today, 2:30 PM",
    },
    {
      id: 3,
      name: "Wellness Care Clinic",
      specialty: "Family Medicine",
      address: "789 Pine Rd, Anytown, USA",
      distance: "5.1 miles",
      nextAvailable: "Thursday, 9:15 AM",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <p className="text-muted-foreground">Manage your healthcare appointments and find care</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>You have {upcomingAppointments.length} upcoming appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/search">
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Find New Care
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Health Records</CardTitle>
            <CardDescription>Access your medical history</CardDescription>
          </CardHeader>
          <CardContent className="h-24 flex items-center justify-center">
            <p className="text-center text-muted-foreground">Your health records will appear here</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Records
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Care Recommendations</CardTitle>
            <CardDescription>Personalized for your needs</CardDescription>
          </CardHeader>
          <CardContent className="h-24 flex flex-col justify-center">
            <p className="text-muted-foreground mb-2">Based on your profile:</p>
            <p>Annual physical checkup</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Recommendations
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>View and manage your appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="rounded-lg border p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{appointment.providerName}</h3>
                          <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {appointment.service}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                            <span>{appointment.providerAddress}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Reschedule
                          </Button>
                          <Button variant="destructive" size="sm" className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You have no upcoming appointments</p>
                    <Link href="/search">
                      <Button>Find Care</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="past">
                {pastAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <div key={appointment.id} className="rounded-lg border p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{appointment.providerName}</h3>
                          <div className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                            {appointment.service}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                            <span>{appointment.providerAddress}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You have no past appointments</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Providers</CardTitle>
            <CardDescription>Based on your location and needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedProviders.map((provider) => (
                <div key={provider.id} className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">{provider.name}</h3>
                  <div className="text-sm text-muted-foreground mb-1">{provider.specialty}</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p>{provider.address}</p>
                        <p className="text-muted-foreground">{provider.distance}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>
                        <span className="font-medium">Next Available:</span> {provider.nextAvailable}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" className="w-full">
                      Book Appointment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/search">
              <Button variant="outline" className="w-full">
                View All Providers
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
