<template>
	<u-col
		v-if="getShow.isIfShow && isComponent"
		v-show="getShow.isShow"
		:custom-style="getColProps.customStyle"
		:custom-class="getColProps.customClass"
		:span="getColProps.span"
		:offset="getColProps.offset"
		:justify="getColProps.justify"
		:align="getColProps.align"
		:text-align="getColProps.align"
	>
		<!--  #ifdef  H5 || APP-PLUS -->
		<slot
			v-if="slot && slot.col"
			:name="slot.col"
			:field="getValues.field"
			:model="getValues.model"
			:values="getValues.values"
			:schema="getValues.schema"
			:compAttr="getCompAttr"
		/>
		<!--  #endif -->
		<!--  #ifdef MP -->
		<slot v-if="slot && slot.col" name="{{slot.col}}"></slot>
		<!--  #endif -->

		<u-form-item
			v-else
			:custom-style="getformItemAttr.customStyle"
			:prop="getformItemAttr.prop"
			:label="getformItemAttr.label"
			:border-bottom="getformItemAttr.borderBottom"
			:label-width="getformItemAttr.labelWidth"
			:right-icon="getformItemAttr.rightIcon"
			:left-icon="getformItemAttr.leftIcon"
			:required="getformItemAttr.required"
			:left-icon-style="getformItemAttr.leftIconStyle"
			@click="formItemClick"
		>
			<view class="flex flex-1">
				<view class="flex-1">
					<!--  #ifdef  H5 || APP-PLUS -->
					<slot
						v-if="slot && slot.comp"
						:name="slot.comp"
						:field="getValues.field"
						:model="getValues.model"
						:values="getValues.values"
						:schema="getValues.schema"
						:compAttr="getCompAttr"
					></slot>
					<!--  #endif -->
					<!--  #ifdef MP -->
					<slot v-if="slot && slot.comp" name="{{slot.comp}}"></slot>
					<!--  #endif -->

					<!--  #ifdef  H5 || APP-PLUS -->
					<component :is="getFormItemProps.schema.component" v-else @input="onInput" />
					<!--  #endif -->

					<!--  #ifdef MP -->
					<template v-if="!slot || !slot.comp">
						<JCheckboxGroup
							v-if="getFormItemProps.schema.component === 'JCheckboxGroup'"
							@input="onInput"
						/>
						<JInput
							v-else-if="getFormItemProps.schema.component === 'JInput'"
							@input="onInput"
						/>
						<JTextarea
							v-else-if="getFormItemProps.schema.component === 'JTextarea'"
							@input="onInput"
						/>
						<JRadioGroup
							v-else-if="getFormItemProps.schema.component === 'JRadioGroup'"
							@input="onInput"
						/>
						<JPicker
							v-else-if="getFormItemProps.schema.component === 'JPicker'"
							@input="onInput"
						/>
						<JTreeSelect
							v-else-if="getFormItemProps.schema.component === 'JTreeSelect'"
							@input="onInput"
						/>
						<JUpload
							v-else-if="getFormItemProps.schema.component === 'JUpload'"
							@input="onInput"
						/>
						<JNumberBox
							v-else-if="getFormItemProps.schema.component === 'JNumberBox'"
							@input="onInput"
						/>
						<JSearch
							v-else-if="getFormItemProps.schema.component === 'JSearch'"
							@input="onInput"
						/>
						<JDatatimePicker
							v-else-if="getFormItemProps.schema.component === 'JDatatimePicker'"
							@input="onInput"
						/>
						<JSwitch
							v-else-if="getFormItemProps.schema.component === 'JSwitch'"
							@input="onInput"
						/>
						<JTitle v-else-if="getFormItemProps.schema.component === 'JTitle'" />
						<JToolbar v-else-if="getFormItemProps.schema.component === 'JToolbar'" />
						<JGap v-else-if="getFormItemProps.schema.component === 'JGap'" />
						<JTpl v-else-if="getFormItemProps.schema.component === 'JTpl'" />
            <JRangHm v-else-if="getFormItemProps.schema.component === 'JRangHm'" />
					</template>
					<!--  #endif -->
				</view>
				<span v-if="getFormItemProps.schema.suffix" class="suffix"> {{ getSuffix }} </span>
			</view>
		</u-form-item>
	</u-col>
