import {
  isArray,
  isFunction,
  isObject,
  isString,
  isNullOrUnDef,
} from '../../../libs/utils/is.js'
import { set } from 'lodash-es'

export const useFormValues = {
  methods: {
    handleFormValues(values) {
      if (!isObject(values)) {
        return {}
      }
      const res = {}
      for (const item of Object.entries(values)) {
        let [, value] = item
        const [key] = item
        if (
          !key ||
          (isArray(value) && value.length === 0) ||
          isFunction(value)
        ) {
          continue
        }
        const transformDateFunc = this.getProps.transformDateFunc
        if (isObject(value)) {
          value = transformDateFunc?.(value)
        }
        if (
          isArray(value) &&
          value[0]?._isAMomentObject &&
          value[1]?._isAMomentObject
        ) {
          value = value.map((item) => transformDateFunc?.(item))
        }
        // Remove spaces
        if (isString(value)) {
          value = value.trim()
        }
        set(res, key, value)
      }
      return this.handleRangeTimeValue(res)
    },
    handleRangeTimeValue(values) {
      const fieldMapToTime = this.getProps.fieldMapToTime

      if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
        return values
      }

      for (const [
        field,
        [startTimeKey, endTimeKey],
        // format = 'YYYY-MM-DD',
      ] of fieldMapToTime) {
        if (!field || !startTimeKey || !endTimeKey || !values[field]) {
          continue
        }

        const [startTime, endTime] = values[field]

        values[startTimeKey] = startTime
        values[endTimeKey] = endTime
        Reflect.deleteProperty(values, field)
      }

      return values
    },
    initDefault() {
      const schemas = this.getSchema
      const obj = {}
      schemas.forEach((item) => {
        const { defaultValue, component, field } = item
        if (component === 'JNumberBox') {
          obj[field] = 0
          this.$set(this.formModel, field, 0)
        }
        if (component === 'JSwitch') {
          obj[field] = false
          this.$set(this.formModel, field, false)
        }
        if (!isNullOrUnDef(defaultValue)) {
          obj[field] = defaultValue
          this.$set(this.formModel, field, defaultValue)
        }
      })
      this.defaultValueRef = obj
    },
  },
}
