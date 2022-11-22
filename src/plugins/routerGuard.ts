import router from '@/router'
import { useAuth } from '@/stores/auth'

router.beforeEach(async (to, from, next): Promise<void> => {
  const authStore = useAuth()
  if (!authStore.isSignedIn()) {
    const user = await authStore.getUser()
    if (!user && to.name !== 'login') {
      next('/login')
      return
    } else if (user && to.name === 'login') {
      next('/')
      return
    }
  } else {
    if (to.name === 'login') {
      next('/')
      return
    }
  }
  next()
})
