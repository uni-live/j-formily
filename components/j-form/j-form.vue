<template>
  <view class="j-form">
	<slot name="formHeader"></slot>
    <view class="j-form-content bg-white">
      <u--form
        ref="formElRef"
        :border-bottom="getProps.borderBottom"
        :custom-class="getProps.customClass"
        :custom-style="getProps.customStyle"
        :error-type="getProps.errorType"
        :label-align="getProps.labelAlign"
        :label-position="getProps.labelPosition"
        :label-style="getProps.labelStyle"
        :label-width="getProps.labelWidth"
        :model="formModel"
      >
        <u-row
          :align="getProps.align"
          :custom-class="getProps.customRowClass"
          :custom-style="getRowCustomStyle"
          :gutter="getProps.gutter"
          :justify="getProps.justify"
        >
          
          <JFormItem
            v-for="(schema, index) in getSchema"
            :key="schema.field"
            style="width: 100%"
            :uuid="schema.field"
            @setFormModel="setFormModel"
          >
            <!--  #ifdef  H5 || APP-PLUS -->
            <template v-for="item in Object.keys($slots)" #[item]="data">
              <slot :name="item" v-bind="data"></slot>
            </template>
            <!--  #endif -->

            <!--  #ifdef MP -->
            <template slot="{{schema.slot.comp}}">
              <slot name="{{schema.slot.comp}}"></slot>
            </template>
            <template slot="{{schema.slot.col}}">
              <slot name="{{schema.slot.col}}"></slot>
            </template>
            <!--  #endif -->
          </JFormItem>
          <view
            v-if="getProps.showActionButtonGroup"
            class="j-form__button"
          >
            <u-col
              :custom-style="getProps.actionColProps.customStyle"
              :span="getProps.actionColProps.span"
              :offset="getProps.actionColProps.offset"
              :justify="getProps.actionColProps.justify"
              :align="getProps.actionColProps.align"
              :text-align="getProps.actionColProps.textAlign"
            >
              <slot name="submitBefore"></slot>

              <slot v-if="$slots.submitButton" name="submitButton"></slot>
              <JFormSubmitButton
                v-if="getProps.showSubmitButton && !$slots.submitButton"
                class="flex flex-1"
                :action-button-loading="getProps.actionButtonLoading"
                :submit-button-options="getProps.submitButtonOptions"
              />
              <slot name="submitAfter"></slot>
            </u-col>
			<u-safe-bottom />
          </view>
        </u-row>
      </u--form>
    </view>
	 <slot name="formFooter"></slot>
    <view
      v-if="getProps.showActionButtonGroup && getProps.placeholder"
      class="j-form__placeholder"
      :style="{
        height: placeholderHeight + 'px',
      }"
    />
  </view>
</template>

