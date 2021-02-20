<template>
  <div class="backplate-switch light">
    <section class="backplate-switch__common">
      <div class="backplate-switch__option" @click="setPresent('backplate-mode')">
        <div
          class="backplate-switch__checkbox"
          :class="{ 'backplate-switch__checkbox--active': present === 'backplate-mode' }">
          <div class="dot"></div>
        </div>
        <p class="backplate-switch__mode-name">背板模式</p>
      </div>
      <div class="backplate-switch__option" @click="setPresent('case-mode')">
        <div
          class="backplate-switch__checkbox"
          :class="{ 'backplate-switch__checkbox--active': present === 'case-mode' }">
          <div class="dot"></div>
        </div>
        <p class="backplate-switch__mode-name">邊框模式</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    present: String,
    setPresent: Function
  }
}
</script>

<style lang="sass" scoped>
.backplate-switch
  --title-color: #2d2d2d
  --hover-switch: #646464
  --switch-color: #2d2d2d
  &__option
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer
    margin-bottom: 20px
  &__checkbox
    display: flex
    justify-content: center
    align-items: center
    width: 28px
    height: 28px
    margin-bottom: 2px
    border-radius: 50%
    transition: all .3s ease
    cursor: pointer
    &--active
      border: 1px solid var(--hover-switch)
      .dot
        background: var(--switch-color)
    .dot
      position: relative
      width: 12px
      height: 12px
      border-radius: 50%
      border: 1px solid var(--switch-color)
      transition: all .3s ease
  &__mode-name
    font-family: MarkPro, NotoSansCJKtc-Regular
    font-size: 14px
    color: var(--title-color)
    text-align: left
    line-height: 20px
    margin-left: 10px
</style>
