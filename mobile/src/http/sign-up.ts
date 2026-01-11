import { useMutation } from '@tanstack/react-query'
import { api } from '~/lib/api'

interface SignUpPropsRequest {
  name: string
  email: string
  password: string
}

// biome-ignore lint/suspicious/noConfusingVoidType: <Não tem retorno da api>
type SignUpPropsResponse = void

export async function signUp() {
  return useMutation({
    mutationFn: async ({ email, password, name }: SignUpPropsRequest) => {
      const response = await api.post<SignUpPropsResponse>('/sessions', {
        name,
        email,
        password,
      })
      return response.data
    },
  })
}
