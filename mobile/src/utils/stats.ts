export type Platform = 'uber' | 'ifood' | '99' | 'rappi' | 'outro'

export type TripType = 'corrida' | 'entrega'

export interface Trip {
  id: string
  userId: string
  platform: Platform
  type: TripType
  date: string // ISO date string
  grossValue: number
  fees: number
  netValue: number
  duration?: number // em minutos
  notes?: string
  createdAt: string
}

export interface MonthlyStats {
  month: string // YYYY-MM
  totalGross: number
  totalNet: number
  totalFees: number
  tripCount: number
  averagePerDay: number
  averagePerTrip: number
}

export interface PlatformStats {
  platform: Platform
  totalGross: number
  totalNet: number
  tripCount: number
  percentage: number
}

export function calculateMonthlyStats(trips: Trip[]): MonthlyStats[] {
  const grouped = new Map<string, Trip[]>()

  trips.forEach(trip => {
    const month = trip.date.substring(0, 7) // YYYY-MM
    if (!grouped.has(month)) {
      grouped.set(month, [])
    }
    grouped.get(month)!.push(trip)
  })

  return Array.from(grouped.entries())
    .map(([month, monthTrips]) => {
      const totalGross = monthTrips.reduce((sum, t) => sum + t.grossValue, 0)
      const totalFees = monthTrips.reduce((sum, t) => sum + t.fees, 0)
      const totalNet = monthTrips.reduce((sum, t) => sum + t.netValue, 0)

      // Calcular dias únicos no mês
      const uniqueDays = new Set(monthTrips.map(t => t.date.substring(0, 10)))
        .size

      return {
        month,
        totalGross,
        totalNet,
        totalFees,
        tripCount: monthTrips.length,
        averagePerDay: uniqueDays > 0 ? totalNet / uniqueDays : 0,
        averagePerTrip:
          monthTrips.length > 0 ? totalNet / monthTrips.length : 0,
      }
    })
    .sort((a, b) => b.month.localeCompare(a.month))
}

export function calculatePlatformStats(trips: Trip[]): PlatformStats[] {
  const grouped = new Map<Platform, Trip[]>()

  trips.forEach(trip => {
    if (!grouped.has(trip.platform)) {
      grouped.set(trip.platform, [])
    }
    grouped.get(trip.platform)!.push(trip)
  })

  const totalGross = trips.reduce((sum, t) => sum + t.grossValue, 0)

  return Array.from(grouped.entries())
    .map(([platform, platformTrips]) => {
      const platformGross = platformTrips.reduce(
        (sum, t) => sum + t.grossValue,
        0
      )

      return {
        platform,
        totalGross: platformGross,
        totalNet: platformTrips.reduce((sum, t) => sum + t.netValue, 0),
        tripCount: platformTrips.length,
        percentage: totalGross > 0 ? (platformGross / totalGross) * 100 : 0,
      }
    })
    .sort((a, b) => b.totalGross - a.totalGross)
}

export function getCurrentMonthTrips(trips: Trip[]): Trip[] {
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return trips.filter(t => t.date.startsWith(currentMonth))
}

export function getCurrentYearTrips(trips: Trip[]): Trip[] {
  const currentYear = new Date().getFullYear().toString()
  return trips.filter(t => t.date.startsWith(currentYear))
}

export function filterTripsByDateRange(
  trips: Trip[],
  startDate: string,
  endDate: string
): Trip[] {
  return trips.filter(t => t.date >= startDate && t.date <= endDate)
}
