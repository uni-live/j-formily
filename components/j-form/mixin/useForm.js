export const useForm = {
  data() {
    return {
      formRef: null,
      loadedRef: false,
    }
  },
  methods: {
    async getForm() {
      const form = this.formRef
      await this.$nextTick()
      return form
    },
    register(instance) {
      if (this.loadedRef && instance === this.formRef) return

      this.formRef = instance
      this.loadedRef = true
    },
    async setProps(formProps) {
      const form = await this.getForm()
      form.setProps(formProps)
    },

    async updateSchema(data) {
      const form = await this.getForm()
      form.updateSchema(data)
    },

    async resetSchema(data) {
      const form = await this.getForm()
      form.resetSchema(data)
    },

    async resetFields() {
      this.getForm().then(async (form) => {
        await form.resetFields()
      })
    },

    async removeSchemaByFiled(field) {
      const form = await this.getForm()
      form.removeSchemaByFiled(field)
    },

    async getFieldsValue() {
      const form = await this.getForm()
      return form.getFieldsValue()
    },

    async setFieldsValue(values) {
      const form = await this.getForm()
      form.setFieldsValue(values)
    },

    async appendSchemaByField(schema, prefixField, first) {
      const form = await this.getForm()
      form.appendSchemaByField(schema, prefixField, first)
    },

    async submit() {
      const form = await this.getForm()
      return form.submit()
    },

    async validate(nameList) {
      const form = await this.getForm()
      return form.validate(nameList)
    },

    async setFormModel(key, value) {
      const form = await this.getForm()
      return form.setFormModel(key, value)
    },
	async clearSchema() {
		const form = await this.getForm()
		return form.clearSchema()
	}
  },
  destroyed() {
    this.formRef = null
    this.loadedRef = null
  },
}
