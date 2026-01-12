import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, TouchableOpacity, View } from 'react-native'
import z from 'zod'
import { Button, ButtonText } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Input, InputField } from '~/components/ui/input'
import { useAuth } from '~/hooks/use-auth-hook'

const formSchema = z
  .object({
    name: z
      .string()
      .refine(
        value =>
          typeof value === 'string' && value.trim().split(' ').length >= 2,
        'Nome completo é obrigatório'
      ),
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirm_password: z.string(),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  })

type FormData = z.infer<typeof formSchema>

export default function SignUp() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  })

  async function handleSignUp(data: FormData) {
    try {
      setIsPending(true)
      await signUp(data)
      router.replace('/signin')
    } catch (error) {
      console.error('Erro ao fazer registro', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 px-6">
      <Card className="w-full max-w-md border-2 border-gray-200 p-6 shadow-lg">
        <Text className="mb-6 text-center font-bold text-2xl text-gray-800">
          Crie sua conta
        </Text>

        <Text className="mb-2 font-medium text-sm text-gray-700">Nome</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input className="mb-1">
              <InputField
                placeholder="Digite seu nome completo"
                value={value}
                onChangeText={onChange}
                editable={!isPending}
              />
            </Input>
          )}
        />
        {errors.name && (
          <Text className="mb-4 text-red-500 text-sm">
            {errors.name.message}
          </Text>
        )}

        <Text className="mb-2 font-medium text-sm text-gray-700">E-mail</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input className="mb-1">
              <InputField
                placeholder="Digite seu email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isPending}
              />
            </Input>
          )}
        />
        {errors.email && (
          <Text className="mb-4 text-red-500 text-sm">
            {errors.email.message}
          </Text>
        )}

        <Text className="mb-2 font-medium text-sm text-gray-700">Senha</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input className="mb-1">
              <InputField
                placeholder="Digite sua senha"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                editable={!isPending}
              />
            </Input>
          )}
        />
        {errors.password && (
          <Text className="mb-4 text-red-500 text-sm">
            {errors.password.message}
          </Text>
        )}

        <Text className="mb-2 font-medium text-sm text-gray-700">
          Confirmar Senha
        </Text>
        <Controller
          control={control}
          name="confirm_password"
          render={({ field: { onChange, value } }) => (
            <Input className="mb-1">
              <InputField
                placeholder="Confirme sua senha"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                editable={!isPending}
              />
            </Input>
          )}
        />
        {errors.confirm_password && (
          <Text className="mb-4 text-red-500 text-sm">
            {errors.confirm_password.message}
          </Text>
        )}

        <Button
          className="mt-6"
          onPress={handleSubmit(handleSignUp)}
          disabled={isPending}
        >
          <ButtonText>
            {isPending ? 'Criando conta...' : 'Criar conta'}
          </ButtonText>
        </Button>

        <View className="mt-4 flex-row items-center justify-center">
          <Text className="text-gray-600 text-sm">Já tem uma conta? </Text>
          <Link href="/signin" asChild>
            <TouchableOpacity disabled={isPending}>
              <Text className="font-semibold text-blue-600 text-sm">
                Entrar
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Card>
    </View>
  )
}
