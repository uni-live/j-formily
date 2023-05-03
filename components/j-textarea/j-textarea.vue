<template>
  <u--textarea
    :value="customValue"
    :custom-style="getProps.customStyle"
    :placeholder="getProps.placeholder"
    :placeholder-class="getProps.placeholderClass"
    :placeholder-style="getProps.placeholderStyle"
    :height="getProps.height"
    :disabled="getProps.disabled"
    :count="getProps.count"
    :focus="getProps.focus"
    :auto-height="getProps.autoHeight"
    :fixed="getProps.fixed"
    :cursor-spacing="getProps.cursorSpacing"
    :cursor="getProps.cursor"
    :border="getProps.border"
    :formatter="getProps.formatter"
    :show-confirm-bar="getProps.showConfirmBar"
    :selection-start="getProps.selectionStart"
    :selection-end="getProps.selectionEnd"
    :adjust-position="getProps.adjustPosition"
    :disable-default-padding="getProps.disableDefaultPadding"
    :hold-keyboard="getProps.holdKeyboard"
    :maxlength="getProps.maxlength"
    :confirm-type="getProps.confirmType"
    @change="onChange"
    @blur="onBlur"
    @linechange="onLinechange"
    @input="onInput"
    @confirm="onConfirm"
    @keyboardheightchange="onKeyboardheightchange"
  />
</template>
<script>
  import { deepMerge } from '../../libs/utils/deepMerge'
  import { COMP_KEY } from '../j-form/const'
  import { isFunction } from '../../libs/utils/is'

  export default {
    name: 'j-textarea',
    mixins: [uni.$u.mpMixin, uni.$u.mixin],
    inject: {
      COMP_KEY,
    },
    data() {
      return {
        customValue: '',
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
            ...uni.$u.props.input,
            border: null,
            customStyle: {
              paddingLeft: '0rpx',
              paddingRight: '0rpx',
            },
            onInput: null,
            onFocus: null,
            onKeyboardheightchange: null,
            onChange: null,
            onConfirm: null,
            onBlur: null,
            onLinechange: null,
          },
          comp.compAttr
        )
        return pick
      },
    },
    watch: {
      getValue: {
        handler: function (newValue) {
          this.customValue = newValue
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      onInput(e) {
        this.$emit('input', e)

        if (this.getProps.onInput && isFunction(this.getProps.onInput)) {
          this.getProps.onInput(e)
        }
      },
      onBlur(e) {
        if (this.getProps.onBlur && isFunction(this.getProps.onBlur)) {
          this.getProps.onBlur(e)
        }
      },
      onLinechange(e) {
        if (
          this.getProps.onLinechange &&
          isFunction(this.getProps.onLinechange)
        ) {
          this.getProps.onLinechange(e)
        }
      },
      onFocus() {
        if (this.getProps.onFocus && isFunction(this.getProps.onFocus)) {
          this.getProps.onFocus()
        }
      },
      onChange(e) {
        if (this.getProps.onChange && isFunction(this.getProps.onChange)) {
          this.getProps.onChange(e)
        }
      },
      onKeyboardheightchange(e) {
        if (
          this.getProps.onKeyboardheightchange &&
          isFunction(this.getProps.onKeyboardheightchange)
        ) {
          this.getProps.onKeyboardheightchange(e)
        }
      },
      onConfirm(e) {
        if (this.getProps.onConfirm && isFunction(this.getProps.onConfirm)) {
          this.getProps.onConfirm(e)
        }
      },
    },
  }
</script>
