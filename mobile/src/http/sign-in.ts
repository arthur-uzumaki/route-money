import { useMutation } from '@tanstack/react-query'
import { api } from '~/lib/api'

interface SigInPropsRequest {
  email: string
  password: string
}

interface SigInPropsResponse {
  token: string
}

export async function signIn() {
  return useMutation({
    mutationFn: async ({ email, password }: SigInPropsRequest) => {
      const response = await api.post<SigInPropsResponse>('/sessions', {
        email,
        password,
      })
      return response.data
    },
  })
}
