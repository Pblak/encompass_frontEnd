<template>
  <div class="_bg-transparent
  _fixed _top-0 _right-0 _bottom-0 _left-0 _w-full _h-screen _overflow-hidden">
    <i
        v-for="(icon, index) in icons"
        :key="index"
        :class="[icon.class ,'_absolute']"
        :style="{
        left: icon.x + 'px',
        top: icon.y + 'px',
        fontSize: icon.size + 'px',
        color: icon.color,
        transform: 'rotate(' + icon.rotate + 'deg)',
        opacity: icon.opacity
      }"
    ></i>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'


// Icon Unicode map (Font Awesome 5+)
const iconClasses = [
  'fa-solid fa-list-music',
  'fa-light fa-music-note',
  'fas fa-banjo',
  'fas fa-guitar-electric',
  'fa-duotone fa-flute',
  'fa-duotone fa-guitar-electric',
  'far fa-guitar',
  'fa-duotone fa-guitar',
  'fa-light fa-microphone',
  'fa-duotone fa-regular fa-piano',
  'fa-duotone fa-light fa-drum',
  'fa-duotone fa-light fa-violin',
]

const icons = ref([])
const iconCount = 96
const MIN_DISTANCE = 60 // Minimum distance between icons
const placedIcons = []
function isTooClose(x, y, size) {
  return placedIcons.some(icon => {
    const dx = icon.x - x
    const dy = icon.y - y
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist < (icon.size + size) / 2 + MIN_DISTANCE
  })
}
onMounted(() => {
  let attempts = 0
  while (icons.value.length < iconCount && attempts < iconCount * 10) {
    attempts++

    const size = 30 + Math.random() * 30
    const x = Math.random() * (window.innerWidth - size)
    const y = Math.random() * (window.innerHeight - size)

    if (isTooClose(x, y, size)) continue

    const iconClass = iconClasses[Math.floor(Math.random() * iconClasses.length)]
    const color = `hsl(${Math.random() * 360}, 100%, ${Math.random() * 50}%)`
    // const color = "#333"

    const icon = {
      class: iconClass ,
      x,
      y,
      size,
      color,
      opacity: 0.001 + Math.random() * .14,
      rotate: Math.random() * 10
    }
    icons.value.push(icon)
    placedIcons.push({ x, y, size })
  }
})
</script>
<style scoped>

.icon-background {
  background: transparent;
  pointer-events: none; /* So clicks go through if used behind content */

}

.icon-background i {
  transition: all 0.3s ease;
}
</style>