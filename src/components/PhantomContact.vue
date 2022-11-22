<script setup lang="ts">
import { usePhantomContact } from '@/stores/phantomContact'
import { UserAddOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'

const phantomContactStore = usePhantomContact()
const isActive = computed(() => phantomContactStore.beingShown)
</script>

<template>
  <div :class="['phantom-contact', isActive ? 'active' : 'inactive']">
    <a-row type="flex" class="phantom-contact__inner-block">
      <a-avatar size="large">
        <template #icon><UserAddOutlined /></template>
      </a-avatar>
      <div class="phantom-contact__data">
        <h3>New Contact</h3>
        <p class="m-0">___</p>
      </div>
    </a-row>
  </div>
</template>

<style scoped>
.phantom-contact {
  opacity: 0.5 !important;
  width: 100%;
  padding: 0.25rem;
  border-bottom: 1px solid #e8e8e8;
  transform: scaleY(0);
  height: 0;
  transition: height 0.5s;
}
.phantom-contact.active {
  transform: scaleY(1);
  animation-name: scale-in-ver-top;
  animation-duration: 0.5s;
  height: 80px;
}
.phantom-contact.inactive {
  transform: scaleY(0);
  animation-name: scale-out-ver-top;
  animation-duration: 0.5s;
  height: 0;
}

.phantom-contact__inner-block {
  padding: 0.4rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}
.phantom-contact__inner-block:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.phantom-contact.active > .phantom-contact__inner-block {
  background-color: var(--active);
}
.phantom-contact__data {
  margin-left: 1rem;
}
@-webkit-keyframes scale-in-ver-top {
  0% {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
}
@keyframes scale-in-ver-top {
  0% {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
}

@keyframes scale-out-ver-top {
  0% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
}
</style>
