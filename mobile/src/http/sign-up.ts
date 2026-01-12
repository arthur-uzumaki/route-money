import { useMutation } from '@tanstack/react-query'
import { api } from '~/lib/api'

export interface SignUpRequest {
  name: string
  email: string
  password: string
}

// biome-ignore lint/suspicious/noConfusingVoidType: <Não tem retorno da api>
type SignUpResponse = void

export function useSignUp() {
  return useMutation({
    mutationFn: async ({ email, password, name }: SignUpRequest) => {
      const response = await api.post<SignUpResponse>('/registers', {
        name,
        email,
        password,
      })
      return response.data
    },
  })
}
