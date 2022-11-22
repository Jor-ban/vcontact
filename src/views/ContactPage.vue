<script setup lang="ts">
import { useOpenedContact } from '@/stores/openedContact'
import { useRoute, useRouter } from 'vue-router'
import OpenedContactComponent from '@/components/OpenedContactComponent.vue'
import { RouterLink } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { onMounted } from 'vue'

const openedContactStore = useOpenedContact()
const route = useRoute()
const router = useRouter()
onMounted(async () => {
  if (!openedContactStore.getValue()) {
    const contact = await openedContactStore.getContactById(
      String(route.params.id)
    )
    console.log(contact)
    if (!contact) {
      router.push('/')
    } else {
      console.log('setting data', contact)
      openedContactStore.setData(contact)
    }
  }
})
</script>

<template>
  <RouterLink class="back-arrow" to="/">
    <ArrowLeftOutlined />
  </RouterLink>
  <OpenedContactComponent />
</template>

<style scoped>
.back-arrow {
  position: relative;
  top: 20px;
  left: 20px;
  color: black;
}
</style>
