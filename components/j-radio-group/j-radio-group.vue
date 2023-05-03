<template>
	<u-radio-group
		ref="groupRef"
		:name="getProps.name"
		:value="customValue"
		:shape="getProps.shape"
		:disabled="getProps.disabled"
		:active-color="getProps.activeColor"
		:inactive-color="getProps.inactiveColor"
		:size="getProps.size"
		:placement="getProps.placement"
		:label="getProps.label"
		:label-size="getProps.labelSize"
		:label-color="getProps.labelColor"
		:label-disabled="getProps.labelDisabled"
		:icon-color="getProps.iconColor"
		:icon-size="getProps.iconSize"
		:icon-placement="getProps.iconPlacement"
		:border-bottom="getProps.borderBottom"
	>
		<u-radio
			v-for="(item, index) in getOptions"
			:key="index"
			:custom-style="item.customStyle"
			:name="item.name"
			:shape="item.shape"
			:size="item.size"
			:color="item.color"
			:disabled="item.disabled"
			:active-color="item.activeColor"
			:inactive-color="item.inactiveColor"
			:icon-size="item.iconSize"
			:icon-color="item.iconColor"
			:label="item.label"
			:label-color="item.labelColor"
			:label-size="item.labelSize"
			:label-disabled="item.labelDisabled"
			@change="(e) => radioChange(e, item)"
		/>
	</u-radio-group>
</template>

<script>
import { isFunction, isEmpty } from '../../libs/utils/is.js';
import { deepMerge } from '../../libs/utils/deepMerge';
import { COMP_KEY } from '../j-form/const';
/**
 * radioRroup 单选框父组件
 * @description 单选框用于有一个选择，用户只能选择其中一个的场景。搭配u-radio使用
 * @tutorial https://www.uviewui.com/components/radio.html
 * @property {String | Number | Boolean}	value 			绑定的值
 * @property {Boolean}						disabled		是否禁用所有radio（默认 false ）
 * @property {String}						shape			外观形状，shape-方形，circle-圆形(默认 circle )
 * @property {String}						activeColor		选中时的颜色，应用到所有子Radio组件（默认 '#2979ff' ）
 * @property {String}						inactiveColor	未选中的颜色 (默认 '#c8c9cc' )
 * @property {String}						name			标识符
 * @property {String | Number}				size			组件整体的大小，单位px（默认 18 ）
 * @property {String}						placement		布局方式，row-横向，column-纵向 （默认 'row' ）
 * @property {String}						label			文本
 * @property {String}						labelColor		label的颜色 （默认 '#303133' ）
 * @property {String | Number}				labelSize		label的字体大小，px单位 （默认 14 ）
 * @property {Boolean}						labelDisabled	是否禁止点击文本操作checkbox(默认 false )
 * @property {String}						iconColor		图标颜色 （默认 '#ffffff' ）
 * @property {String | Number}				iconSize		图标的大小，单位px （默认 12 ）
 * @property {Boolean}						borderBottom	placement为row时，是否显示下边框 （默认 false ）
 * @property {String}						iconPlacement	图标与文字的对齐方式 （默认 'left' ）
 * @property {Object}						customStyle		组件的样式，对象形式
 * @event {Function} change 任一个radio状态发生变化时触发
 * @example <u-radio-group v-model="value"></u-radio-group>
 */

/**
 * radio 单选框
 * @description 单选框用于有一个选择，用户只能选择其中一个的场景。搭配u-radio-group使用
 * @tutorial https://www.uviewui.com/components/radio.html
 * @property {String | Number}	name			radio的名称
 * @property {String}			shape			形状，square为方形，circle为圆型
 * @property {Boolean}			disabled		是否禁用
 * @property {String | Boolean}	labelDisabled	是否禁止点击提示语选中单选框
 * @property {String}			activeColor		选中时的颜色，如设置parent的active-color将失效
 * @property {String}			inactiveColor	未选中的颜色
 * @property {String | Number}	iconSize		图标大小，单位px
 * @property {String | Number}	labelSize		label字体大小，单位px
 * @property {String | Number}	label			label提示文字，因为nvue下，直接slot进来的文字，由于特殊的结构，无法修改样式
 * @property {String | Number}	size			整体的大小
 * @property {String}			iconColor		图标颜色
 * @property {String}			labelColor		label的颜色
 * @property {Object}			customStyle		组件的样式，对象形式
 *
 * @event {Function} change 某个radio状态发生变化时触发(选中状态)
 * @example <u-radio :labelDisabled="false">门掩黄昏，无计留春住</u-radio>
 */

/**
 * qt 附加属性
 * @property {String}  labelField  label 自定义label别名使用
 * @property {String}   nameField  name   自定义name别名使用
 * @property {Object}  itemProps 接受checkbox属性，如果options已配置那么options内属性优先
 * @property {Array} options  子项列表数组， 子项属性值请参考checkbox属性
 */

export default {
	name: 'j-radio-group',
	mixins: [uni.$u.mpMixin, uni.$u.mixin],
	inject: {
		COMP_KEY,
	},
	data() {
		return {
			customValue: '',
		};
	},
	computed: {
		getValue() {
			const comp = this.COMP_KEY();
			return comp.value;
		},
		getProps() {
			const comp = this.COMP_KEY();
			const pick = deepMerge(
				{
					labelField: 'label',
					valueField: 'value',
					options: [],
					...uni.$u.props.radioGroup,
					itemProps: {
						...uni.$u.props.radio,

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
			);
			if (isEmpty(pick.options)) {
				// console.warn('options 不能为空')
			}
			return pick;
		},
		getItemProps() {
			return this.getProps.itemProps;
		},
		getOptions() {
			const { labelField, valueField, nameField, options } = this.getProps;

			return options.reduce((prev, next) => {
				if (next) {
					const mergeItem = deepMerge(this.getItemProps, {
						...next,
						label: next[labelField],
						name: next[valueField],
					});
					prev.push(mergeItem);
				}
				return prev;
			}, []);
		},
	},
	watch: {
		getValue: {
			handler: function(newValue) {
				this.customValue = newValue;
			},
			immediate: true,
			deep: true,
		},
	},
	methods: {
		radioChange(e, item) {
			this.$emit('input', e);

			if (item.onChange && isFunction(item.onChange)) {
				item.onChange(e, item);
			}

			if (item.onInput && isFunction(item.onInput)) {
				item.onInput(e);
			}
		},
	},
};
</script>

<style></style>
