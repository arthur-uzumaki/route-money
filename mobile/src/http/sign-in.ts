import { useMutation } from '@tanstack/react-query'
import { api } from '~/lib/api'

export interface SignInRequest {
  email: string
  password: string
}

interface SignInPropsResponse {
  token: string
}

export function useSignIn() {
  return useMutation({
    mutationFn: async ({ email, password }: SignInRequest) => {
      const response = await api.post<SignInPropsResponse>('/sessions', {
        email,
        password,
      })
      return response.data
    },
  })
}
