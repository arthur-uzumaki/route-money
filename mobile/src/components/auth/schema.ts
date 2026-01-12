import z from 'zod'

export const createAuthSchema = (isRegister: boolean) => {
  const baseSchema = {
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  }

  if (!isRegister) {
    // LOGIN
    return z.object(baseSchema)
  }

  // REGISTRO
  return z
    .object({
      ...baseSchema,

      name: z
        .string()
        .min(1, 'Nome completo é obrigatório')
        .refine(
          value => value.trim().split(/\s+/).length >= 2,
          'Informe nome e sobrenome'
        ),

      confirm_password: z.string().min(1, 'Confirmação de senha é obrigatória'),
    })
    .refine(data => data.password === data.confirm_password, {
      message: 'As senhas não coincidem',
      path: ['confirm_password'],
    })
}
