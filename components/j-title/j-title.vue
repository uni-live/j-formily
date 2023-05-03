<template>
	<view
		:class="[getProps.customClass]"
		:style="[$u.addStyle(getProps.customStyle)]"
	>
		{{ getProps.label }}
	</view>
</template>

<script>
import { deepMerge } from '../../libs/utils/deepMerge'
import { COMP_KEY } from '../j-form/const'
export default {
	name: 'j-title',
	mixins: [uni.$u.mpMixin, uni.$u.mixin],
	inject: {
		COMP_KEY,
	},
	computed: {
		getProps() {
			const comp = this.COMP_KEY()

			const pick = deepMerge(
				{
					customStyle: {},
					customClass: 'font font-weight-normaler',
					label: '',
				},
				comp.compAttr
			)
			return pick
		},
	},
	data() {
		return {}
	},
	methods: {},
}
</script>

<style lang="scss" scoped>
@import url('../../libs/css/free.css');
</style>
