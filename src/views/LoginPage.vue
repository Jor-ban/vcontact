<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import type { RegistrationDataInterface } from '@/types/RegistrationData.interface'
import { AuthFormGuard } from '@/utils/AuthFormGuard'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuth()
const router = useRouter()

const activeKey = ref('register')
const errorMessage = ref<string | null>(null)
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

function getErrorMessage(actionType: 'login' | 'register'): string | null {
  if (actionType == 'register') {
    if (!AuthFormGuard.checkEmail(email.value)) {
      return 'Invalid email'
    } else if (!AuthFormGuard.checkPassword(password.value)) {
      return 'Password must contain at least 8 symbols (letters and numbers)'
    } else if (!AuthFormGuard.checkName(name.value)) {
      return 'Name must contain at least 2 letters'
    } else if (password.value != passwordConfirm.value) {
      return 'Passwords do not match'
    }
  } else {
    if (!AuthFormGuard.checkEmail(email.value)) {
      return 'Invalid email'
    }
  }
  return null
}
async function login() {
  errorMessage.value = getErrorMessage('login')
  if (!errorMessage.value) {
    authStore
      .login(email.value, password.value)
      .then(() => {
        router.push('/')
      })
      .catch((error) => {
        errorMessage.value = error.response.data ?? error.message
      })
  }
}
async function register() {
  errorMessage.value = getErrorMessage('register')
  if (!errorMessage.value) {
    const regData: RegistrationDataInterface = {
      name: name.value,
      email: email.value,
      password: password.value,
    }
    authStore
      .registrate(regData)
      .then(() => {
        router.push('/')
      })
      .catch((error) => {
        errorMessage.value = error.response.data ?? error.message
      })
  }
}
</script>

<template>
  <div class="login">
    <a-result
      status="404"
      sub-title="I can't recognize you. Please enter the system."
    >
      <template #extra>
        <div class="card-container">
          <a-alert
            v-if="errorMessage"
            banner
            :message="errorMessage"
            closable
            class="message"
          />
          <a-tabs v-model:activeKey="activeKey" type="card" centered>
            <a-tab-pane key="login" tab="Login">
              <form @submit.prevent="login()">
                <a-input
                  v-model:value="email"
                  placeholder="email"
                  class="input-field"
                  type="email"
                />
                <a-input
                  v-model:value="password"
                  placeholder="password"
                  class="input-field"
                  type="password"
                />
                <a-button type="primary" html-type="submit"> Login </a-button>
              </form>
            </a-tab-pane>
            <a-tab-pane key="register" tab="Registration">
              <form @submit.prevent="register()">
                <a-input
                  v-model:value="name"
                  placeholder="name"
                  class="input-field"
                  type="text"
                />
                <a-input
                  v-model:value="email"
                  placeholder="email"
                  class="input-field"
                  type="email"
                />
                <a-input
                  v-model:value="password"
                  placeholder="password"
                  class="input-field"
                  type="password"
                />
                <a-input
                  v-model:value="passwordConfirm"
                  placeholder="repeat password"
                  class="input-field"
                  type="password"
                />
                <a-button type="primary" html-type="submit">
                  Register
                </a-button>
              </form>
            </a-tab-pane>
          </a-tabs>
        </div>
      </template>
    </a-result>
  </div>
</template>

<style scoped>
.card-container {
  margin: 0 auto;
  width: 300px;
}
.message {
  margin-bottom: 24px;
}
.input-field {
  margin-bottom: 10px;
}
</style>
