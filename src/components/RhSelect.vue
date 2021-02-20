<template>
  <div class="rh-select" id="device">
    <div class="selected">{{ selectedText }}</div>
    <select
      v-model="selectedValue"
      class="rh-select__select"
    >
      <option value="" disabled>請選擇型號</option>
      <option
        v-for="option in options"
        :value="option.key"
        :key="option.key"
      >
        {{ option.name }}
      </option>
    </select>
    <span class="angle-icon">
      <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.75" y="0.0500031" width="7" height="1" transform="rotate(45 0.75 0.0500031)" fill="#2D2D2D"></rect><rect x="4.28711" y="5" width="7" height="1" transform="rotate(-45 4.28711 5)" fill="#2D2D2D"></rect></svg>
    </span>
  </div>
</template>

<script>
import { ref, watch, computed } from '@vue/composition-api'

export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup (props, context) {
    const device = ref(props.value)

    const updateModel = (newValue) => {
      context.emit('input', newValue)
    }

    const selectedValue = computed({
      get () {
        return props.value
      },
      set (newValue) {
        updateModel(newValue)
      }
    })

    watch(() => props.value, val => { device.value = val })

    const selectedText = computed(() => {
      if (!props.options.length || !device.value) return '請選擇型號'
      return props.options.find(opt => opt.key === device.value).name
    })

    return {
      selectedText,
      selectedValue,
      updateModel
    }
  }
}
</script>

<style lang="sass">
select
  appearance: none
  background-position: right center
  background-image: url(//cdn.shopify.com/s/files/1/0740/2335/t/968/assets/ico-select.svg?v=3618872108218807067)
  background-repeat: no-repeat
  background-position: right 10px center
  background-color: transparent
  padding-right: 28px
  text-indent: 0.01px
  text-overflow: ''
  cursor: pointer
option
  color: black
  background-color: white

.rh-select
  --main-color: #cdcdcd
  --title-color: #2d2d2d
  --hover-color: #212121
  --detail-color: #3f3f3f
  --border-color: #d8d8d8
  display: flex
  align-items: center
  position: relative
  width: 100%
  height: 38px
  color: var(--detail-color)
  font-family: 'MarkPro', 'NotoSansCJKtc-Regular'
  border: 1px solid var(--border-color)
  transition: border-color .3s ease-in
  &:hover
    border-color: var(--hover-color)
    .angle-icon svg rect
      fill: var(--title-color)
  .selected
    position: absolute
    text-align: left
    width: 100%
    padding: 0 20px
    font-size: 14px
  &__select
    width: 100%
    height: 100%
    font-size: 14px
    -webkit-appearance: none
    background: transparent
    border: unset
    border-radius: unset
    padding: 0 20px
    outline: unset
    opacity: 0
  .angle-icon
    position: absolute
    right: 0
    top: 0
    width: 10px
    height: 100%
    margin: 0 20px
    pointer-events: none
    display: flex
    justify-content: center
    align-items: center
    svg rect
      transition: fill .3s ease-in
      fill: var(--main-color)
</style>
