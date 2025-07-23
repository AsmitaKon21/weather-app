"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Gauge,
  Search,
  MapPin,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Mock weather data for different locations
const mockWeatherDatabase = {
  "san francisco": {
    location: "San Francisco, CA",
    country: "United States",
    temperature: 22,
    condition: "Partly Cloudy",
    description: "A pleasant day with some clouds",
    humidity: 65,
    windSpeed: 19,
    windDirection: "NW",
    pressure: 30.15,
    visibility: 10,
    uvIndex: 6,
    feelsLike: 24,
    forecast: [
      { day: "Today", high: 24, low: 14, condition: "Partly Cloudy", icon: "partly-cloudy" },
      { day: "Tomorrow", high: 26, low: 16, condition: "Sunny", icon: "sunny" },
      { day: "Wednesday", high: 23, low: 15, condition: "Cloudy", icon: "cloudy" },
      { day: "Thursday", high: 21, low: 13, condition: "Rainy", icon: "rainy" },
      { day: "Friday", high: 22, low: 14, condition: "Partly Cloudy", icon: "partly-cloudy" },
    ],
  },
  "new york": {
    location: "New York, NY",
    country: "United States",
    temperature: 20,
    condition: "Sunny",
    description: "Clear skies and sunshine",
    humidity: 45,
    windSpeed: 13,
    windDirection: "E",
    pressure: 30.25,
    visibility: 12,
    uvIndex: 7,
    feelsLike: 21,
    forecast: [
      { day: "Today", high: 21, low: 13, condition: "Sunny", icon: "sunny" },
      { day: "Tomorrow", high: 23, low: 14, condition: "Partly Cloudy", icon: "partly-cloudy" },
      { day: "Wednesday", high: 24, low: 16, condition: "Sunny", icon: "sunny" },
      { day: "Thursday", high: 22, low: 14, condition: "Cloudy", icon: "cloudy" },
      { day: "Friday", high: 21, low: 12, condition: "Rainy", icon: "rainy" },
    ],
  },
  london: {
    location: "London",
    country: "United Kingdom",
    temperature: 15,
    condition: "Cloudy",
    description: "Overcast with light winds",
    humidity: 78,
    windSpeed: 24,
    windDirection: "SW",
    pressure: 29.85,
    visibility: 8,
    uvIndex: 3,
    feelsLike: 14,
    forecast: [
      { day: "Today", high: 16, low: 9, condition: "Cloudy", icon: "cloudy" },
      { day: "Tomorrow", high: 17, low: 10, condition: "Rainy", icon: "rainy" },
      { day: "Wednesday", high: 14, low: 7, condition: "Rainy", icon: "rainy" },
      { day: "Thursday", high: 18, low: 11, condition: "Partly Cloudy", icon: "partly-cloudy" },
      { day: "Friday", high: 19, low: 12, condition: "Sunny", icon: "sunny" },
    ],
  },
}

const WeatherIcon = ({ condition, size = 48 }: { condition: string; size?: number }) => {
  const iconProps = { size, className: "drop-shadow-lg" }

  switch (condition.toLowerCase()) {
    case "sunny":
      return <Sun {...iconProps} className="text-yellow-400 drop-shadow-lg animate-pulse" />
    case "partly cloudy":
    case "partly-cloudy":
      return <Cloud {...iconProps} className="text-gray-300 drop-shadow-lg" />
    case "cloudy":
      return <Cloud {...iconProps} className="text-gray-400 drop-shadow-lg" />
    case "rainy":
      return <CloudRain {...iconProps} className="text-blue-400 drop-shadow-lg animate-bounce" />
    default:
      return <Sun {...iconProps} className="text-yellow-400 drop-shadow-lg" />
  }
}

