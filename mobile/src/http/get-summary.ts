import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'

interface GetSummaryRequest {
  month?: number
  year?: number
}

interface GetSummaryResponse {
  monthTotal: number
  yearTotal: number
  dailyAverage: number
  monthProjection: number

  earningsLast30Days: {
    date: string
    total: number
  }[]

  earningsLast12Months: {
    month: string
    total: number
  }[]

  earningsByPlatform: {
    platform: string
    total: number
    percentage: number
  }[]

  recentRides: {
    id: string
    platform: string
    value: number
  }[]
}

export function getSummary(params: GetSummaryRequest) {
  return useQuery<GetSummaryResponse>({
    queryKey: ['get-summary', params],
    queryFn: async ({ queryKey }) => {
      const [, { month, year }] = queryKey as [string, GetSummaryRequest]

      const query = new URLSearchParams()

      if (month) query.append('month', String(month))
      if (year) query.append('year', String(year))

      const response = await api.get<GetSummaryResponse>(
        `/reports/summary?${query.toString()}`
      )

      return response.data
    },
  })
}