</template>
<script>
import { componentArray } from './registerGlobComp.js';
import { isBoolean, isFunction, isEmpty, isNullOrUnDef } from '../../libs/utils/is.js';
import { deepMerge } from '../../libs/utils/deepMerge';
import { createPlaceholderMessage } from './helper.js';
import { upperFirst } from 'lodash-es';
import JInput from '../j-input/j-input.vue';
import JTextarea from '../j-textarea/j-textarea.vue';
import JSwitch from '../j-switch/j-switch.vue';
import JPicker from '../j-picker/j-picker.vue';
import JCheckboxGroup from '../j-checkbox-group/j-checkbox-group.vue';
import JRadioGroup from '../j-radio-group/j-radio-group.vue';
import JUpload from '../j-upload/j-upload.vue';
import JNumberBox from '../j-number-box/j-number-box.vue';
import JSearch from '../j-search/j-search.vue';
import JTreeSelect from '../j-tree-select/j-tree-select.vue';
import JDatatimePicker from '../j-datatime-picker/j-datatime-picker.vue';
import JToolbar from '../j-toolbar/j-toolbar.vue';
import JTitle from '../j-title/j-title.vue';
import JGap from '../j-gap/j-gap.vue';
import JTpl from '../j-tpl/j-tpl.vue';
import JRangHm from '../j-rang-hm/j-rang-hm.vue'

