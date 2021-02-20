<template>
  <div id="purchase">
    <div class="purchase__title-wrapper">
      <h2 class="purchase__title">二步驟 <br> 打造專屬殼</h2>
    </div>
    <!-- 手機殼顯示區 -->
    <div class="display__area">
      <section class="purchase__preview">
        <div class="purchase__preview-images-wrapper">
          <img src="https://cdn.shopify.com/s/files/1/0740/2335/products/phone45-12-Pro_AppleGraphite_d04b461d-15c3-4e43-9b43-a828eaa4478c.png?v=1603352312" alt="" class="purchase__preview-image main">
          <img src="https://cdn.shopify.com/s/files/1/0740/2335/products/Black-Bumper_87d2c086-7e6a-4f40-93d9-33828a249bbe.png?v=1597911746" alt="" class="purchase__preview-image sub case">
          <img
            src="https://cdn.shopify.com/s/files/1/0740/2335/products/Black-Rim_2e73b29c-7262-463d-b047-2f91a790068a.png?v=1597911791"
            alt=""
            :class="{ 'purchase__preview-image--backward': present === 'backplate-mode' }"
            class="purchase__preview-image sub rim"
          />
          <img src="https://cdn.shopify.com/s/files/1/0740/2335/products/Black-Button_23534b09-c1aa-4ab4-8174-ded2bc09069e.png?v=1597911773" alt="" class="purchase__preview-image sub button">
          <img
            src="https://cdn.shopify.com/s/files/1/0740/2335/products/minisite-NPB0118526L_b4665252-c418-480f-9ca3-b84fb860ca2c.png?v=1603868182"
            alt=""
            :class="{ 'purchase__preview-image--backward': present === 'case-mode' }"
            class="purchase__preview-image sub backplate"
          />
        </div>
        <div class="purchase__selector-wrapper phone">
          <div class="color-container">
            <p class="color-picker-title">裝置<br>顏色</p>
            <div class="normal color-picker color-picker--vertical">
              <div id="apple_graphite" class="color-picker--vertical__option active">
                <div class="dot apple_graphite"></div>
              </div>
              <div id="silver" class="color-picker--vertical__option">
                <div class="dot silver"></div>
              </div>
              <div id="gold" class="color-picker--vertical__option">
                <div class="dot gold"></div>
              </div>
              <div id="pacific_blue" class="color-picker--vertical__option">
                <div class="dot pacific_blue"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="purchase__backplate-switch-wrapper">
          <back-plate-switch
            :present="present"
            :setPresent="setPresent"
          />
        </div>
      </section>
    </div>
    <!-- 型號/顏色顯示區 -->
    <div class="selection__area">
      <div class="selection__area__top">
        <div class="device__selector">
          <rh-select
            v-if="!listLoading"
            v-model="selectedDevice"
            :options="devices"
          />
        </div>

        <div class="outward">
          <div class="option__block">
            <p class="option__title">手機殼顏色</p>
            <div class="icon"></div>
          </div>
          <div class="option__block">
            <p class="option__title">背板樣式</p>
            <div class="icon"></div>
          </div>
        </div>
      </div>

      <div class="checkout">
        <div class="checkout__detail">
          <p class="checkout__detail__info">產品包含:</p>
          <p class="checkout__detail__info">手機殼外框 (黑) x 1</p>
          <p class="checkout__detail__info">按鍵 (黑) x 3</p>
          <p class="checkout__detail__info">背板 (透明) x 1</p>
          <p class="checkout__detail__info">飾條 (黑) x 1</p>
        </div>
        <div class="checkout__button__block">
          <button class="checkout__btn" @click="addToCart">加入購物車</button>
          <p class="price">$800 TWD</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ref
} from '@vue/composition-api'
import useRequest from './useRequest'
import usePresent from './usePresent'
import RhSelect from './RhSelect'
import BackPlateSwitch from './BackPlateSwitch'

export default {
  components: {
    RhSelect,
    BackPlateSwitch
  },
  setup () {
    const cartItems = ref([])
    const products = ref([])
    const devices = ref([])
    const selectedDevice = ref('')
    const listLoading = ref(true)
    const { present, setPresent } = usePresent()

    const getAllProductModels = (items) => {
      const tempModels = items.value.reduce((acc, product) => {
        const { title } = product
        const splitStartIndex = title.indexOf('犀牛盾')
        const splitTitle = title
          .substring(0, splitStartIndex)
          .trim()
          .split(' ')
          .filter(ele => ele !== '-')

        const model = {
          name: splitTitle.join(' '),
          key: splitTitle.join('-').toLowerCase()
        }

        acc = acc.concat([model])
        return acc
      }, [])

      const allKeys = [...new Set(tempModels.map(model => model.key))]
      const models = allKeys.map(key => tempModels.find(model => model.key === key))

      const sortedModels = models.sort((a, b) => {
        const modelPublish = ['12', 'SE', '11', 'XR', 'XS', 'X', '8', '7']
        const [aVer, bVer] = [a.name.split(' ')[1], b.name.split(' ')[1]]
        const [aIndex, bIndex] = [modelPublish.indexOf(aVer), modelPublish.indexOf(bVer)]
        if (aIndex < bIndex) return -1
        if (aIndex > bIndex) return 1
        return 0
      })
      return sortedModels
    }

    const fetchProductData = async () => {
      // TODO
      // Call API 抓取產品資料並依產品類型分類。
      // API URL : http://localhost:3000/mod-nx
      listLoading.value = true
      try {
        const { data } = await useRequest(
          'http://localhost:3000/mod-nx',
          { method: 'get' }
        )
        products.value = data.value.data
        devices.value = getAllProductModels(products)
        selectedDevice.value = 'iphone-12'
      } finally {
        listLoading.value = false
      }
    }

    const addToCart = () => {
      // TODO
      // 把選取的產品加到 cartItems 裡面並 console 出來
    }

    fetchProductData()

    return {
      cartItems,
      listLoading,
      products,
      devices,
      selectedDevice,
      present,
      setPresent,
      addToCart
    }
  }
}
</script>