<script>
  import { deepMerge } from '../../libs/utils/deepMerge.js'
  import { useFormEvents } from './mixin/useFormEvents.js'
  import { useFormValues } from './mixin/useFormValues.js'
  import JFormItem from './j-form-item.vue'
  import { useRules } from './mixin/useRules.js'
  import JFormSubmitButton from './j-form-submit-button.vue'
  import { isObject } from '../../libs/utils/is'
  import { JFORMITEM_KEY, JFORMSUBMITBUTTON_KEY, JFORM_KEY } from './const'

  export default {
    name: 'j-form',
    components: {
      JFormItem,
      JFormSubmitButton,
    },
    mixins: [useFormEvents, useFormValues, useRules],
    inject: { JFORM_KEY },
    provide() {
      return {
        [JFORMITEM_KEY]: () => ({
          allDefaultValues: this.defaultValueRef,
          formActionType: this.formActionType,
          formModel: this.formModel,
          formProps: {
			  ...this.getProps,
			  schemas: this.getSchema
          },
        }),
        [JFORMSUBMITBUTTON_KEY]: () => ({
          handleSubmit: this.handleSubmit,
        }),
      }
    },
    data() {
      return {
        formModel: {},
        defaultValueRef: {},
        propsRef: {},
        schemaRef: null,
        placeholderHeight: 0,
      }
    },
    computed: {
      getProps() {
        const form = this.JFORM_KEY()
        if (!form) {
          throw '请添加 jForm 配置项'
        }
        if (!form.props) {
          throw '请添加 jForm中props属性值, 具体属性请参考文档或者查看组件源码'
        }
        if (form.props && !isObject(form.props)) {
          throw 'props只能是Object, 具体属性请参考文档或者查看组件源码'
        }
        const props = deepMerge(
          {
            // form组件属性
            customStyle: {},
            customClass: '',
            ...uni.$u.props.form,
            labelPosition: 'top',
			labelWidth: '100%',
            model: {},
            rules: {},
            labelStyle: {},

            // Row组件属性
            customRowClass: '',
            customRowStyle: {},
            ...uni.$u.props.row,

            //Col组件属性
            baseColProps: {
              ...uni.$u.props.col,
              customStyle: {},
              customClass: '',
            },
            //表单配置项
            schemas: [],
            // 是否禁用表单
            disabled: false,
            // 是否自动设置PlaceHolder提示
            autoSetPlaceHolder: true,
            // 时间格式化规则 例如：[string, [string, string], string?]  ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD'],
            fieldMapToTime: [],
            // 重置时是否提交表单
            submitOnReset: false,
            // 转化时间
            transformDateFunc: (data) => data,
            //如果表单项有校验，会自动生成校验信息，该参数控制是否将字段中文名字拼接到自动生成的信息后方
            rulesMessageJoinLabel: true,

            //======= 操作按钮 button ======
            showActionButtonGroup: true, //是否显示操作按钮
            // 操作列Col配置
            actionColProps: {
              ...uni.$u.props.col,
              customStyle: { display: 'flex', flexDirection: 'row' },
            },
            // 是否显示正在加载按钮
            actionButtonLoading: false,
            // 显示确认按钮
            showSubmitButton: true,
            // 确认按钮配置
            submitButtonOptions: {
              ...uni.$u.props.button,
              customStyle: {},
              type: 'primary',
              shape: 'circle',
            },
            //自定义提交函数
            submitFunc: null,
			//是否底部占位
			placeholder: true
          },
          form.props
        )

        return { ...props, ...this.propsRef }
      },
      getRowCustomStyle() {
        const { customRowStyle } = this.getProps
        return `${uni.$u.addStyle(
          customRowStyle,
          'string'
        )}; flex-direction: column;!important`
      },
      getSchema() {
        const schemas = this.schemaRef || this.getProps.schemas
        return schemas
      },
      formActionType() {
        return {
          getFieldsValue: this.getFieldsValue,
          setFieldsValue: this.setFieldsValue,
          resetFields: this.resetFields,
          updateSchema: this.updateSchema,
          resetSchema: this.resetSchema,
          setProps: this.setProps,
          removeSchemaByFiled: this.removeSchemaByFiled,
          appendSchemaByField: this.appendSchemaByField,
          validate: this.validate,
          submit: this.handleSubmit,
          setFormModel: this.setFormModel,
		  clearSchema: this.clearSchema
        }
      },
    },
    watch: {
      'getProps.model': {
        handler: function () {
          const { model } = this.getProps
          if (!model) return
          this.setFieldsValue(model)
        },
        immediate: true,
        deep: true,
      },
      // 监听schema的变化，并给formModel赋值
      // 为什么初始化要给formModel,uview验证需要组件加载就给model
      getSchema: {
        handler: function (schemas) {
          for (const schema of schemas) {
            const { defaultValue, field } = schema
            const hasField = Reflect.has(this.formModel, field)

            if (!hasField) {
              this.$set(this.formModel, schema.field, defaultValue ?? null)
            }
          }
        },
        immediate: true,
        deep: true,
      },
      'getProps.showActionButtonGroup': {
        handler: function () {
          this.setPlaceholderHeight()
        },
        immediate: true,
        deep: true,
      },
    },
    mounted() {
      //初始化值
      this.initDefault()
      this.$emit('register', this.formActionType)
    },
    methods: {
      async setProps(formProps) {
        this.propsRef = deepMerge(this.propsRef || {}, formProps)
      },
      setFormModel(key, value) {
        this.$set(this.formModel, key, value)
      },
      // 设置用于防止塌陷元素的高度
      async setPlaceholderHeight() {
        if (!this.getProps.showActionButtonGroup) return
        // 延时一定时间
        await uni.$u.sleep(20)
        this.$uGetRect('.j-form__button').then(({ height = 50 }) => {
          // 修复IOS safearea bottom 未填充高度
          this.placeholderHeight = height
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import url('../../libs/css/free.css');
  view{
  	display: flex;
  	flex-direction: column;
  	flex-shrink: 0;
  	flex-grow: 0;
  	flex-basis: auto;
  	align-items: stretch;
  	align-content: flex-start;
  }
  .j-form {
    position: relative;
    @include flex(column);
    flex: 1;
    justify-content: center;

    &_content {
      @include flex(column);
    }
	
	&__button {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1030;
		/* #ifndef APP-PLUS-NVUE */
		display: flex !important;
		/* #endif */
		justify-content: center;
		align-items: center;
		width: 100%;
		background-color: #ffffff;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
	}
  }
</style>
