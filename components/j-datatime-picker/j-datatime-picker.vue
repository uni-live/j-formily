<template>
  <view>
    <view class="j-datatime-picker" @click="onClick">
      <u--input
        :value="customValue"
        :fixed="getProps.fixed"
		    :disabled="getProps.disabled"
        :disabled-color="getProps.disabledColor"
        :clearable="getProps.clearable"
        :maxlength="getProps.maxlength"
        :placeholder="getProps.placeholder"
        :placeholder-class="getProps.placeholderClass"
        :placeholder-style="getProps.placeholderStyle"
        :show-word-limit="getProps.showWordLimit"
        :disable-default-padding="getProps.disableDefaultPadding"
        :input-align="getProps.inputAlign"
        :font-size="getProps.fontSize"
        :color="getProps.color"
        :prefix-icon="getProps.prefixIcon"
        :suffix-icon="getProps.suffixIcon"
        :suffix-icon-style="getProps.suffixIconStyle"
        :prefix-icon-style="getProps.prefixIconStyle"
        :border="getProps.border"
        :readonly="getProps.readonly"
        :shape="getProps.shape"
        :custom-style="getProps.customStyle"
        :formatter="getProps.formatter"
      />
      <view
        v-if="isClearableIcon"
        class="j-datatime-picker__clear-icon"
        @tap.stop="onClear()"
      >
        <u-icon name="close-circle-fill" color="#c0c4cc" />
      </view>
      <u-icon name="arrow-right" />
    </view>
    <u-datetime-picker
      :show="isOpen"
      :value="customValue"
      :show-toolbar="getProps.showToolbar"
      :title="getProps.title"
      :mode="getProps.mode"
      :max-date="getProps.maxDate"
      :min-date="getProps.minDate"
      :min-hour="getProps.minHour"
      :max-hour="getProps.maxHour"
      :min-minute="getProps.minMinute"
      :max-minute="getProps.maxMinute"
      :filter="getProps.filter"
      :formatter="getProps.formatter"
      :item-height="getProps.itemHeight"
      :cancel-text="getProps.cancelText"
      :confirm-text="getProps.confirmText"
      :cancel-color="getProps.cancelColor"
      :confirm-color="getProps.confirmColor"
      :visible-item-count="getProps.visibleItemCount"
      :close-on-click-overlay="getProps.closeOnClickOverlay"
      :default-index="getProps.defaultIndex"
      @confirm="onConfirm"
      @close="onClose"
      @cancel="onCancel"
      @change="onChange"
    />
  </view>
</template>

<script>
  import { COMP_KEY } from '../j-form/const'
  import { deepMerge } from '../../libs/utils/deepMerge'
  import { omit } from 'lodash-es'
  import { isFunction, isEmpty } from '../../libs/utils/is'
  export default {
    name: 'j-datatime-picker',
    mixins: [uni.$u.mpMixin, uni.$u.mixin],
    inject: {
      COMP_KEY,
    },
    data() {
      return {
        isOpen: false,
        customValue: null,
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
            ...omit(uni.$u.props.input, [
              'type',
              'password',
              'confirmType',
              'confirmHold',
              'holdKeyboard',
              'focus',
              'autoBlur',
              'cursor',
              'cursorSpacing',
              'selectionStart',
              'selectionEnd',
              'adjustPosition',
            ]),
            border: null,
            readonly: true,
            customStyle: {
              paddingLeft: '0rpx',
              paddingRight: '0rpx',
            },
            onChange: null,
            onConfirm: null,
            onClose: null,
            onCancel: null,
            onClear: null,
            afterTransformValues: null,
            beforeTransformValues: null,

            ...omit(uni.$u.props.datetimePicker, ['show']),
            defaultIndex: [],
          },
          comp.compAttr
        )
        return pick
      },
      isClearableIcon() {
        return this.customValue && !this.getProps.disabled
      },
    },
    watch: {
      getValue: {
        handler: function (newValue) {
          const { beforeTransformValues } = this.getProps
          let values = []
          if (beforeTransformValues && isFunction(beforeTransformValues)) {
            values = beforeTransformValues(newValue)
          } else {
            values = newValue
          }

          this.customValue = values
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      onClear() {
        this.$emit('input', '')
        this.$emit('clear', '')
        if (this.getProps.onClear && isFunction(this.getProps.onClear)) {
          this.getProps.onClear()
        }
      },
      onClick() {
        if (this.getProps.disabled) return
        this.isOpen = true
        this.$emit('click')
        if (this.getProps.onClick && isFunction(this.getProps.onClick)) {
          this.getProps.onClick()
        }
      },
      async onChange(e) {
        this.$emit('change', e)
        if (this.getProps.onChange && isFunction(this.getProps.onChange)) {
          this.getProps.onChange(e)
        }
      },
      onCancel() {
        this.isOpen = false
        this.$emit('cancel')
        if (this.getProps.onCancel && isFunction(this.getProps.onCancel)) {
          this.getProps.onCancel()
        }
      },
      onClose() {
        this.isOpen = false
        this.$emit('close')
        if (this.getProps.onClose && isFunction(this.getProps.onClose)) {
          this.getProps.onClose()
        }
      },
      onConfirm(e) {
        let result = ''

        const { afterTransformValues } = this.getProps
        if (afterTransformValues && isFunction(afterTransformValues)) {
          result = afterTransformValues(e)
        } else {
          if (e.value && !isEmpty(e.value)) {
            const timeFormat = uni.$u.timeFormat
            switch (this.getProps.mode) {
              case 'datetime':
                result = timeFormat(e.value, 'yyyy-mm-dd hh:MM')
                break
              case 'date':
                result = timeFormat(e.value, 'yyyy-mm-dd')
                break
              case 'year-month':
                result = timeFormat(e.value, 'yyyy-mm')
                break
              case 'time':
                result = e.value
                break
              default:
                return ''
            }
          }
        }
        this.$emit('input', result)
        this.$emit('confirm', result)
        if (this.getProps.onConfirm && isFunction(this.getProps.onConfirm)) {
          this.getProps.onConfirm(result)
        }
        this.onClose()
      },
    },
  }
</script>

<style lang="scss" scoped>
	.j-datatime-picker {
		/* #ifndef APP-PLUS-NVUE */
		display: flex !important;
		/* #endif */
		flex-direction: row;
		
		&__clear-icon {
			/* #ifndef APP-PLUS-NVUE */
			display: flex !important;
			/* #endif */
			flex-direction: row;
			align-items: center;
		}
	}
</style>
