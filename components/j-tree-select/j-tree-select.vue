<template>
	<view>
		<j-tag-group
			:value="customValue"
			:custom-style="getProps.customStyle"
			:type="getProps.type"
			:is-single="getIsSingle"
			:input-align="getProps.inputAlign"
			:disabled="getProps.disabled"
			:placeholder="getProps.placeholder"
			:size="getProps.size"
			:shape="getProps.shape"
			:text="getProps.text"
			:bg-color="getProps.bgColor"
			:color="getProps.color"
			:border-color="getProps.borderColor"
			:close-color="getProps.closeColor"
			:name="getProps.name"
			:plain-fill="getProps.plainFill"
			:plain="getProps.plain"
			:closable="!getProps.disabled"
			:icon="getProps.icon"
			@click="onClick"
			@clear="onClear"
		/>
		<TreeSelect
			:show="isOpen"
			:close-on-click-overlay="getProps.closeOnClickOverlay"
			:round="getProps.round"
			:shape="getProps.shape"
			:is-search="getProps.isSearch"
			:is-check="getProps.isCheck"
			:tree-none="getOptions"
			:props="getProps.props"
			:check-list="customValue"
			:title="getProps.title"
			:key-value="getProps.keyVlaue"
			:cancel-text="getProps.cancelText"
			:confirm-text="getProps.confirmText"
			:cancel-color="getProps.cancelColor"
			:confirm-color="getProps.confirmColor"
			:show-toolbar="getProps.showToolbar"
			:loading="loading"
			@close="onClose"
			@cancel="onCancel"
			@confirm="onConfirm"
		/>
	</view>
</template>

<script>
import JTagGroup from '../j-tag-group/j-tag-group.vue';
import TreeSelect from '../tree-select/tree-select.vue';
import { deepMerge } from '../../libs/utils/deepMerge';
import { COMP_KEY } from '../j-form/const';
import { omit, get, cloneDeep } from 'lodash-es';