<style lang="sass" scoped>
@font-face
  font-family: MarkPro-Bold
  src: url('https://cdn.shopify.com/s/files/1/0274/8717/files/MarkPro-Bold.otf?12401685184872946130')

@font-face
  font-family: NotoSansCJKtc-Bold
  src: url('https://cdn.shopify.com/s/files/1/0274/8717/files/NotoSansCJKtc-Bold.otf?12610878586689504297')

@font-face
  font-family: MarkPro
  src: url('https://cdn.shopify.com/s/files/1/0274/8717/files/MarkPro.otf?4269257120200746974')

@font-face
  font-family: NotoSansCJKtc-Regular
  src: url(https://cdn.shopify.com/s/files/1/0274/8717/files/NotoSansCJKtc-Regular.otf?4935245772218057441)

#purchase
  position: relative
  width: 100%
  height: 100%
  max-width: 1440px
  display: flex
  padding: 120px 60px
  align-items: flex-start
  justify-content: space-between
  box-sizing: border-box

.purchase__title-wrapper
  width: 25%
  max-width: 220px

.display__area
  height: 100%

.selection__area
  display: flex
  flex-direction: column
  justify-content: space-between
  align-self: stretch
  margin-left: 70px
  width: 35%
  max-width: 260px

  .device__selector
    margin-bottom: 25px

  .checkout

    &__detail
      font-family: 'MarkPro', 'NotoSansCJKtc-Regular'

      &__info
        margin: 15px 0
        padding: 0
        line-height: 14px
        font-size: 14px
        text-align: left

    &__button__block
      display: flex
      justify-content: space-between
      align-items: center
      font-family: 'MarkPro-Bold', 'NotoSansCJKtc-Bold'

      .price
        font-size: 14px
        text-algin: right

    &__btn
      display: flex
      justify-content: center
      align-items: center
      width: 100%
      height: 40px
      max-width: 180px
      color: #FFF
      // font-family: 'MarkPro-Bold', 'NotoSansCJKtc-Bold'
      box-shadow: none
      border: none
      border-radius: 20.5px
      background-color: #2D2D2D
      transition: all .3s ease
      white-space: inherit

  .outward
    border-top: 2px solid #D8D8D8

  .option__block
    position: relative
    display: flex
    justify-content: flex-start
    align-items: center
    padding: 20px 0
    border-bottom: 1px solid #D8D8D8

    .option__title
      font-size: 14px
      font-family: 'MarkPro', 'NotoSansCJKtc-Regular'
      color: #2D2D2D

    .icon
      position: absolute
      right: 0
      top: 50%
      width: 16px
      height: 16px
      transform: translateY(-50%)
      cursor: pointer

      &::before
        content: ''
        position: absolute
        left: 0
        width: 1px
        height: 16px
        background-color: #D8D8D8
        transform: rotate(90deg)
        transition: all .3s ease

      &::after
        content: ''
        position: absolute
        left: 0
        width: 1px
        height: 16px
        background-color: #D8D8D8
        transition: all .3s ease

    p
      margin: 0
      padding: 0

.purchase__preview
  position: relative
  margin: 0 auto
  width: 100%
  max-width: 650px
  height: 100%
  &-images-wrapper
    position: relative
    height: 80%
  &-image
    transition: all .3s
    &.main
      position: relative
      height: 100%
      z-index: 1
    &.sub
      position: absolute
      height: 100%
      top: 0
      left: 0
    &.rim
      z-index: 2
    &.case
      z-index: 2
    &.backplate
      z-index: 1
    &--backward
      z-index: 3
      transform: translate(12%, -10%)
      &.rim, &.backplate
        z-index: 0

.purchase__selector-wrapper
  &.phone
    position: absolute
    top: 50%
    left: 25%
    transform: translateY(-50%)
    z-index: 3

.purchase__backplate-switch-wrapper
  position: absolute
  top: 50px
  right: 0
  z-index: 3

.color-picker-title
  position: absolute
  top: 0
  right: 0
  margin: 0
  font-size: 12px
  color: #000
  line-height: normal
  text-transform: uppercase
  transform: translateY(-120%)
  opacity: .2

.color-picker--vertical
  display: flex
  align-items: center
  justify-content: flex-start
  flex-direction: column
  --desc-text-width: 150px
  --desc-dash-width: 16px
  --desc-dash-margin: 13px

  &.normal
    --border-color: #d5d5d5
    --hover-border: #d5d5d5
    --dash-color: #d8d8d8
    --font-color: #2d2d2d

  &__option
    position: relative
    width: 29px
    height: 29px
    border: 1px solid transparent
    border-radius: 50%
    z-index: 200
    transition: all .3s ease
    margin-bottom: 18px
    display: flex
    align-items: center
    justify-content: center
    &:hover
      border: 1px solid var(--hover-border)
    .active, .dot
      width: 23px
      height: 23px
    .dot
      border: 1px solid var(--border-color)
      border-radius: 50%
      cursor: pointer

.apple_graphite
  background-color: #686763

.silver
  background-color: #c9c8c9

.gold
  background-color: #fadcc2

.pacific_blue
  background-color: #43616c
</style>
