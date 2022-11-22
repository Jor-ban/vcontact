import type { RegistrationDataInterface } from './../types/RegistrationData.interface'
import type { UserDataInterface } from './../types/UserData.interface'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useCookies } from 'vue3-cookies'
import axios from 'axios'

export const useAuth = defineStore('auth', () => {
  const { cookies } = useCookies()

  const user = ref<UserDataInterface | null>(null)

  function setUser(newUser: UserDataInterface) {
    user.value = newUser
  }

  function getUserRef(): Ref<UserDataInterface | null> {
    return user
  }
  async function getUser(): Promise<UserDataInterface | null> {
    if (!user.value) {
      const token = cookies.get('token')
      if (token) {
        axios.defaults.headers.common['access_token'] = token
        try {
          const res = await axios.get<UserDataInterface>('getUser')
          setUser(res.data)
          return res.data
        } catch (_e) {
          removeToken()
          return null
        }
      } else {
        return null
      }
    }
    return user.value
  }
  async function login(
    email: string,
    password: string
  ): Promise<UserDataInterface> {
    const res = await axios.post<UserDataInterface>('login', {
      email,
      password,
    })
    setUser(res.data)
    setToken(res.data.token)
    return res.data
  }
  async function registrate(
    regData: RegistrationDataInterface
  ): Promise<UserDataInterface> {
    const res = await axios.post<UserDataInterface>('registrate', regData)
    setUser(res.data)
    setToken(res.data.token)
    return res.data
  }
  function setToken(token: string) {
    cookies.set('token', token, 60 * 60 * 24 * 365)
    axios.defaults.headers.common['access_token'] = token
  }
  function removeToken() {
    cookies.remove('token')
    delete axios.defaults.headers.common['access_token']
  }
  function isSignedIn(): boolean {
    return Boolean(user.value)
  }

  return {
    removeToken,
    getUser,
    getUserRef,
    isSignedIn,
    login,
    registrate,
  }
})
