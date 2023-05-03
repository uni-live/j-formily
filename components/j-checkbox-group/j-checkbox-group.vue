<template>
  <u-checkbox-group
    ref="groupRef"
    :name="getProps.name"
    :value="customValue"
    :shape="getProps.shape"
    :disabled="getProps.disabled"
    :active-color="getProps.activeColor"
    :inactive-color="getProps.inactiveColor"
    :size="getProps.size"
    :placement="getProps.placement"
    :label-size="getProps.labelSize"
    :label-color="getProps.labelColor"
    :label-disabled="getProps.labelDisabled"
    :icon-color="getProps.iconColor"
    :icon-size="getProps.iconSize"
    :icon-placement="getProps.iconPlacement"
    :border-bottom="getProps.borderBottom"
  >
    <u-checkbox
      v-for="(item, index) in getOptions"
      :key="index"
      :custom-style="item.customStyle"
      :name="item.name"
      :shape="item.shape"
      :size="item.size"
      :checked="item.checked"
      :disabled="item.disabled"
      :active-color="item.activeColor"
      :inactive-color="item.inactiveColor"
      :icon-size="item.iconSize"
      :icon-color="item.iconColor"
      :label="item.label"
      :label-color="item.labelColor"
      :label-size="item.labelSize"
      :label-disabled="item.labelDisabled"
      @change="(e) => checkboxChange(e, item)"
    />
  </u-checkbox-group>
</template>

<script>
  import {
    isFunction,
    isArray,
    isString,
    isEmpty,
  } from '../../libs/utils/is.js'
  import { deepMerge } from '../../libs/utils/deepMerge'
  import { COMP_KEY } from '../j-form/const'
  /**
   * checkboxGroup 复选框组
   * @description 复选框组件一般用于需要多个选择的场景，该组件功能完整，使用方便
   * @tutorial https://www.uviewui.com/components/checkbox.html
   * @property {String}			name			标识符
   * @property {Array}			value			绑定的值
   * @property {String}			shape			形状，circle-圆形，square-方形 （默认 'square' ）
   * @property {Boolean}			disabled		是否禁用全部checkbox （默认 false ）
   * @property {String}			activeColor		选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值 （默认 '#2979ff' ）
   * @property {String}			inactiveColor	未选中的颜色 （默认 '#c8c9cc' ）
   * @property {String | Number}	size			整个组件的尺寸 单位px （默认 18 ）
   * @property {String}			placement		布局方式，row-横向，column-纵向 （默认 'row' ）
   * @property {String | Number}	labelSize		label的字体大小，px单位  （默认 14 ）
   * @property {String}			labelColor		label的字体颜色 （默认 '#303133' ）
   * @property {Boolean}			labelDisabled	是否禁止点击文本操作 (默认 false )
   * @property {String}			iconColor		图标颜色 （默认 '#ffffff' ）
   * @property {String | Number}	iconSize		图标的大小，单位px （默认 12 ）
   * @property {String}			iconPlacement	勾选图标的对齐方式，left-左边，right-右边  （默认 'left' ）
   * @property {Boolean}			borderBottom	placement为row时，是否显示下边框 （默认 false ）
   * @event {Function}	change	任一个checkbox状态发生变化时触发，回调为一个对象
   * @event {Function}	input	修改通过v-model绑定的值时触发，回调为一个对象
   * @example <u-checkbox-group></u-checkbox-group>
   */

  /**
   * checkbox 复选框
   * @description 复选框组件一般用于需要多个选择的场景，该组件功能完整，使用方便， 依赖于uview 支持uviwe的属性
   * @tutorial https://www.uviewui.com/components/form.html
   * @property {String | Number | Boolean}	name			checkbox组件的标示符
   * @property {String}						shape			形状，square为方形，circle为圆型
   * @property {String | Number}				size			整体的大小
   * @property {Boolean}						checked			是否默认选中
   * @property {String | Boolean}				disabled		是否禁用
   * @property {String}						activeColor		选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
   * @property {String}						inactiveColor	未选中的颜色
   * @property {String | Number}				iconSize		图标的大小，单位px
   * @property {String}						iconColor		图标颜色
   * @property {String | Number}				label			label提示文字，因为nvue下，直接slot进来的文字，由于特殊的结构，无法修改样式
   * @property {String}						labelColor 		label的颜色
   * @property {String | Number}				labelSize		label的字体大小，px单位
   * @property {String | Boolean}				labelDisabled	是否禁止点击提示语选中复选框
   * @property {Object}						customStyle		定义需要用到的外部样式
   *
   * @example <u-form-item label="姓名" prop="userInfo.name" borderBottom ref="item1"></u-form-item>
   */

  /**
   * qt 附加属性
   * @property {String}  labelField  label 自定义label别名使用
   * @property {String}   nameField  name   自定义name别名使用
   * @property {Boolean} toString  返回值是否需要数组转字符串
   * @property {Object}  itemProps 接受checkbox属性，如果options已配置那么options内属性优先
   * @property {String} prefix    分隔符 返回值或接收值切割字符串使用
   * @property {Array} options  子项列表数组， 子项属性值请参考checkbox属性
   */

  export default {
    name: 'j-checkbox-group',
    mixins: [uni.$u.mpMixin, uni.$u.mixin],
    inject: {
      COMP_KEY,
    },
    data() {
      return {
        customValue: [],
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
            prefix: ',',
            toString: false,
            labelField: 'label',
            nameField: 'name',
            valueField: 'value',
            options: [],
            afterTransformValues: null,
            beforeTransformValues: null,
            ...uni.$u.props.checkboxGroup,
            itemProps: {
              ...uni.$u.props.checkbox,

              customStyle: {
                marginRight: '16rpx',
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
          },
          comp.compAttr
        )
        if (isEmpty(pick.options)) {
          console.warn('options 不能为空')
        }
        return pick
      },
      getItemProps() {
        return this.getProps.itemProps
      },
      getOptions() {
        const { labelField, valueField, nameField, options } = this.getProps

        return options.reduce((prev, next) => {
          if (next) {
            const mergeItem = deepMerge(this.getItemProps, {
              ...next,
              label: next[labelField],
              name: next[nameField],
              value: next[valueField],
            })
            prev.push(mergeItem)
          }
          return prev
        }, [])
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
            if (isString(newValue)) {
              values = newValue.split(prefix)
            } else {
              values = newValue
            }
          }

          this.customValue = values ?? []
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      checkboxChange(_, item) {
        const values = []
        let result = null
        const { prefix, toString, afterTransformValues } = this.getProps
        this.$refs.groupRef.children.map((child) => {
          // 将被选中的checkbox，放到数组中返回
          if (child.isChecked) {
            values.push(child.name)
          }
        })

        if (afterTransformValues && isFunction(afterTransformValues)) {
          result = afterTransformValues(values, item)
        } else {
          if (toString && isArray(values)) {
            result = values.join(prefix)
          } else {
            result = values
          }
        }

        this.$emit('input', result, item)

        if (item.onChange && isFunction(item.onChange)) {
          item.onChange(result, item)
        }

        if (item.onInput && isFunction(item.onInput)) {
          item.onInput(result)
        }
      },
    },
  }
</script>

<style></style>
