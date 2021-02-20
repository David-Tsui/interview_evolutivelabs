<template>
  <div id="purchase">
    <div class="purchase__title-wrapper">
      <h2 class="purchase__title">二步驟 <br> 打造專屬殼</h2>
    </div>
    <!-- 手機殼顯示區 -->
    <div class="display__area">
      <section class="purchase__preview">
        <div class="purchase__preview-images-wrapper">
          <img
            :src="device.displayImages.phone"
            alt=""
            class="purchase__preview-image phone"
          />
          <img
            :src="device.displayImages.bumper"
            alt=""
            class="purchase__preview-image sub case"
          />
          <img
            :src="device.displayImages.rim"
            :class="{ 'purchase__preview-image--backward': present === 'backplate-mode' }"
            class="purchase__preview-image sub rim"
            alt=""
          />
          <img
            :src="device.displayImages.button"
            class="purchase__preview-image sub button"
            alt=""
          />
          <img
            :src="device.displayImages.backplate"
            :class="{ 'purchase__preview-image--backward': present === 'case-mode' }"
            class="purchase__preview-image sub backplate"
            alt=""
          />
        </div>
        <div class="purchase__selector-wrapper phone">
          <div class="color-container">
            <p class="color-picker-title">裝置<br>顏色</p>
            <div class="normal color-picker color-picker--vertical">
              <div
                v-for="color in device.phoneColorOptions"
                class="color-picker__option"
                :class="{ 'active': color === device.selectedPhoneColor }"
                @click="handleSelectColor('phone', color)"
                :key="color"
              >
                <div class="dot" :class="color.replace(' ', '')"></div>
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
            <div class="color-picker">
              <div
                v-for="color in device.caseColorOptions"
                class="color-picker__option"
                :class="{ 'active': color === device.selectedCaseColor }"
                @click="handleSelectColor('case', color)"
                :key="color"
              >
                <div class="dot" :class="color.replace(' ', '')"></div>
              </div>
            </div>
          </div>
          <div class="option__block">
            <p class="option__title">背板樣式</p>
            <div class="icon"></div>
            <div class="backplate__style">
              <i class="fa fa-angle-right"></i>
              <i class="fa fa-angle-left"></i>
              <div
                class="backplate"
                v-for="(imgSrc, plateName) in device.backplateImages"
                :class="{ 'active': plateName === device.selectedBackplateStyle }"
                @click="handleSelectBackplate(plateName)"
                :key="plateName"
              >
                <img :src="imgSrc" alt="" />
              </div>
            </div>
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
  ref,
  reactive,
  toRefs,
  watch
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
    const deviceInfo = reactive({
      device: {
        origin: {},
        phoneColorOptions: ['Black', 'White', 'Green', 'Red', 'Blue'],
        caseColorOptions: [],
        backplateOptions: [],
        backplateImages: [],
        selectedPhoneColor: 'Black',
        selectedCaseColor: 'Black',
        selectedBackplateStyle: 'Clear',
        displayImages: {
          phone: 'https://cdn.shopify.com/s/files/1/0740/2335/products/phone45-12-Pro_AppleGraphite_d04b461d-15c3-4e43-9b43-a828eaa4478c.png?v=1603352312',
          bumper: 'https://cdn.shopify.com/s/files/1/0740/2335/products/Black-Bumper_87d2c086-7e6a-4f40-93d9-33828a249bbe.png?v=1597911746',
          rim: 'https://cdn.shopify.com/s/files/1/0740/2335/products/Black-Rim_2e73b29c-7262-463d-b047-2f91a790068a.png?v=1597911791',
          button: 'https://cdn.shopify.com/s/files/1/0740/2335/products/Black-Button_23534b09-c1aa-4ab4-8174-ded2bc09069e.png?v=1597911773',
          backplate: 'https://cdn.shopify.com/s/files/1/0740/2335/products/minisite-NPB0118526L_b4665252-c418-480f-9ca3-b84fb860ca2c.png?v=1603868182'
        }
      }
    })

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

    const getDeviceOptions = (parts) => {
      let availableColors = []
      Object.entries(parts).forEach(([key, value]) => {
        const { options } = value
        const optionsObj = options.reduce((acc, option) => {
          const { name, values } = option
          acc[name] = values
          return acc
        }, {})

        const colorOptions = optionsObj.color || optionsObj.Color
        switch (key) {
          case 'backplate':
            deviceInfo.device.backplateOptions = colorOptions
            break
          case 'phone':
            deviceInfo.device.phoneColorOptions = colorOptions
            break
          case 'bumper':
          case 'button':
          case 'rim':
          case 'clearplate': {
            // 取各部件都有的顏色(交集)
            const colorCount = availableColors.length
            if (!colorCount || (colorCount && colorOptions.length < colorCount)) {
              availableColors = colorOptions
            }
            break
          }
          default:
            break
        }
      })
      deviceInfo.device.caseColorOptions = availableColors
    }

    const getDeviceDetails = device => {
      const parts = [
        'backplate',
        'bumper',
        'button',
        'phone',
        'rim',
        'clearplate'
      ]
      const handles = [
        'backplate-45degree',
        'bumper-45degree',
        'button-45degree',
        'phone-45degree',
        'rim-45degree',
        'bumper-clearplate'
      ]

      const handleParts = handles.map(part => `${device}-mod-nx-${part}`)
      const productParts = handleParts
        .map(handle => products.value.find(product => product.handle === handle))
        .reduce((acc, product, index) => {
          acc[parts[index]] = product
          return acc
        }, {})
      deviceInfo.device.origin = productParts
      getDeviceOptions(productParts)
    }

    const loadImagesFromParts = (deviceInfo, parts = [], { key = 'color', value }) => {
      const ret = {}
      parts.forEach(part => {
        const { variants } = deviceInfo.device.origin[part]
        const match = variants.find(variant => {
          if (key.toLowerCase() === 'color') {
            return (
              variant.optionsWithKey.color === value || variant.optionsWithKey.Color === value
            )
          } else {
            // pass
          }
        })
        ret[part] = match ? match.image : 'not found'
      })
      return ret
    }

    const loadBackplateImages = (deviceInfo) => {
      const { variants } = deviceInfo.device.origin.backplate
      const images = variants.reduce((acc, variant) => {
        const plateKey = variant.optionsWithKey.color
        acc[plateKey] = variant.image
        return acc
      }, {})
      deviceInfo.device.backplateImages = images
    }

    const handleSelectColor = (type = 'phone', color) => {
      switch (type) {
        case 'phone': {
          deviceInfo.device.selectedPhoneColor = color
          const result = loadImagesFromParts(
            deviceInfo,
            ['phone'],
            { key: 'color', value: color }
          )
          const { phone: phoneImg } = result
          deviceInfo.device.displayImages.phone = phoneImg
          break
        }
        case 'case': {
          deviceInfo.device.selectedCaseColor = color
          const result = loadImagesFromParts(
            deviceInfo,
            ['button', 'bumper', 'rim'],
            { key: 'color', value: color }
          )
          const {
            button: buttonImg,
            bumper: bumperImg,
            rim: rimImg
          } = result
          deviceInfo.device.displayImages.button = buttonImg
          deviceInfo.device.displayImages.bumper = bumperImg
          deviceInfo.device.displayImages.rim = rimImg
          break
        }
        default:
          break
      }
    }

    const handleSelectBackplate = plate => {
      deviceInfo.device.selectedBackplateStyle = plate
      deviceInfo.device.displayImages.backplate = deviceInfo.device.backplateImages[plate]
    }

    const getDeviceDefaultImage = () => {
      handleSelectColor('phone', deviceInfo.device.phoneColorOptions[0])
      handleSelectColor('case', deviceInfo.device.caseColorOptions[0])
      loadBackplateImages(deviceInfo)
      handleSelectBackplate(deviceInfo.device.backplateOptions[0])
    }

    fetchProductData()

    watch([selectedDevice], (value) => {
      getDeviceDetails(value)
      getDeviceDefaultImage()
    })

    return {
      cartItems,
      listLoading,
      products,
      devices,
      selectedDevice,
      handleSelectColor,
      handleSelectBackplate,
      ...toRefs(deviceInfo),
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
    padding: 20px 0
    border-bottom: 1px solid #D8D8D8
    text-align: left

    .option__title
      margin-bottom: 14px
      font-size: 14px
      font-family: 'MarkPro', 'NotoSansCJKtc-Regular'
      color: #2D2D2D

    .icon
      position: absolute
      right: 0
      top: 24px
      width: 16px
      height: 16px
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
    &.phone
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

.color-picker
  display: flex
  align-items: center
  justify-content: flex-start
  --border-color: #d5d5d5
  --hover-border: #2d2d2d

  &:not(--vertical)
    flex-wrap: wrap
    position: relative
    z-index: 3

  &__option
    position: relative
    width: 29px
    height: 29px
    border: 1px solid transparent
    border-radius: 50%
    z-index: 200
    transition: all .3s ease
    margin-bottom: 18px
    margin-right: 10px
    display: flex
    align-items: center
    justify-content: center
    &:hover, &.active
      border: 1px solid var(--hover-border)
    .dot
      border: 1px solid var(--border-color)
      border-radius: 50%
      cursor: pointer
      width: 23px
      height: 23px

  &--vertical
    flex-direction: column
    --desc-text-width: 150px
    --desc-dash-width: 16px
    --desc-dash-margin: 13px

    &.normal
      --dash-color: #d8d8d8
      --font-color: #2d2d2d
    .color-picker__option
      margin-right: unset

.backplate__style
  display: flex
  flex-wrap: wrap
  .backplate
    display: flex
    align-items: center
    width: 68px
    height: 68px
    margin: 0 8px 8px 0
    border-radius: 10px
    background-color: #fff
    box-sizing: border-box
    cursor: pointer
    --backplate-active-color: #2d2d2d
    &.active
      border: 2px solid var(--backplate-active-color)
    img
      width: 100%
      height: auto

.AppleGraphite
  background: #686763

.Silver
  background: #c9c8c9

.Gold
  background: #fadcc2

.PacificBlue
  background: #43616c

.Black
  background: #383636

.JetBlack
  background: #000000

.White
  background: #ffffff

.Green
  background: #60b287

.Red
  background: #dc5455

.Blue
  background: #2a7ca0

.SpaceGray
  background: #575c5c

.AppleRed
  background: #a6282c

.AppleGreen
  background: #AEE1CD

.ApplePurple
  background: #D1CAE1

.Graphite
  background: #4f4f47

.RoyalBlue
  background: #255774

.BlushPink
  background: #f2d1cb

.Yellow
  background: #ffe568

.CamoGreen
  background: #505e31

.PlatinumGray
  background: #afb4b0

.Lavender
  background: #9390a7

.NavyBlue
  background: #385672

.MintGreen
  background: #c3edc7

.Coral
  background: #ff6e5a

.RoseGold
  background: #fad6d3

.MidnightGreen
  background: #6D7971
</style>