export default function WeatherApp() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState(mockWeatherDatabase["san francisco"])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [locationError, setLocationError] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setLocationError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const searchKey = searchQuery.toLowerCase().trim()
    const foundWeather = mockWeatherDatabase[searchKey as keyof typeof mockWeatherDatabase]

    if (foundWeather) {
      setWeather(foundWeather)
      setSearchQuery("")
    } else {
      setLocationError(`Weather data not found for "${searchQuery}". Try "San Francisco", "New York", or "London".`)
    }

    setIsLoading(false)
  }

  const getCurrentLocation = () => {
    setIsLoading(true)
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Simulate reverse geocoding and weather fetch
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // For demo purposes, we'll just use San Francisco data
        // In a real app, you'd use the coordinates to get actual location and weather
        setWeather(mockWeatherDatabase["san francisco"])
        setIsLoading(false)
      },
      (error) => {
        setLocationError("Unable to retrieve your location. Please search manually.")
        setIsLoading(false)
      },
      { timeout: 10000 },
    )
  }

  const refreshWeather = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // In a real app, this would fetch fresh data
    setIsRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Search */}
        <div className="text-center text-white space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Weather App
          </h1>
          <p className="text-gray-300">Stay updated with current weather conditions</p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search for a city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 transition-all duration-300"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              </Button>
              <Button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                title="Use current location"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
              </Button>
            </form>

            {locationError && <p className="text-red-400 text-sm mt-2 animate-fade-in">{locationError}</p>}
          </div>
        </div>

        {/* Main Weather Card */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl hover:bg-white/10 transition-all duration-500">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div></div>
              <Button
                onClick={refreshWeather}
                disabled={isRefreshing}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <RefreshCw className={`${isRefreshing ? "animate-spin" : ""} transition-transform`} size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Main Weather Info */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                    {weather.location}
                  </h2>
                  <p className="text-gray-300">{weather.country}</p>
                  <p className="text-sm text-gray-400 mt-2">{formatDate(currentTime)}</p>
                  <p className="text-lg font-mono text-blue-300">{formatTime(currentTime)}</p>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="transform hover:scale-110 transition-transform duration-300">
                    <WeatherIcon condition={weather.condition} size={100} />
                  </div>
                  <div>
                    <div className="text-7xl font-light bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                      {weather.temperature}°
                    </div>
                    <div className="text-2xl text-gray-200">{weather.condition}</div>
                    <div className="text-gray-400">{weather.description}</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Weather Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center space-x-2 mb-2">
                    <Thermometer size={20} className="text-red-400" />
                    <span className="text-sm text-gray-300">Feels Like</span>
                  </div>
                  <div className="text-2xl font-semibold">{weather.feelsLike}°C</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets size={20} className="text-blue-400" />
                    <span className="text-sm text-gray-300">Humidity</span>
                  </div>
                  <div className="text-2xl font-semibold">{weather.humidity}%</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wind size={20} className="text-green-400" />
                    <span className="text-sm text-gray-300">Wind</span>
                  </div>
                  <div className="text-2xl font-semibold">{weather.windSpeed} km/h</div>
                  <div className="text-xs text-gray-400">{weather.windDirection}</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center space-x-2 mb-2">
                    <Gauge size={20} className="text-purple-400" />
                    <span className="text-sm text-gray-300">Pressure</span>
                  </div>
                  <div className="text-2xl font-semibold">{weather.pressure}</div>
                  <div className="text-xs text-gray-400">in Hg</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Weather Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-xl hover:bg-white/10 transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye size={20} className="text-cyan-400" />
                <span>Visibility & UV</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <span className="text-gray-300">Visibility</span>
                  <span className="font-semibold">{weather.visibility} miles</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <span className="text-gray-300">UV Index</span>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0"
                  >
                    {weather.uvIndex} High
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5-Day Forecast */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-xl hover:bg-white/10 transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                5-Day Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weather.forecast.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <WeatherIcon condition={day.icon} size={28} />
                      <span className="font-medium text-gray-200">{day.day}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-white">{day.high}°</span>
                      <span className="text-gray-400">{day.low}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p className="animate-pulse">Weather data updates automatically • Last updated: {formatTime(currentTime)}</p>
        </div>
      </div>
    </div>
  )
}
