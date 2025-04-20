"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MapPin, CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function TripPage() {
  const router = useRouter()
  const [tripType, setTripType] = useState("intracity")
  const [location, setLocation] = useState("")
  const [departureState, setDepartureState] = useState("")
  const [arrivalState, setArrivalState] = useState("")
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined)
  const [departureSchedule, setDepartureSchedule] = useState("today")
  const [transportMeans, setTransportMeans] = useState("")
  const [airlineName, setAirlineName] = useState("")
  const [flightNumber, setFlightNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would process the trip details
    router.push("/carrier/dashboard/find")
  }

  const needsTransportDetails = transportMeans === "airplane"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Set Trip</h1>
        <p className="text-muted-foreground">Set your trip details to connect with senders</p>
      </div>

      <Tabs defaultValue={tripType} onValueChange={setTripType}>
        <TabsList className="grid w-full grid-cols-3 text-xs md:text-sm">
          <TabsTrigger value="intracity">Intracity</TabsTrigger>
          <TabsTrigger value="interstate">Interstate</TabsTrigger>
          <TabsTrigger value="international" disabled>
            International
          </TabsTrigger>
        </TabsList>

        <TabsContent value="intracity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Intracity Delivery</CardTitle>
              <CardDescription>Set your location to receive delivery requests within your city</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Your Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="Enter your current location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" className="gap-2">
                      <MapPin className="h-4 w-4" /> Pin
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Search className="h-4 w-4" /> Find Senders
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interstate" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Interstate Delivery</CardTitle>
              <CardDescription>Set up a trip between states to find matching delivery requests</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="departure-state">Departure State</Label>
                    <Select value={departureState} onValueChange={setDepartureState} required>
                      <SelectTrigger id="departure-state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">Abuja</SelectItem>
                        <SelectItem value="rivers">Rivers</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                        <SelectItem value="oyo">Oyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrival-state">Arrival State</Label>
                    <Select value={arrivalState} onValueChange={setArrivalState} required>
                      <SelectTrigger id="arrival-state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">Abuja</SelectItem>
                        <SelectItem value="rivers">Rivers</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                        <SelectItem value="oyo">Oyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Departure Schedule</Label>
                  <RadioGroup
                    value={departureSchedule}
                    onValueChange={setDepartureSchedule}
                    className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="today" id="today" />
                      <Label htmlFor="today" className="font-normal">
                        Today
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scheduled" id="scheduled" />
                      <Label htmlFor="scheduled" className="font-normal">
                        Choose Date
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {departureSchedule === "scheduled" && (
                  <div className="space-y-2">
                    <Label>Departure Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !departureDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {departureDate ? format(departureDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={departureDate}
                          onSelect={setDepartureDate}
                          initialFocus
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return date < today
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="transport-means">Means of Transport</Label>
                  <Select value={transportMeans} onValueChange={setTransportMeans} required>
                    <SelectTrigger id="transport-means">
                      <SelectValue placeholder="Select transport means" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="airplane">Airplane</SelectItem>
                      <SelectItem value="train">Train</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {needsTransportDetails && (
                  <div className="space-y-4 border rounded-lg p-4">
                    <h3 className="text-sm font-medium">Flight Details</h3>

                    <div className="space-y-2">
                      <Label htmlFor="airline-name">Airline Name</Label>
                      <Input
                        id="airline-name"
                        placeholder="Enter airline name"
                        value={airlineName}
                        onChange={(e) => setAirlineName(e.target.value)}
                        required={needsTransportDetails}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="flight-number">Flight Number</Label>
                      <Input
                        id="flight-number"
                        placeholder="Enter flight number"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                        required={needsTransportDetails}
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full gap-2">
                  <Search className="h-4 w-4" /> Find Senders
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="international" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>International Delivery</CardTitle>
              <CardDescription>This feature is coming soon! Stay tuned for updates.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="rounded-full bg-muted p-4">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Coming Soon</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We're working on expanding our services to international deliveries. This feature will be available
                soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
