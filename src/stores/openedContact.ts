import type { ContactInterface } from './../types/Contact.interface'
import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useOpenedContact = defineStore('openedContact', () => {
  const data = ref<ContactInterface | null>(null)
  const isBeingEdited = ref(false)

  function setData(contact: ContactInterface) {
    data.value = contact
    isBeingEdited.value = false
  }
  function removeData() {
    data.value = null
    isBeingEdited.value = false
  }
  function getRef(): Ref<null | ContactInterface> {
    return data
  }
  function getValue(): null | ContactInterface {
    return data.value
  }

  function enableEditing() {
    isBeingEdited.value = true
  }
  function disableEditing() {
    isBeingEdited.value = false
  }

  async function updateContact(contact: ContactInterface) {
    await axios.patch('contact', contact, {
      params: {
        id: contact.id,
      },
    })
  }
  async function deleteContact(contact: ContactInterface) {
    await axios.delete('contact', {
      params: {
        id: contact.id,
      },
    })
  }
  async function getContactById(id: string): Promise<ContactInterface> {
    const response = await axios.get<ContactInterface>('contact', {
      params: {
        id,
      },
    })
    console.log({ response })
    return response.data
  }

  return {
    getRef,
    getValue,
    setData,
    removeData,
    updateContact,
    enableEditing,
    disableEditing,
    isBeingEdited,
    deleteContact,
    getContactById,
  }
})
