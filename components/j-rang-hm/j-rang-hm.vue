<template>
  <view class="j-rang-hm__mian">
    <view class="j-rang-hm__date" @click="onClick(0)">
      <u--input
        :value="dateValue"
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
      <u-icon name="arrow-right" :size="14" color="#cccccc" />
    </view>
     <view class="j-rang-hm__time1" @click="onClick(1)">
      <u--input
        :value="time1Value"
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
      <view class="m-1">至</view>
    </view>
     <view class="j-rang-hm__time2" @click="onClick(2)">
      <u--input
        :value="time2Value"
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
      </view>
    <view
        v-if="isClearableIcon"
        class="j-datatime-picker__clear-icon"
        @tap.stop="onClear()"
      >
        <u-icon name="close-circle-fill" color="#c0c4cc" />
      </view>
    <u-datetime-picker
      :show="isOpen"
      :value="dataPickValue"
      :show-toolbar="getProps.showToolbar"
      :title="getProps.title"
      :mode="mode"
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
  import { isFunction, isEmpty, isArray } from '../../libs/utils/is'
  import dayjs from 'dayjs'
  export default {
    name: 'j-datatime-picker',
    mixins: [uni.$u.mpMixin, uni.$u.mixin],
    inject: {
      COMP_KEY,
    },
    data() {
      return {
        isOpen: false,
        customValue: null, // [2022-10-09 22:10, 2022-10-09 22:22]
        dataPickValue: Number(new Date()),
        mode: 'date',
        type: null
      }
    },
    computed: {
      dateValue() {
        if(this.customValue && isArray(this.customValue) && !isEmpty(this.customValue)) {
          return dayjs(this.customValue[0]).format('YYYY-MM-DD')
        }else {
          return ''
        }
      },
      time1Value() {
        if(this.customValue && isArray(this.customValue) && !isEmpty(this.customValue) && this.customValue[0]) {
          return dayjs(this.customValue[0]).format('HH:mm')
        }else {
          return ''
        }
      },
      time2Value() {
        if(this.customValue && isArray(this.customValue) && !isEmpty(this.customValue) && this.customValue[1]) {
          return dayjs(this.customValue[1]).format('HH:mm')
        }else {
          return ''
        }
      },
      getValue() {
        const comp = this.COMP_KEY()
        return comp.value //只接受数组
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
      onClick(type) {
        this.type = type
        if (this.getProps.disabled) return
        switch (type) {
          case 0:
            this.dataPickValue = this.dateValue
            this.mode = 'date'
            break;
          case 1:
            this.mode = 'time'
            this.dataPickValue = this.time1Value
            break;
          case 2:
            this.mode = 'time'
            this.dataPickValue = this.time2Value
            break;
        }

        setTimeout(() => {
            this.isOpen = true
            this.$emit('click')
            if (this.getProps.onClick && isFunction(this.getProps.onClick)) {
              this.getProps.onClick(type)
            }
        });
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
            const dateValue = this.dateValue || dayjs().format('YYYY-MM-DD')
            switch (this.mode) {
              case 'date':
                const date  = dayjs(e.value).format('YYYY-MM-DD')
                result = [`${date} ${this.time1Value}`, `${date} ${this.time2Value}`];
                break
              case 'time':
                const time = e.value.includes('N') ? '00:00' : e.value
                if(this.type == 1) {
                  result = [`${dateValue} ${time}`, `${dateValue} ${this.time2Value}`];
                }else if(this.type == 2) {
                  result = [`${dateValue} ${this.time1Value}`, `${dateValue} ${time}`];
                }
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
  .j-rang-hm__mian{
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
	.j-rang-hm__date {
		/* #ifndef APP-PLUS-NVUE */
		display: flex !important;
		/* #endif */
		flex-direction: row;
    align-items: center;
	}

  .j-rang-hm__time1 {
    margin-left: 10rpx;
		/* #ifndef APP-PLUS-NVUE */
		display: flex !important;
		/* #endif */
		flex-direction: row;
    align-items: center;
	}

  .j-rang-hm__time2 {
    margin-left: 10rpx;
		/* #ifndef APP-PLUS-NVUE */
		display: flex !important;
		/* #endif */
		flex-direction: row;
    align-items: center;
	}

  .j-datatime-picker__clear-icon{
	/* #ifndef APP-PLUS-NVUE */
			display: flex !important;
			/* #endif */
			flex-direction: row;
			align-items: center;
  }
</style>
