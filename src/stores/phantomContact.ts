import type { ContactInterface } from '@/types/Contact.interface'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePhantomContact = defineStore('phantomContact', () => {
  const beingShown = ref(false)

  function enable() {
    beingShown.value = true
  }
  function disable() {
    beingShown.value = false
  }
  async function uploadContact(contact: ContactInterface) {
    axios.post('contact', contact)
  }
  return {
    beingShown,
    enable,
    disable,
    uploadContact,
  }
})
