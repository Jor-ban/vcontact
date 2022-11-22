<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'
import type { ContactInterface } from '@/types/Contact.interface'

const emit = defineEmits(['contact-click'])
const props = defineProps<{ contact: ContactInterface }>()

const contact = computed(() => props.contact)
</script>

<template>
  <div class="contact">
    <a-row
      @click="emit('contact-click', contact)"
      type="flex"
      class="contact__inner-block"
    >
      <a-avatar size="large">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <div class="contact__data">
        <h3>{{ contact.name }}</h3>
        <p class="m-0">{{ contact.phone ?? contact.email ?? '' }}</p>
      </div>
    </a-row>
  </div>
</template>

<style scoped>
.contact {
  width: 100%;
  padding: 0.25rem;
  border-bottom: 1px solid #e8e8e8;
}

.contact__inner-block {
  padding: 0.4rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}
.contact__inner-block:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.contact__data {
  margin-left: 1rem;
}
</style>
