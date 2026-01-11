import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { type SignInRequest, useSignIn } from '~/http/sign-in'
import { type SignUpRequest, useSignUp } from '~/http/sign-up'
import { getToken, removeToken, saveToken } from '~/storage/token-storage'

interface AuthState {
  isLoggedIn: boolean
  isReady: boolean
  signIn: ({ email, password }: SignInRequest) => Promise<void>
  signOut: () => Promise<void>
  signUp: ({ email, name, password }: SignUpRequest) => Promise<void>
}

export const AuthContext = createContext({} as AuthState)

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const { mutateAsync: signInMutateAsync } = useSignIn()
  const { mutateAsync: signUpMutateAsync } = useSignUp()

  async function signIn({ email, password }: SignInRequest) {
    try {
      const { token } = await signInMutateAsync({ email, password })
      await saveToken(token)
      setIsLoggedIn(true)
    } catch (error) {
      throw error
    } finally {
      setIsLoggedIn(false)
    }
  }

  async function signUp({ email, name, password }: SignUpRequest) {
    try {
      await signUpMutateAsync({ email, name, password })
    } catch (error) {
      throw error
    }
  }

  async function signOut() {
    try {
      setIsLoggedIn(false)
      await removeToken()
    } catch (error) {
      throw error
    } finally {
      setIsLoggedIn(false)
    }
  }

  useEffect(() => {
    async function loadToken() {
      try {
        const storedToken = await getToken()
        setIsLoggedIn(!!storedToken)
      } catch (error) {
        console.log('Error get stored token')
      } finally {
        setIsReady(true)
      }
    }

    loadToken()
  }, [])

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isReady, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  )
}
