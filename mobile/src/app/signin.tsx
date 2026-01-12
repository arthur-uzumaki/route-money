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

const formSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type FormData = z.infer<typeof formSchema>

export default function SignIn() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function handleSignIn(data: FormData) {
    try {
      setIsPending(true)
      await signIn(data)
      router.replace('/(app)/(dashboard)')
    } catch (error) {
      console.error('Erro ao fazer login:', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 px-6">
      <Card className="w-full max-w-md border-2 border-gray-200 p-6 shadow-lg">
        <Text className="mb-6 text-center font-bold text-2xl text-gray-800">
          Faça login
        </Text>

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

        <Button
          className="mt-6"
          onPress={handleSubmit(handleSignIn)}
          disabled={isPending}
        >
          <ButtonText>{isPending ? 'Entrando...' : 'Entrar'}</ButtonText>
        </Button>

        <View className="mt-4 flex-row items-center justify-center">
          <Text className="text-gray-600 text-sm">Não tem uma conta? </Text>
          <Link href="/signup" asChild>
            <TouchableOpacity disabled={isPending}>
              <Text className="font-semibold text-blue-600 text-sm">
                Criar conta
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Card>
    </View>
  )
}
