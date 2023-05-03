<template>
	<view
		:class="['flex align-center', getProps.customClass]"
		:style="[$u.addStyle(getProps.customStyle)]"
		@tap="handleClick"
	>
		<text>{{ customValue }}</text>
	</view>
</template>

<script>
import { deepMerge } from '../../libs/utils/deepMerge';
import { COMP_KEY } from '../j-form/const';
import { isFunction } from '../../libs/utils/is';
export default {
	name: 'j-tpl',
	mixins: [uni.$u.mpMixin, uni.$u.mixin],
	inject: {
		COMP_KEY,
	},
	data() {
		return {
			customValue: null,
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
					onClick: null,
				},
				comp.compAttr
			);
			return pick;
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
		handleClick() {
			this.$emit('click', { ...this.getProps, value: this.customValue });
			if (this.getProps.onClick && isFunction(this.getProps.onClick)) {
				this.getProps.onClick({ ...this.getProps, value: this.customValue });
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import url('../../libs/css/free.css');
</style>
