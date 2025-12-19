import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Meter {
  id: string
  number: string
  type: 'electricity' | 'water'
  status: 'online' | 'offline' | 'error'
  lastReading: Date
  currentValue: number
  unit: string
}

interface MeterContextType {
  meters: Meter[]
  electricityMeter: Meter | null
  waterMeter: Meter | null
  updateMeterNumber: (type: 'electricity' | 'water', number: string) => void
  fetchMeterData: () => Promise<void>
  isLoading: boolean
}

const MeterContext = createContext<MeterContextType | undefined>(undefined)

export function MeterProvider({ children }: { children: ReactNode }) {
  const [meters, setMeters] = useState<Meter[]>([
    {
      id: '1',
      number: 'EM-2024-12345',
      type: 'electricity',
      status: 'online',
      lastReading: new Date(),
      currentValue: 52.3,
      unit: 'kWh'
    },
    {
      id: '2',
      number: 'WM-2024-67890',
      type: 'water',
      status: 'online',
      lastReading: new Date(),
      currentValue: 125.8,
      unit: 'gallons'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const electricityMeter = meters.find(m => m.type === 'electricity') || null
  const waterMeter = meters.find(m => m.type === 'water') || null

  const updateMeterNumber = (type: 'electricity' | 'water', number: string) => {
    setMeters(prev => 
      prev.map(meter => 
        meter.type === type ? { ...meter, number } : meter
      )
    )
  }

  const fetchMeterData = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to fetch real-time meter data
      // In production, this would call your backend API with meter numbers
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMeters(prev => prev.map(meter => ({
        ...meter,
        lastReading: new Date(),
        currentValue: meter.currentValue + Math.random() * 5,
        status: 'online' as const
      })))
    } catch (error) {
      console.error('Failed to fetch meter data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-fetch meter data every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMeterData()
    }, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <MeterContext.Provider
      value={{
        meters,
        electricityMeter,
        waterMeter,
        updateMeterNumber,
        fetchMeterData,
        isLoading
      }}
    >
      {children}
    </MeterContext.Provider>
  )
}

export function useMeters() {
  const context = useContext(MeterContext)
  if (context === undefined) {
    throw new Error('useMeters must be used within a MeterProvider')
  }
  return context
}
