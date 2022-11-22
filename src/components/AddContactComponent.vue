<script setup lang="ts">
import { useOpenedContact } from '@/stores/openedContact'
import { usePhantomContact } from '@/stores/phantomContact'
import { UserAddOutlined } from '@ant-design/icons-vue'

const phantomContactStore = usePhantomContact()
const openedContactStore = useOpenedContact()

function addContact() {
  phantomContactStore.enable()
  openedContactStore.setData({
    name: '',
    phone: '',
    email: '',
    tags: [],
  })
  openedContactStore.enableEditing()
}
</script>

<template>
  <button @click="addContact()" class="add-btn"><UserAddOutlined /></button>
</template>

<style scoped>
.add-btn {
  cursor: pointer;
  width: 30px;
  height: 30px;
  font-size: 16px;
  color: white;
  border: none;
  background: rgb(40, 173, 40);
  border-radius: 5px;
}
</style>
