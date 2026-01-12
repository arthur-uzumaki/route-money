import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN_STORAGE = '@myapp:token'

async function saveToken(token: string) {
  try {
    await AsyncStorage.setItem(TOKEN_STORAGE, token)
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: <Lança pra frente>
    throw error
  }
}

async function getToken() {
  try {
    const storageToken = await AsyncStorage.getItem(TOKEN_STORAGE)

    return storageToken
  } catch {
    throw null
  }
}

async function removeToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE)
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: <Lança pra frente>
    throw error
  }
}
export { saveToken, getToken, removeToken }
