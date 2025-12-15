"use client"

import React, { createContext, useContext, useState } from "react"

type HouseholdContextType = {
  electricityReading: number
  waterReading: number
  addReading: (elec: number, water: number) => void
  resetReadings: () => void
  user: { name: string; email: string }
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined)

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const [electricityReading, setElectricityReading] = useState(0)
  const [waterReading, setWaterReading] = useState(0)

  const addReading = (elec: number, water: number) => {
    if (elec > 0) setElectricityReading((p) => p + elec)
    if (water > 0) setWaterReading((p) => p + water)
  }

  const resetReadings = () => {
    setElectricityReading(0)
    setWaterReading(0)
  }

  const user = { name: "Anmol", email: "anmol@wattsflow.com" }

  return (
    <HouseholdContext.Provider value={{ electricityReading, waterReading, addReading, resetReadings, user }}>
      {children}
    </HouseholdContext.Provider>
  )
}

export function useHousehold() {
  const ctx = useContext(HouseholdContext)
  if (!ctx) throw new Error("useHousehold must be used within HouseholdProvider")
  return ctx
}
