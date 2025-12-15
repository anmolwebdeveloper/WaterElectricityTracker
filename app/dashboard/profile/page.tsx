"use client"

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useHousehold } from '@/context/household'

export default function ProfilePage() {
  const { user, electricityReading, waterReading } = useHousehold()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Profile</h2>
        <Button variant="outline">Edit</Button>
      </div>

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-semibold mt-1">{user.name}</p>

            <p className="text-sm text-muted-foreground mt-4">Email</p>
            <p className="font-semibold mt-1 break-words">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Total Electricity</p>
            <p className="font-semibold mt-1">{electricityReading.toFixed(1)} kWh</p>

            <p className="text-sm text-muted-foreground mt-4">Total Water</p>
            <p className="font-semibold mt-1">{waterReading.toFixed(1)} Liters</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
