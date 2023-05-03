<template>
	<u-gap
		:customStyle="getProps.customStyle"
		:customClass="getProps.customClass"
		:height="getProps.height"
		:bgColor="getProps.bgColor"
		:marginTop="getProps.marginTop"
		:marginBottom="getProps.marginBottom"
	 />
</template>

<script>
import { deepMerge } from '../../libs/utils/deepMerge'
import { COMP_KEY } from '../j-form/const'
import { isFunction } from '../../libs/utils/is'
import gapProps from '@/uni_modules/uview-ui/components/u-gap/props'
export default {
	name: 'j-gap',
	mixins: [uni.$u.mpMixin, uni.$u.mixin, gapProps],
	inject: {
		COMP_KEY,
	},
	data() {
		return {
			customValue: null
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
					...uni.$u.props.gap,
					customStyle: {},	
				    customClass: '',
					height: 20,
					bgColor: '#f8f8f8'
				},
				comp.compAttr
			)
			return pick
		},
	},
	watch: {
	  getValue: {
	    handler: function (newValue) {
	      this.customValue = newValue
	    },
	    immediate: true,
	    deep: true,
	  },
	},
}
</script>

<style lang="scss" scoped>
@import url('../../libs/css/free.css');
</style>
