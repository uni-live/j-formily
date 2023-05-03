<template>
  <view class="flex align-center" :style="[$u.addStyle(getProps.customStyle)]">
    <u-number-box
      :value="innerValue"
      :name="getProps.name"
      :min="getProps.min"
      :max="getProps.max"
      :step="getProps.step"
      :integer="getProps.integer"
      :disabled="getProps.disabled"
      :disabled-input="getProps.disabledInput"
      :async-change="getProps.asyncChange"
      :input-width="getProps.inputWidth"
      :show-minus="getProps.showMinus"
      :show-plus="getProps.showPlus"
      :decimal-length="getProps.decimalLength"
      :long-press="getProps.longPress"
      :color="getProps.color"
      :button-size="getProps.buttonSize"
      :bg-color="getProps.bgColor"
      :cursor-spacing="getProps.cursorSpacing"
      :disable-plus="getProps.disablePlus"
      :disable-minus="getProps.disableMinus"
      :icon-style="getProps.iconStyle"
      @change="onChange"
      @input="onInput"
    />
  </view>
</template>

<script>
  import { COMP_KEY } from '../j-form/const'
  import { deepMerge } from '../../libs/utils/deepMerge'
  import { isFunction, isNullOrUnDef } from '../../libs/utils/is'
  export default {
    name: 'j-number-box',
    mixins: [uni.$u.mpMixin, uni.$u.mixin],
    inject: {
      COMP_KEY,
    },
    data() {
      return {
        innerValue: 0,
      }
    },
    computed: {
      getValue() {
        const comp = this.COMP_KEY()
        return comp.value
      },
      getProps() {
        const comp = this.COMP_KEY()

        const pick = deepMerge(
          {
            ...uni.$u.props.numberBox,
            min: 0,
            customStyle: {
              // #ifdef  H5 || APP-PLUS
              minHeight: '66rpx',
              // #endif

              //#ifdef MP
              // eslint-disable-next-line no-dupe-keys
              minHeight: '72rpx',
              // #endif
            },
			inputWidth: 80,

            onChange: null,
            onInput: null,
          },
          comp.compAttr
        )
        return pick
      },
    },
    watch: {
      getValue: {
        handler: function (newValue) {
          if (isNullOrUnDef(newValue)) {
            this.innerValue = 0
          } else {
            this.innerValue = newValue
          }
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      onChange(e) {
        this.$emit('change', e)
        if (this.getProps.onChange && isFunction(this.getProps.onChange)) {
          this.getProps.onChange(e)
        }
      },
      onInput(e) {
        this.innerValue = e
        this.$nextTick(() => {
          this.$emit('input', e)
          // 尝试调用u-form的验证方法
          uni.$u.formValidate(this, 'change')

          if (this.getProps.onInput && isFunction(this.getProps.onInput)) {
            this.getProps.onInput(e)
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
	@import url('../../libs/css/free.css');
</style>
