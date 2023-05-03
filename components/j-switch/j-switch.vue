<template>
  <view class="flex align-center" :style="[$u.addStyle(getProps.customStyle)]">
    <u-switch
      :value="innerValue"
      :disabled="getProps.disabled"
      :size="getProps.size"
      :active-color="getProps.activeColor"
      :inactive-color="getProps.inactiveColor"
      :loading="getProps.loading"
      :active-value="getProps.activeValue"
      :inactive-value="getProps.inactiveValue"
      :async-change="getProps.asyncChange"
      :space="getProps.space"
      @change="onChange"
      @input="onInput"
    />
  </view>
</template>

<script>
  import { COMP_KEY } from '../j-form/const'
  import { deepMerge } from '../../libs/utils/deepMerge'
  import { isFunction } from '../../libs/utils/is'
  export default {
    name: 'j-switch',
    mixins: [uni.$u.mpMixin, uni.$u.mixin],
    inject: {
      COMP_KEY,
    },
    data() {
      return {
        innerValue: false,
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
            ...uni.$u.props.switch,
            customStyle: {
              // #ifdef  H5 || APP-PLUS
              minHeight: '66rpx',
              // #endif

              //#ifdef MP
              // eslint-disable-next-line no-dupe-keys
              minHeight: '72rpx',
              // #endif
            },

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
          if (newValue) {
            this.innerValue = newValue
          } else {
            this.innerValue = false
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
