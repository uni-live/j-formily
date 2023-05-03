import {
  isFunction,
  isNull,
  isBoolean,
  isNullOrUnDef,
  isEmpty,
  isObject,
} from '../../../libs/utils/is.js'
import { cloneDeep } from 'lodash-es'
import { createPlaceholderMessage, setComponentRuleType } from '../helper.js'

export const useRules = {
  methods: {
    allRule() {
      const rules = {}
      this.getSchema.forEach((item) => {
        if (
          !isNullOrUnDef(this.handleRules(item)) &&
          !isEmpty(this.handleRules(item))
        ) {
          rules[item.field] = this.handleRules(item)
        }
      })
      return rules
    },
    handleRules(schema) {
      const getValues = {
        field: schema.field,
        model: this.formModel,
        values: {
          ...this.defaultValueRef,
          ...this.formModel,
        },
        schema: schema,
      }

      const {
        rules: defRules = [],
        component,
        rulesMessageJoinLabel,
        label,
        dynamicRules,
        required,
      } = schema

      if (isFunction(dynamicRules)) {
        return dynamicRules(getValues)
      }

      let rules = cloneDeep(defRules)

      const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } =
        this.getProps

      const joinLabel = Reflect.has(schema, 'rulesMessageJoinLabel')
        ? rulesMessageJoinLabel
        : globalRulesMessageJoinLabel
      const defaultMsg =
        createPlaceholderMessage(component) + `${joinLabel ? label : ''}`

      function validator(rule, value) {
        rule.message = rule.message || defaultMsg
        if (value === undefined || isNull(value)) {
          // 空值
          return false
        } else if (Array.isArray(value) && value.length === 0) {
          rule.type = 'array'
          // 数组类型
          return false
        } else if (typeof value === 'string' && value.trim() === '') {
          // 空字符串
          return false
        } else if (typeof value === 'object' && isObject(value)) {
          return false
        }
        return true
      }

      function getShow() {
        const { show, ifShow } = schema

        let isShow = true
        let isIfShow = true

        if (isBoolean(show)) {
          isShow = show
        }
        if (isBoolean(ifShow)) {
          isIfShow = ifShow
        }
        if (isFunction(show)) {
          isShow = show(getValues)
        }
        if (isFunction(ifShow)) {
          isIfShow = ifShow(getValues)
        }
        return {
          isShow,
          isIfShow,
        }
      }

      const getRequired = isFunction(required) ? required(getValues) : required

      if ((!rules || rules.length === 0) && getRequired) {
        rules = [
          {
            required: getRequired,
            trigger: ['change', 'blur'],
            validator,
          },
        ]
      }

      // const requiredRules = rules.findIndex((rule) =>
      //   Reflect.has(rule, 'required')
      // )

      // if (rules && rules.length > 0 && getRequired && requiredRules < 0) {
      //   rules.push({
      //     required: getRequired,
      //     trigger: ['change', 'blur'],
      //     validator,
      //   })
      // }

      const requiredRuleIndex = rules.findIndex(
        (rule) =>
          Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator')
      )
      if (requiredRuleIndex !== -1) {
        const rule = rules[requiredRuleIndex]
        const { isShow } = getShow()
        if (!isShow) {
          rule.required = false
        }
        if (component) {
          if (!Reflect.has(rule, 'type')) {
            rule.type = component === 'JNumberBox' ? 'number' : 'string'
          }

          rule.message = rule.message || defaultMsg

          if (component.includes('JInput')) {
            rule.whitespace = true
          }
          const valueFormat = this.getComponentsProps?.valueFormat
          setComponentRuleType(rule, component, valueFormat)
        }
      }

      return rules
    },
  },
}
