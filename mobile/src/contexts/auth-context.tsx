import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { type SignInRequest, useSignIn } from '~/http/sign-in'
import { type SignUpRequest, useSignUp } from '~/http/sign-up'
import { getToken, removeToken, saveToken } from '~/storage/token-storage'
import { isTokenExpired } from '~/utils/is-token-expired'

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
      await removeToken()
      setIsLoggedIn(false)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    async function loadToken() {
      const storedToken = await getToken()

      if (!storedToken) {
        setIsLoggedIn(false)
        setIsReady(true)
        return
      }

      if (isTokenExpired(storedToken)) {
        await removeToken()
        setIsLoggedIn(false)
      } else {
        setIsLoggedIn(true)
      }

      setIsReady(true)
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