import {
	isNullOrUnDef,
	isEmpty,
	isString,
	isArray,
	isObject,
	isFunction,
} from '../../libs/utils/is.js';
export default {
	name: 'j-tree-select',
	components: {
		JTagGroup,
		TreeSelect,
	},
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
			customValue: [],
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
					// JTagGroup 属性
					...uni.$u.props.tag,
					border: null,
					customStyle: {
						// #ifdef  H5 || APP-PLUS
						minHeight: '66rpx',
						// #endif

						//#ifdef MP
						// eslint-disable-next-line no-dupe-keys
						minHeight: '72rpx',
						// #endif
					},
					customClass: '',
					placeholder: '',
					inputAlign: 'left',
					onClick: null,
					onClear: null,

					// JTreeSelect属性
					api: null,
					params: {},
					resultField: null,
					immediate: false,
					alwaysLoad: false,
					prefix: '-',
					options: [],
					afterTransformValues: null,
					beforeTransformValues: null,
					onChange: null,
					onConfirm: null,
					onClose: null,
					onCancel: null,

					// TreeSelect属性
					closeOnClickOverlay: false,
					shape: 'square',
					round: 0,
					isSearch: true,
					isCheck: true,
					treeNone: [],
					keyValue: 'keyValue',
					props: {
						label: 'label',
						value: 'value',
						keyValue: 'keyValue',
						children: 'children',
						multiple: false,
						nodes: true,
						checkStrictly: false,
					},
					title: '',
					cancelText: '取消',
					confirmText: '确认',
					cancelColor: '#909193',
					confirmColor: '#3c9cff',
					showToolbar: true,
				},
				comp.compAttr
			);
			return pick;
		},
		getIsSingle() {
			return !this.getProps.props.multiple;
		},
		getOptions() {
			const { props, api, options, keyValue } = this.getProps;
			let result = [];
			if (api && isFunction(api)) {
				result = this.list;
			} else {
				result = options;
			}

			if (result && !isEmpty(result)) {
				return result.reduce((prev, next) => {
					if (next) {
						prev.push({
							...omit(next, [props.value, props.label, props.children]),
							label: next[props.label],
							value: next[props.value],
							[keyValue]: next[props.keyValue],
							children: next[props.children],
						});
					}
					return prev;
				}, []);
			}

			return [];
		},
	},
	watch: {
		getValue: {
			handler: function(nVal) {
				const { prefix, beforeTransformValues, props } = this.getProps;
				if (beforeTransformValues && isFunction(beforeTransformValues)) {
					this.customValue = beforeTransformValues(nVal);
				} else {
					if (isNullOrUnDef(nVal) || isEmpty(nVal)) {
						this.customValue = [];
						return;
					}
					if (isString(nVal)) {
						try {
							let res = nVal.split(prefix);
							this.customValue = [].concat(
								res.map((item) => {
									return {
										label: item,
										value: item,
										user:
											item[props.children] && !isEmpty(item[props.children])
												? false
												: true,
										children: [],
									};
								})
							);
						} catch (e) {
							this.customValue = [];
							throw 'value错误，检查是我是xxx,xxx格式';
						}
					} else if (isArray(nVal)) {
						if (isEmpty(nVal)) {
							this.customValue = [];
							return;
						}
						if (isArray(nVal[0])) {
							throw 'value错误，不能传入二维数组';
						}

						if (isString(nVal[0])) {
							this.customValue = [].concat(
								nVal.map((item) => {
									return {
										label: item,
										value: item,
										user:
											item[props.children] && !isEmpty(item[props.children])
												? false
												: true,
										children: [],
									};
								})
							);
						} else if (isObject(nVal[0])) {
							this.customValue = [].concat(
								nVal.map((item) => ({
									...item,
									label: item[props.label],
									value: item[props.value],
									user:
										item[props.children] && !isEmpty(item[props.children])
											? false
											: true,
									children: item[props.children],
								}))
							);
						} else {
							this.customValue = [].concat();
						}
					} else {
						this.customValue = [];
						throw '传入的数据有误, 请检查数据';
					}
				}
			},
			immediate: true,
			deep: true,
		},
		'getProps.immediate': {
			handler: function() {
				const { api, immediate, alwaysLoad } = this.getProps;
				api && isFunction(api) && immediate && !alwaysLoad && this.fetch();
			},
			immediate: true,
		},
		'getProps.alwaysLoad': {
			handler: function() {
				const { api, immediate, alwaysLoad } = this.getProps;
				api && isFunction(api) && immediate && !alwaysLoad && this.fetch();
			},
			immediate: true,
		},
		'getProps.params': {
			handler: function(newValue, oldValue) {
				const { api } = this.getProps;
				if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
					api && isFunction(api) && this.fetch();
				}
			},
			deep: true,
		},
	},
	methods: {
		async handleFetch(visible) {
			const { immediate, alwaysLoad } = this.getProps;
			if (visible) {
				if (alwaysLoad) {
					await this.fetch();
				} else if (!immediate && !this.isFirstLoad) {
					await this.fetch();
					this.isFirstLoad = true;
				}
			}
		},
		async fetch() {
			const { api, params, resultField } = this.getProps;
			if (!api || !isFunction(api)) return;
			this.list = [];
			try {
				this.loading = true;
				const res = await api(params);
				if (isArray(res)) {
					this.list = res;
					return;
				}
				if (resultField) {
					this.list = get(res, resultField) || [];
				}
			} catch (error) {
				console.warn(error);
			} finally {
				this.loading = false;
			}
		},
		onClick() {
			if (this.getProps.disabled) return;
			this.isOpen = true;
			this.handleFetch(true);
			this.$emit('click');
			if (this.getProps.onClick && isFunction(this.getProps.onClick)) {
				this.getProps.onClick();
			}
		},
		// 关闭遮罩
		onClose() {
			this.isOpen = false;
			this.$emit('close');
			if (this.getProps.onClose && isFunction(this.getProps.onClose)) {
				this.getProps.onClose();
			}
		},
		onCancel() {
			this.isOpen = false;
			this.$emit('cancel');
			if (this.getProps.onCancel && isFunction(this.getProps.onCancel)) {
				this.getProps.onCancel();
			}
		},
		// 清空所有值
		onClear(e) {
			let arr;
			if (e && !isEmpty(e)) {
				arr = this.customValue.filter((item) => item.value != e.value);
			}
			this.$emit('input', arr);
			this.$emit('change', arr);
			if (this.getProps.onInput && isFunction(this.getProps.onInput)) {
				this.getProps.onInput(arr);
			}
			if (this.getProps.onChange && isFunction(this.getProps.onChange)) {
				this.getProps.onChange(arr);
			}
		},
		async onConfirm(e) {
			const { afterTransformValues, props } = this.getProps;
			let result = '';
			if (afterTransformValues && isFunction(afterTransformValues)) {
				result = afterTransformValues(e);
			} else {
				if (this.getIsSingle) {
					result = e[0][props.label];
				} else {
					result = e;
				}
			}

			this.$emit('input', result);
			this.$emit('change', e);
			this.$emit('confirm', e);
			if (this.getProps.onInput && isFunction(this.getProps.onInput)) {
				this.getProps.onInput(result);
			}
			if (this.getProps.onChange && isFunction(this.getProps.onChange)) {
				this.getProps.onChange(e);
			}
			if (this.getProps.onConfirm && isFunction(this.getProps.onConfirm)) {
				this.getProps.onConfirm(e);
			}
			this.onClose();
		},
	},
};
</script>
