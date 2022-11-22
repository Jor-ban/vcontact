<script lang="ts" setup>
import { useOpenedContact } from '@/stores/openedContact'
import {
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
  MoreOutlined,
  PhoneOutlined,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import type { ContactInterface } from '@/types/Contact.interface'
import { ref, type Ref } from 'vue'
import { usePhantomContact } from '@/stores/phantomContact'
import { ContactFormGuard } from '@/utils/ContactFormGuard'

const openedContactStore = useOpenedContact()
const phantomContactStore = usePhantomContact()
const emit = defineEmits(['cancel', 'submit', 'delete'])

const contact: Ref<ContactInterface | null> = openedContactStore.getRef()
const editingData: Ref<ContactInterface> = ref({} as ContactInterface)
const errorMessage: Ref<string | null> = ref(null)

function startEditing() {
  if (contact.value) {
    editingData.value = {
      name: contact.value.name,
      phone: contact.value.phone ?? '',
      email: contact.value.email ?? '',
      tags: contact.value.tags,
    }
    openedContactStore.enableEditing()
  }
}

function removeTag(tag: string) {
  editingData.value.tags = editingData.value.tags.filter(
    (tagName) => tagName !== tag
  )
}
async function deleteContact() {
  if (contact.value)
    await openedContactStore.deleteContact({ ...contact.value })
  emit('delete', contact)
}
function cancelChange() {
  if (contact.value) {
    if (!phantomContactStore.beingShown) {
      editingData.value = { ...contact.value }
    } else {
      openedContactStore.removeData()
    }
  }
  phantomContactStore.disable()
  openedContactStore.disableEditing()
  emit('cancel')
}
async function submitChange() {
  errorMessage.value = getErrorMessage()
  if (contact.value && !errorMessage.value) {
    contact.value.name = editingData.value.name
    contact.value.phone = editingData.value.phone
    contact.value.email = editingData.value.email
    contact.value.tags = editingData.value.tags ?? []
    try {
      if (phantomContactStore.beingShown) {
        // if its a new contact
        await phantomContactStore.uploadContact(contact.value)
        openedContactStore.removeData()
      } else {
        await openedContactStore.updateContact({
          ...editingData.value,
          id: contact.value.id,
        })
        openedContactStore.disableEditing()
      }
      phantomContactStore.disable()
      emit('submit', editingData.value)
    } catch (e: unknown) {
      errorMessage.value = 'Problems with network'
    }
  }
}
function getErrorMessage(): string | null {
  if (!ContactFormGuard.isNameValid(editingData.value.name)) {
    return 'Name is required'
  } else if (!editingData.value.phone && !editingData.value.email) {
    return 'Phone or email is required'
  } else if (
    editingData.value.phone &&
    !ContactFormGuard.checkPhone(editingData.value.phone)
  ) {
    return 'Phone is invalid'
  } else if (
    editingData.value.email &&
    !ContactFormGuard.checkEmail(editingData.value.email)
  ) {
    return 'Email is invalid'
  }
  return null
}
</script>

<template>
  <a-row v-if="contact" type="flex" justify="space-around">
    <div class="contact-info">
      <a-avatar :size="64" class="contact-info__avatar">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <h1
        :contentEditable="openedContactStore.isBeingEdited"
        placeholder="Contact name"
        class="contact-info__header__name field"
        @input="editingData.name = $event.target.innerText"
      >
        {{ contact.name }}
      </h1>
      <div class="contact-info__detailed-data">
        <div>
          <a-row
            type="flex"
            align="middle"
            v-if="contact.phone || openedContactStore.isBeingEdited"
            class="field-block"
          >
            <PhoneOutlined class="contact-info__icon" />
            <span
              @input="editingData.phone = $event.target.innerText"
              class="field"
              :contentEditable="openedContactStore.isBeingEdited"
            >
              {{ contact.phone }}
            </span>
          </a-row>
          <a-row
            type="flex"
            align="middle"
            v-if="contact.email || openedContactStore.isBeingEdited"
            class="field-block"
          >
            <MailOutlined class="contact-info__icon" />
            <span
              @input="editingData.email = $event.target.innerText"
              class="field"
              :contentEditable="openedContactStore.isBeingEdited"
            >
              {{ contact.email }}
            </span>
          </a-row>
          <div v-if="contact.tags?.length && !openedContactStore.isBeingEdited">
            <a-row type="flex" class="tags">
              <TagOutlined class="contact-info__icon" />
              <a-tag
                v-for="tag in contact.tags"
                :key="tag"
                :closable="openedContactStore.isBeingEdited"
                @close="removeTag(tag)"
                class="tag"
              >
                {{ tag }}
              </a-tag>
            </a-row>
          </div>
          <div v-else-if="openedContactStore.isBeingEdited">
            <a-select
              v-model:value="editingData.tags"
              mode="tags"
              placeholder="Add tags to contact"
              class="tags"
            ></a-select>
            <a-alert
              v-if="errorMessage"
              banner
              :message="errorMessage"
              closable
              class="message"
            />
            <div class="submit-btns">
              <a-button type="link" danger @click="cancelChange()"
                >Cancel</a-button
              >
              <a-button type="primary" @click="submitChange()">Submit</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dropdown-options">
      <a-dropdown>
        <a-button type="text" @click.prevent>
          <MoreOutlined />
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="javascript:;" @click.prevent="startEditing()">
                <EditOutlined class="contact-info__icon" />
                Edit contact data
              </a>
            </a-menu-item>
            <a-menu-item>
              <a
                href="javascript:;"
                class="red"
                @click.prevent="deleteContact()"
              >
                <DeleteOutlined class="contact-info__icon" />Delete contact</a
              >
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-row>
</template>

<style scoped>
[contenteditable='true']:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
  color: grey;
}
[contenteditable='true'] {
  outline: none;
  box-shadow: 0 0 0 1px #d9d9d9;
}
.tags {
  width: 300px;
}
.field-block {
  margin-bottom: 10px;
}
.field {
  min-width: 200px;
  min-height: 25px;
  display: inline-block;
  border-radius: 4px;
  padding: 0.1rem 0.5rem;
}
.contact-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.message {
  margin-top: 20px;
}
.contact-info__header__name {
  text-align: center;
  width: 300px;
  max-width: 300px;
}
.contact-info__avatar {
  margin: 10px;
}
.contact-info__icon {
  margin-right: 10px;
}
.dropdown-options {
  padding-top: 30px;
}
.red {
  color: rgb(182, 0, 0);
}
.red:hover {
  color: rgb(100, 5, 5);
}
.submit-btns {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
}
@media (max-width: 991px) {
  .dropdown-options {
    max-height: max-content;
    position: fixed;
    padding-top: 0;
    top: 20px;
    right: 30px;
  }
}
@media (max-width: 767px) {
  .contact-info {
    padding: 0;
  }
  .contact-info__header__name {
    width: 100%;
    max-width: 100%;
  }
  .tags {
    width: 100%;
  }
}
</style>
