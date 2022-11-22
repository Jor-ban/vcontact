import type { ContactInterface } from '@/types/Contact.interface'
import type { UserDataInterface } from '@/types/UserData.interface'
import { useAuth } from '@/stores/auth'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import axios from 'axios'

export const useUser = defineStore('user', () => {
  const authStore = useAuth()
  const contactsList = ref<ContactInterface[]>([])

  const user: Ref<UserDataInterface | null> = authStore.getUserRef()
  function getUser(): UserDataInterface | null {
    return user.value
  }
  async function getAllContacts(): Promise<ContactInterface[]> {
    if (contactsList.value.length === 0) {
      const data = await fetchContactsList()
      contactsList.value = data
    }
    return contactsList.value
  }
  async function fetchContactsList(): Promise<ContactInterface[]> {
    const res = await axios.get<ContactInterface[]>('getAllContacts')
    contactsList.value = res.data
    return res.data
  }
  return {
    getUser,
    getAllContacts,
    fetchContactsList,
  }
})
