<template>
  <u--input
    :value="customValue"
    :type="getProps.type"
    :fixed="getProps.fixed"
    :disabled="getProps.disabled"
    :disabled-color="getProps.disabledColor"
    :clearable="getProps.clearable"
    :password="getProps.password"
    :maxlength="getProps.maxlength"
    :placeholder="getProps.placeholder"
    :placeholder-class="getProps.placeholderClass"
    :placeholder-style="getProps.placeholderStyle"
    :show-word-limit="getProps.showWordLimit"
    :confirm-type="getProps.confirmType"
    :confirm-hold="getProps.confirmHold"
    :hold-keyboard="getProps.holdKeyboard"
    :focus="getProps.focus"
    :auto-blur="getProps.autoBlur"
    :disable-default-padding="getProps.disableDefaultPadding"
    :cursor="getProps.cursor"
    :cursor-spacing="getProps.cursorSpacing"
    :selection-start="getProps.selectionStart"
    :selection-end="getProps.selectionEnd"
    :adjust-position="getProps.adjustPosition"
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
    @input="onInput"
    @focus="onFocus"
    @keyboardheightchange="onKeyboardheightchange"
    @change="onChange"
    @confirm="onConfirm"
    @clear="onClear"
    @click="onClick"
  />
</template>
<script>
  import { deepMerge } from '../../libs/utils/deepMerge'
  import { COMP_KEY } from '../j-form/const'

  export default {
    name: 'j-input',
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
            onClear: null,
            onClick: null,
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
      onFocus() {
        if (this.getProps.onFocus && isFunction(this.getProps.onFocus)) {
          this.getProps.onFocus()
        }
      },
      onKeyboardheightchange() {
        if (
          this.getProps.onKeyboardheightchange &&
          isFunction(this.getProps.onKeyboardheightchange)
        ) {
          this.getProps.onKeyboardheightchange()
        }
      },
      onChange(e) {
        if (this.getProps.onChange && isFunction(this.getProps.onChange)) {
          this.getProps.onChange(e)
        }
      },
      onConfirm(e) {
        if (this.getProps.onConfirm && isFunction(this.getProps.onConfirm)) {
          this.getProps.onConfirm(e)
        }
      },
      onClear() {
        if (this.getProps.onClear && isFunction(this.getProps.onClear)) {
          this.getProps.onClear()
        }
      },
      onClick() {
        if (this.getProps.onClick && isFunction(this.getProps.onClick)) {
          this.getProps.onClick()
        }
      },
    },
  }
</script>
