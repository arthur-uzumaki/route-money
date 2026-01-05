import type { Trip } from '~/app/(app)/(dashboard)/earnings-chart'

export function getDailyData(trips: Trip[]) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const map = new Map<string, number>()

  // inicializa todos os dias do mês com 0
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    const key = date.toISOString().split('T')[0]
    map.set(key, 0)
  }

  // soma apenas trips do mês atual
  trips.forEach(trip => {
    const date = new Date(trip.date)

    if (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      const key = date.toISOString().split('T')[0]
      map.set(key, (map.get(key) || 0) + trip.netValue)
    }
  })

  return Array.from(map.entries()).map(([date, value]) => ({
    label: new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
    }),
    value: Number(value.toFixed(2)),
  }))
}

export function getMonthlyData(trips: Trip[]) {
  const map = new Map<string, number>()

  trips.forEach(trip => {
    const date = new Date(trip.date)
    if (isNaN(date.getTime())) return

    const key = `${date.getFullYear()}-${date.getMonth()}`
    map.set(key, (map.get(key) || 0) + trip.netValue)
  })

  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([key, value]) => {
      const [year, month] = key.split('-')
      const date = new Date(Number(year), Number(month))

      return {
        label: date.toLocaleDateString('pt-BR', { month: 'short' }),
        value: Math.round(value * 100) / 100,
      }
    })
}
