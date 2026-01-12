import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'
import z from 'zod'
import { Button, ButtonText } from '../ui/button'
import { Card } from '../ui/card'
import { Input, InputField } from '../ui/input'

const formSchema = z
  .object({
    name: z
      .string()
      .optional()
      .refine(
        value =>
          typeof value === 'string' && value.trim().split(' ').length >= 2,
        'Nome completo é obrigatório'
      ),
    email: z.email('Email inválido').min(1, 'Email é obrigatório'),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirm_password: z.string().optional(),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  })

type FormData = z.infer<typeof formSchema>

interface AuthFormProps {
  labelName?: string
  labelPassword: string
  labelEmail: string
  title: string
  buttonText: string
  showConfirmPassword?: boolean
  onSubmit: (data: FormData) => void
  hasAccount?: boolean
  onPressSwitchAuth?: () => void
}

export function AuthForm({
  labelEmail,
  labelPassword,
  title,
  labelName,
  buttonText,
  showConfirmPassword = false,
  onSubmit,
  hasAccount = false,
  onPressSwitchAuth,
}: AuthFormProps) {
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

  return (
    <Card className="w-full max-w-md p-6">
      <Text className="mb-6 text-center text-2xl font-bold">{title}</Text>

      {labelName && (
        <>
          <Text className="mb-2 text-sm font-medium">{labelName}</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input className="mb-1">
                <InputField
                  placeholder="Digite seu nome completo"
                  value={value}
                  onChangeText={onChange}
                />
              </Input>
            )}
          />
          {errors.name && (
            <Text className="mb-4 text-sm text-red-500">
              {errors.name.message}
            </Text>
          )}
        </>
      )}

      <Text className="mb-2 text-sm font-medium">{labelEmail}</Text>
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
            />
          </Input>
        )}
      />
      {errors.email && (
        <Text className="mb-4 text-sm text-red-500">
          {errors.email.message}
        </Text>
      )}

      <Text className="mb-2 text-sm font-medium">{labelPassword}</Text>
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
            />
          </Input>
        )}
      />
      {errors.password && (
        <Text className="mb-4 text-sm text-red-500">
          {errors.password.message}
        </Text>
      )}

      {showConfirmPassword && (
        <>
          <Text className="mb-2 text-sm font-medium">Confirmar Senha</Text>
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
                />
              </Input>
            )}
          />
          {errors.confirm_password && (
            <Text className="mb-4 text-sm text-red-500">
              {errors.confirm_password.message}
            </Text>
          )}
        </>
      )}

      <Button className="mt-6" onPress={handleSubmit(onSubmit)}>
        <ButtonText>{buttonText}</ButtonText>
      </Button>

      {onPressSwitchAuth && (
        <View className="mt-4 flex-row justify-center">
          <Text className="text-sm text-gray-600">
            {hasAccount ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
          </Text>
          <Text
            className="text-sm font-semibold text-blue-600"
            onPress={onPressSwitchAuth}
          >
            {hasAccount ? 'Entrar' : 'Criar conta'}
          </Text>
        </View>
      )}
    </Card>
  )
}
