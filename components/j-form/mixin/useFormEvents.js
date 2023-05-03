import {
  isArray,
  isFunction,
  isObject,
  isString,
  isEmpty,
} from '../../../libs/utils/is.js'
import { deepMerge } from '../../../libs/utils/deepMerge'
import { handleInputNumberValue } from '../helper.js'
import { cloneDeep, uniqBy } from 'lodash-es'
import Vue from 'vue'

export const useFormEvents = {
  methods: {
    async resetFields() {
      const { resetFunc, submitOnReset } = this.getProps
      resetFunc && isFunction(resetFunc) && (await resetFunc())

      const formEl = this.$refs.formElRef
      if (!formEl) return

      Object.keys(this.formModel).forEach((key) => {
        this.$set(this.formModel, key, this.defaultValueRef[key])
        // this.formModel = Object.assign({}, this.formModel, {
        //   [key]: this.defaultValueRef[key],
        // })
      })

      this.$emit('reset', this.formModel)
      submitOnReset && this.handleSubmit()
    },

    /**
     * @description: Set form value
     */
    async setFieldsValue(values) {
      const fields = this.getSchema.map((item) => item.field).filter(Boolean)

      const validKeys = []
      Object.keys(values).forEach((key) => {
        const schema = this.getSchema.find((item) => item.field === key)
        let value = values[key]

        const hasKey = Reflect.has(values, key)

        value = handleInputNumberValue(schema?.component, value)
        // 0| '' is allow
        if (hasKey && fields.includes(key)) {
          // time type
          // if (this.itemIsDateType(key)) {
          //   if (Array.isArray(value)) {
          //     const arr = []
          //     for (const ele of value) {
          //       arr.push(ele ? dateUtil(ele) : null)
          //     }
          //     this.formModel = Object.assign({}, this.formModel, {
          //       [key]: arr,
          //     })
          //   } else {
          //     const { componentProps } = schema || {}
          //     let _props = componentProps
          //     if (typeof componentProps === 'function') {
          //       _props = _props(this.formModel)
          //     }
          //     this.formModel = Object.assign({}, this.formModel, {
          //       [key]: value
          //         ? _props?.valueFormat
          //           ? value
          //           : dateUtil(value)
          //         : null,
          //     })
          //   }
          // } else {
          //   this.formModel = Object.assign({}, this.formModel, {
          //     [key]: value,
          //   })
          // }
          this.$set(this.formModel, key, value)
          validKeys.push(key)
        }
      })
      // this.validate();
    },
    /**
     * @description: Delete based on field name
     */
    async removeSchemaByFiled(fields) {
      const schemaList = cloneDeep(this.getSchema)
      if (!fields) {
        return
      }

      let fieldList = isString(fields) ? [fields] : fields
      if (isString(fields)) {
        fieldList = [fields]
      }
      for (const field of fieldList) {
        this._removeSchemaByFiled(field, schemaList)
      }
      this.schemaRef = schemaList
    },

    /**
     * @description: Delete based on field name
     */
    _removeSchemaByFiled(field, schemaList) {
      if (isString(field)) {
        const index = schemaList.findIndex((schema) => schema.field === field)
        if (index !== -1) {
          delete this.formModel[field]
          schemaList.splice(index, 1)
        }
      }
    },
	/**
	* @description: 清空
	* @param {*}
	* @return: {*}
	* @author: *
	*/
	clearSchema(){
		 const schemaList = cloneDeep(this.getSchema);
		 schemaList.splice(0)
		 Object.keys(this.formModel).forEach((key) => {
			 delete this.formModel[key]
		 })
		 this.schemaRef = schemaList
	},

    /**
     * @description: Insert after a certain field, if not insert the last
     */
    async appendSchemaByField(schema, prefixField, first = false) {
      const schemaList = cloneDeep(this.getSchema)

      const index = schemaList.findIndex(
        (schema) => schema.field === prefixField
      )
      const hasInList = isEmpty(schemaList)
        ? true
        : schemaList.some((item) => item.field === prefixField || schema.field)

      if (!hasInList) return

      if (!prefixField || index === -1 || first) {
        first ? schemaList.unshift(schema) : schemaList.push(schema)
        this.schemaRef = schemaList
        return
      }
      if (index !== -1) {
        schemaList.splice(index + 1, 0, schema)
      }
      this.schemaRef = schemaList
    },

    async resetSchema(data) {
      let updateData = []
      if (isObject(data)) {
        updateData.push(data)
      }
      if (isArray(data)) {
        updateData = [...data]
      }

      const hasField = updateData.every(
        (item) => Reflect.has(item, 'field') && item.field
      )

      if (!hasField) {
        error(
          'All children of the form Schema array that need to be updated must contain the `field` field'
        )
        return
      }
      this.schemaRef = updateData
    },

    async updateSchema(data) {
      let updateData = []
      if (isObject(data)) {
        updateData.push(data)
      }
      if (isArray(data)) {
        updateData = [...data]
      }

      const hasField = updateData.every(
        (item) => Reflect.has(item, 'field') && item.field
      )

      if (!hasField) {
        error(
          'All children of the form Schema array that need to be updated must contain the `field` field'
        )
        return
      }
      const schema = []
      updateData.forEach((item) => {
        this.getSchema.forEach((val) => {
          if (val.field === item.field) {
            const newSchema = deepMerge(val, item)
            schema.push(newSchema)
          } else {
            schema.push(val)
          }
        })
      })
      this.schemaRef = uniqBy(schema, 'field')
    },

    getFieldsValue() {
      const formEl = this.$refs.formElRef
      if (!formEl) return {}
      return this.handleFormValues(this.formModel)
    },

    /**
     * @description: Is it time
     */
    // itemIsDateType(key) {
    //   return this.getSchema.some((item) => {
    //     return item.field === key
    //       ? dateItemType.includes(item.component)
    //       : false
    //   })
    // },

    // async validateFields(nameList) {
    // 	return this.formElRef?.validateFields(nameList);
    // },

    async validate() {
      const formEl = this.$refs.formElRef
      if (!formEl) return
      const rules = this.allRule()
      if (isEmpty(rules)) {
        return true
      } else {
        await formEl.setRules(rules)
        return await formEl.validate()
      }
    },

    /**
     * @description: Form submission
     */
    async handleSubmit(e) {
      e && e.preventDefault()
      const { submitFunc } = this.getProps
      if (submitFunc && isFunction(submitFunc)) {
        await submitFunc()
        return
      }
      const formEl = this.$refs.formElRef
      if (!formEl) return
      try {
        const valid = await this.validate()
        if (valid) {
          const res = this.handleFormValues(this.formModel)
          this.$emit('submit', res)
        } else {
          throw new Error('验证未通过')
        }
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}
