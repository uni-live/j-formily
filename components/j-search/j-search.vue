<template>
	<view>
		<view class="flex" @click="onClick">
			<u--input
				:value="customValue"
				:fixed="getProps.fixed"
				:disabled="getProps.disabled"
				:disabled-color="getProps.disabledColor"
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

		<Search
			:show="isOpen"
			:options="getOptions"
			:loading="loading"
			:show-toolbar="getProps.showToolbar"
			:close-on-click-overlay="getProps.closeOnClickOverlay"
			:round="getProps.round"
			:shape="getProps.shape"
			:placeholder="getProps.placeholder"
			:title="getProps.title"
			:cancel-text="getProps.cancelText"
			:confirm-text="getProps.confirmText"
			:cancel-color="getProps.cancelColor"
			:confirm-color="getProps.confirmColor"
			:status="status"
			@searchChange="(e) => fetch(e, 'search')"
			@confirm="onConfirm"
			@cancel="onCancel"
			@close="onClose"
			@scrolltolower="scrolltolower"
		/>
	</view>
</template>

<script>
import { isFunction, isEmpty, isArray } from '../../libs/utils/is.js'
import Search from '../search/search.vue'
import { deepMerge } from '../../libs/utils/deepMerge'
import { COMP_KEY } from '../j-form/const'
import { omit, get } from 'lodash-es'

export default {
	name: 'j-search',
	components: {
		Search,
	},
	mixins: [uni.$u.mpMixin, uni.$u.mixin],
	inject: {
		COMP_KEY,
	},
	data() {
		return {
			loading: false,
			isOpen: false,
			list: [],
			customValue: null,
			status: 'loadmore',
			pageNo: 1,
			pageSize: 20,
			isFirst: true
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
					onConfirm: null,
					onClose: null,
					onCancel: null,
					onClear: null,
					beforeOpenModel: null,
					afterTransformValues: null,
					beforeTransformValues: null,

					// search配置项
					...uni.$u.props.toolbar,
					...uni.$u.props.search,
					shape: 'square',
					round: 0,
					closeOnClickOverlay: false,
					showToolbar: true,
					defaultIndex: null,
					immediate: true,
					api: null,
					params: {},
					resultField: null,
					labelField: 'label',
					valueField: 'value',
					pageNoField: 'pageNo',
					pageSizeField: 'pageSize',
				},
				comp.compAttr
			)
			return pick
		},
		isClearableIcon() {
			return this.customValue && !this.getProps.disabled
		},
		getOptions() {
			const { labelField, valueField } = this.getProps
			if (this.list && !isEmpty(this.list)) {
				return this.list.reduce((prev, next) => {
					if (next) {
						prev.push({
							...omit(next, [labelField, valueField]),
							label: next[labelField],
							value: next[valueField],
						})
					}
					return prev
				}, [])
			}

			return []
		},
	},
	watch: {
		getValue: {
			handler: function(newValue) {
				const { beforeTransformValues } = this.getProps
				let values = null
				if (
					beforeTransformValues &&
					isFunction(beforeTransformValues)
				) {
					values = beforeTransformValues(newValue)
				} else {
					values = newValue
				}

				this.customValue = values
			},
			immediate: true,
			deep: true,
		},
	},
	mounted() {
		if (this.getProps.immediate) {
			this.fetch('', 'init')
		}
	},
	methods: {
		async fetch(e, type) {
			if (type == 'search') {
				this.pageNo = 1
				this.list = []
			}
			
			const { api, params, resultField } = this.getProps
			if (!api || !isFunction(api)) return
			
			const data = deepMerge(params, {
				value: e,
				[this.pageNoField]: this.pageNo,
				[this.pageSizeField]: this.pageSize,
			})
			let listData = []
			try {
				this.loading = true
				this.status = 'loading'
				const res = await api(data)
				if (isArray(res)) {
					listData = res
				}
				if (resultField) {
					listData = get(res, resultField) || []
				}
				
				this.list = this.list.concat(listData)
				
				if(!this.isFirst && type == 'scroll'){
					this.pageNo++
				}
				if(listData.length < this.pageSize){
					this.status = 'nomore'
				}
			} catch (error) {
				console.warn(error)
			} finally {
				this.isFirst = false
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
		async onConfirm(item) {
			let values = ''
			if (
				this.beforeSetFormModel &&
				isFunction(this.beforeSetFormModel)
			) {
				values = await this.beforeSetFormModel(item)
			} else {
				values = item.label
			}
			this.$emit('input', values)
			this.$emit('confirm', item)
			if (
				this.getProps.onConfirm &&
				isFunction(this.getProps.onConfirm)
			) {
				this.getProps.onConfirm()
			}
			this.onClose()
		},
		async onClick() {
			if (this.getProps.disabled) return
			if (this.beforeOpenModel && isFunction(this.beforeOpenModel)) {
				if (await this.beforeOpenModel()) {
					this.isOpen = true
				}
			} else {
				this.isOpen = true
			}
		},
		async scrolltolower(e) {
			if(this.status == 'loadmore'){
				this.fetch(e, 'scroll')
			}
		},
	},
}
</script>
<style lang="scss" scoped>
@import url('../../libs/css/free.css');
</style>
