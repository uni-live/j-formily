<template>
  <view>
    <view class="flex" @click="onClick">
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
        class="flex align-center"
        @tap.stop="onClear()"
      >
        <u-icon name="close-circle-fill" color="#c0c4cc" />
      </view>
      <u-icon name="arrow-right" />
    </view>
    <u-picker
      ref="uPicker"
      :show="isOpen"
      :loading="loading"
      :show-toolbar="getProps.showToolbar"
      :title="getProps.title"
      :columns="getOptions"
      :item-height="getProps.itemHeight"
      :cancel-text="getProps.cancelText"
      :confirm-text="getProps.confirmText"
      :cancel-color="getProps.cancelColor"
      :confirm-color="getProps.confirmColor"
      :single-index="getProps.singleIndex"
      :visible-item-count="getProps.visibleItemCount"
      :key-name="getProps.keyName"
      :close-on-click-overlay="getProps.closeOnClickOverlay"
      :default-index="getProps.defaultIndex"
      :immediate-change="getProps.immediateChange"
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
  import { omit, get } from 'lodash-es'
  import { isFunction, isArray, isEmpty } from '../../libs/utils/is'
  export default {
    name: 'j-picker',
    mixins: [uni.$u.mpMixin, uni.$u.mixin],
    inject: {
      COMP_KEY,
    },
    data() {
      return {
        loading: false,
        isOpen: false,
        isFirstLoad: false,
        list: [],
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

            ...omit(uni.$u.props.picker, ['show', 'columns']),
            defaultIndex: [],
            api: null,
            apiPicker: null,
            params: {},
            paramsLink: {},
            keyName: 'label',
            resultField: null,
            labelField: 'label',
            valueField: 'value',
            immediate: false,
            alwaysLoad: false,
            options: [],
            prefix: '-',
          },
          comp.compAttr
        )
        return pick
      },
      isClearableIcon() {
        return this.customValue && !this.getProps.disabled
      },
      getOptions() {
        const { labelField, valueField, api, options } = this.getProps
        let result = []
        if (api && isFunction(api)) {
          result = this.list
        } else {
          result = options
        }

        let res = []
        if (result && !isEmpty(result)) {
          result.forEach((item) => {
            res.push(
              item.reduce((prev, next) => {
                if (next) {
                  prev.push({
                    ...omit(next, [labelField, valueField]),
                    [this.getProps.keyName]: next[labelField],
                    value: next[valueField],
                  })
                }
                return prev
              }, [])
            )
          })
        }

        return res
      },
    },
    watch: {
      getValue: {
        handler: function (newValue) {
          const { prefix, beforeTransformValues } = this.getProps
          let values = []
          if (beforeTransformValues && isFunction(beforeTransformValues)) {
            values = beforeTransformValues(newValue)
          } else {
            if (isArray(newValue)) {
              values = newValue.join(prefix)
            } else {
              values = newValue
            }
          }

          this.customValue = values
        },
        immediate: true,
        deep: true,
      },
      'getProps.immediate': {
        handler: function () {
          const { api, immediate, alwaysLoad } = this.getProps
          api && isFunction(api) && immediate && !alwaysLoad && this.fetch()
        },
        immediate: true,
      },
      'getProps.alwaysLoad': {
        handler: function () {
          const { api, immediate, alwaysLoad } = this.getProps
          api && isFunction(api) && immediate && !alwaysLoad && this.fetch()
        },
        immediate: true,
      },
      'getProps.params': {
        handler: function (newValue, oldValue) {
          const { api } = this.getProps
          if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
            api && isFunction(api) && this.fetch()
          }
        },
        deep: true,
      },
    },
    methods: {
      async handleFetch(visible) {
        const { immediate, alwaysLoad } = this.getProps
        if (visible) {
          if (alwaysLoad) {
            await this.fetch()
          } else if (!immediate && !this.isFirstLoad) {
            await this.fetch()
            this.isFirstLoad = true
          }
        }
      },
      async fetch() {
        const { api, params, resultField } = this.getProps
        if (!api || !isFunction(api)) return
        this.list = []
        try {
          this.loading = true
          const res = await api(params)
          if (isArray(res)) {
            this.list = res
            this.emitChange()
            return
          }
          if (resultField) {
            this.list = get(res, resultField) || []
          }
          this.emitChange(res)
        } catch (error) {
          console.warn(error)
        } finally {
          this.loading = false
        }
      },
      async fetchLinkage(columnIndex = 0, picker) {
        const { apiPicker, paramsLink, resultField } = this.getProps
        if (!apiPicker || !isFunction(apiPicker)) return
        let list = []
        try {
          this.loading = true
          const res = await apiPicker(paramsLink)
          if (isArray(res)) {
            list = res
          }
          if (resultField) {
            list = get(res, resultField) || []
          }
          if (list && !isEmpty(list)) {
            list.forEach((item, index) => {
              const i = columnIndex + index
              if (this.getOptions.length > i) {
                picker.setColumnValues(i, item)
              }
            })
          }
        } catch (error) {
          console.warn(error)
        } finally {
          this.loading = false
        }
      },
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
        this.handleFetch(true)
        this.$emit('click')
        if (this.getProps.onClick && isFunction(this.getProps.onClick)) {
          this.getProps.onClick()
        }
      },
      async onChange(e) {
        const { columnIndex, picker = this.$refs.uPicker } = e
        this.fetchLinkage(columnIndex + 1, picker)
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
      emitChange(data) {
        this.$emit('options-change', data ?? this.getOptions)
        if (
          this.getProps.onOptionsChange &&
          isFunction(this.getProps.onOptionsChange)
        ) {
          this.getProps.onOptionsChange(data ?? this.getOptions)
        }
      },
      onConfirm(e) {
        const { afterTransformValues, prefix } = this.getProps
        let result = ''
        if (afterTransformValues && isFunction(afterTransformValues)) {
          result = afterTransformValues(e)
        } else {
          if (e.value && !isEmpty(e.value)) {
            result = e.value.map((item) => item.label).join(prefix)
          }
        }

        this.$emit('input', result)
        this.$emit('confirm', e)
        if (this.getProps.onConfirm && isFunction(this.getProps.onConfirm)) {
          this.getProps.onConfirm(e)
        }

        this.onClose()
      },
    },
  }
</script>

<style lang="scss" scoped>
	@import url('../../libs/css/free.css');
</style>
