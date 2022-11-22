<script setup lang="ts">
import { type Ref, ref, onBeforeMount, computed } from 'vue'
import ContactComponent from '@/components/ContactComponent.vue'
import OpenedContactComponent from '@/components/OpenedContactComponent.vue'
import AddContactComponent from '@/components/AddContactComponent.vue'
import PhantomContactComponent from '@/components/PhantomContact.vue'
import type { ContactInterface } from '@/types/Contact.interface'
import { useOpenedContact } from '@/stores/openedContact'
import { usePhantomContact } from '@/stores/phantomContact'
import { useUser } from '@/stores/user'
import { useRouter } from 'vue-router'
import { LoadingOutlined } from '@ant-design/icons-vue'

const openedContactStore = useOpenedContact()
const phantomContactStore = usePhantomContact()
const activeUserStore = useUser()
const router = useRouter()

const filterText: Ref<string> = ref('')
const contacts: Ref<ContactInterface[]> = ref([])
const isLoading: Ref<boolean> = ref(false)

const filteredContacts = computed<ContactInterface[]>(() => {
  return contacts.value.filter((contact) => {
    return (
      contact.name.toLowerCase().includes(filterText.value.toLowerCase()) ||
      contact.phone?.toLowerCase().includes(filterText.value.toLowerCase()) ||
      contact.email?.toLowerCase().includes(filterText.value.toLowerCase()) ||
      contact.tags.some((tag) =>
        tag.toLowerCase().includes(filterText.value.toLowerCase())
      )
    )
  })
})

onBeforeMount(getContacts)

async function getContacts() {
  isLoading.value = true
  contacts.value = await activeUserStore.getAllContacts()
  isLoading.value = false
}
async function onDelete() {
  isLoading.value = true
  contacts.value = await activeUserStore.fetchContactsList()
  openedContactStore.removeData()
  isLoading.value = false
}
async function onSubmit() {
  isLoading.value = true
  contacts.value = await activeUserStore.fetchContactsList()
  isLoading.value = false
}

function openContact(contact: ContactInterface) {
  openedContactStore.setData(contact)
  phantomContactStore.disable()
}
function referToContact(contact: ContactInterface) {
  openContact(contact)
  router.push({ name: 'contact', params: { id: contact.id } })
}
</script>
<template>
  <div class="container">
    <div class="left-part">
      <a-row type="flex" class="left-part__upper-elements">
        <a-input
          class="filter-input"
          v-model:value="filterText"
          placeholder="Filter"
        />
        <AddContactComponent />
      </a-row>
      <PhantomContactComponent />
      <div class="splinner" v-if="isLoading">
        <LoadingOutlined size="64" />
      </div>
      <template v-for="contact in filteredContacts" :key="contact.id">
        <ContactComponent
          :contact="contact"
          @contact-click="openContact"
          class="left-bar-contact"
        />
        <ContactComponent
          :contact="contact"
          @contact-click="referToContact"
          class="full-width-contact"
        />
      </template>
    </div>
    <OpenedContactComponent
      @submit="onSubmit"
      @delete="onDelete"
      class="opened-contact"
    />
  </div>
</template>

<style scoped>
.left-part {
  min-width: 340px;
  padding: 0.5rem;
}
.container {
  width: 100%;
  margin: 0 auto;
  display: flex;
}
.opened-contact {
  width: calc(100% - 340px);
}
.left-part__upper-elements {
  padding-left: 5px;
}
.filter-input {
  width: calc(100% - 45px);
  margin-right: 10px;
  border-radius: 5px;
}
.full-width-contact {
  display: none;
}
.splinner {
  text-align: center;
}
@media (min-width: 1200px) {
  .container {
    min-width: 1140px;
    max-width: 1140px;
  }
}
@media (min-width: 992px) and (max-width: 1199px) {
  .container {
    min-width: 960px;
    max-width: 960px;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .container {
    min-width: 720px;
    max-width: 720px;
  }
}
@media (min-width: 540px) and (max-width: 767px) {
  .container {
    min-width: 540px;
    max-width: 540px;
  }
}
@media (max-width: 767px) {
  .opened-contact {
    display: none;
  }
  .left-bar-contact {
    display: none;
  }
  .left-part {
    width: 100%;
  }
  .full-width-contact {
    display: block;
  }
}
</style>