import { JFORMITEM_KEY, COMP_KEY } from './const';
export default {
	name: 'j-form-item',
	components: {
		JInput,
		JTextarea,
		JSwitch,
		JPicker,
		JCheckboxGroup,
		JRadioGroup,
		JUpload,
		JNumberBox,
		JSearch,
		JTreeSelect,
		JDatatimePicker,
		JToolbar,
		JTitle,
		JGap,
		JTpl,
    JRangHm
	},
	inject: {
		JFORMITEM_KEY,
	},
	provide() {
		return {
			[COMP_KEY]: () => ({
				value: this.getCompAttr.value,
				compAttr: this.getCompAttr,
			}),
		};
	},
	props: {
		uuid: {
			type: String,
			default: '',
		},
	},
	computed: {
		getFormItemProps() {
			const formItem = this.JFORMITEM_KEY();
			const schema = formItem.formProps.schemas.find((item) => item.field === this.uuid);
			return {
				...formItem,
				schema: isNullOrUnDef(schema) || isEmpty(schema) ? {} : schema,
			};
		},
		getValues() {
			const { allDefaultValues, formModel, schema } = this.getFormItemProps;
			return {
				field: schema.field,
				model: formModel,
				values: {
					...allDefaultValues,
					...formModel,
				},
				schema: schema,
			};
		},
		getComponentsProps() {
			const { schema, formModel, formActionType } = this.getFormItemProps;
			let { componentProps = {} } = schema;
			if (isFunction(componentProps)) {
				componentProps = componentProps({ schema, formModel, formActionType }) ?? {};
			}
			return componentProps;
		},
		getDisable() {
			const { schema, formProps } = this.getFormItemProps;
			const { disabled: globDisabled } = formProps;
			const { disabled: dynamicDisabled } = schema;
			const { disabled: itemDisabled = false } = this.getComponentsProps;
			let disabled = !!globDisabled || itemDisabled;
			if (isBoolean(dynamicDisabled)) {
				disabled = dynamicDisabled;
			}
			if (isFunction(dynamicDisabled)) {
				disabled = dynamicDisabled(this.getValues);
			}
			return disabled;
		},
		getShow() {
			const { schema, formProps } = this.getFormItemProps;
			const { show, ifShow } = schema;
			const { showAdvancedButton } = formProps;
			const itemIsAdvanced = showAdvancedButton
				? isBoolean(schema.isAdvanced)
					? schema.isAdvanced
					: true
				: true;

			let isShow = true;
			let isIfShow = true;

			if (isBoolean(show)) {
				isShow = show;
			}
			if (isBoolean(ifShow)) {
				isIfShow = ifShow;
			}
			if (isFunction(show)) {
				isShow = show(this.getValues);
			}
			if (isFunction(ifShow)) {
				isIfShow = ifShow(this.getValues);
			}
			isShow = isShow && itemIsAdvanced;
			return { isShow, isIfShow };
		},
		getColProps() {
			const { schema, formProps } = this.getFormItemProps;
			const { baseColProps = {} } = formProps;
			const { colProps = {} } = schema;
			return deepMerge(baseColProps, colProps);
		},
		getSuffix() {
			const { schema } = this.getFormItemProps;
			const { suffix } = schema;
			return isFunction(suffix) ? suffix(this.getValues) : suffix;
		},
		slot() {
			const { schema } = this.getFormItemProps;
			const { slot } = schema;
			return slot;
		},
		isComponent() {
			const { schema } = this.getFormItemProps;
			const { component } = schema;
			return componentArray.includes(component);
		},
		getRequired() {
			const { schema } = this.getFormItemProps;
			const { required } = schema;
			return isFunction(required) ? required(this.getValues) : required;
		},
		getformItemAttr() {
			const { schema } = this.getFormItemProps;
			const { field, label, labelWidth, itemProps } = schema;

			const style = 'padding-left: 30rpx; padding-right: 30rpx; background-color: #ffffff;';

			return {
				customStyle: style,
				label: label,
				prop: field,
				required: this.getRequired,
				labelWidth: labelWidth,
				borderBottom: true,
				...itemProps,
			};
		},
		getCompAttr() {
			const { schema, formProps, formModel } = this.getFormItemProps;
			const { component, field, beforeSetComponent } = schema;

			const { autoSetPlaceHolder } = formProps;
			const propsData = {
				clearable: true,
				...this.getComponentsProps,
				disabled: this.getDisable,
			};

			const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder;
			if (isCreatePlaceholder && component) {
				propsData.placeholder =
					this.getComponentsProps?.placeholder || createPlaceholderMessage(component);
			}
			propsData.codeField = field;

			let codeValue;
			if (beforeSetComponent && isFunction(beforeSetComponent)) {
				codeValue = beforeSetComponent({
					field,
					schema,
					formModel,
					values: formModel[field],
				});
			} else {
				codeValue = formModel[field];
			}

			const bindValue = {
				value: codeValue,
			};

			return {
				...propsData,
				...bindValue,
			};
		},
	},
	watch: {
		'getShow.isIfShow': {
			async handler(newValue, oldValue) {
				const { schema } = this.getFormItemProps;
				if (newValue != oldValue && !newValue) {
					if (schema && schema.field) {
						await this.$nextTick();
						this.setFormModel(schema.field, null);
					}
				}
			},
			deep: true,
		},
	},
	methods: {
		formItemClick() {
			if (
				this.getformItemAttr &&
				!isEmpty(this.getformItemAttr) &&
				this.getformItemAttr.onClick &&
				isFunction(this.getformItemAttr.onClick)
			) {
				const { schema, formModel, formActionType } = this.getFormItemProps;
				const { field } = schema;
				this.getformItemAttr.onClick({
					field,
					schema,
					formModel,
					setFormModel: this.setFormModel,
				});
			}
		},
		setFormModel(field, args) {
			this.$emit('setFormModel', field, args);
		},
		onInput(args) {
			const { schema, formModel, formActionType } = this.getFormItemProps;
			const { changeEvent = 'input', field, beforeSetFormModel } = schema;
			const eventKey = `on${upperFirst(changeEvent)}`;
			if (this.getCompAttr[eventKey]) {
				this.getCompAttr[eventKey](args);
			}
			if (beforeSetFormModel && isFunction(beforeSetFormModel)) {
				beforeSetFormModel({
					field,
					schema,
					formModel,
					values: args,
					setFormModel: this.setFormModel,
				});
			} else {
				this.setFormModel(field, args);
			}
		},
	},
};
</script>
<style lang="scss" scoped>
@import url('../../libs/css/free.css');
</style>
