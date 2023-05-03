<template>
	<view
		class="flex justify-between px-2 py-1 bg-light align-center"
		:class="[customClass]"
		:style="[$u.addStyle(getProps.customStyle)]"
	>
		<text class="text-light-muted font-sm">{{ getProps.title }}</text>
		<view v-if="!getProps.disabled" class="" @tap="handleDel">
			<text class="text-primary font-sm">{{getProps.buttonDelText}}</text>
		</view>
    <view v-if="getProps.isView" class="" @tap="handleClick">
			<text class="text-primary font-sm">{{getProps.buttonViewText}}</text>
		</view>
	</view>
</template>

<script>
import { deepMerge } from '../../libs/utils/deepMerge'
import { COMP_KEY } from '../j-form/const'
import { isFunction } from '../../libs/utils/is'
export default {
	name: 'j-toolbar',
	mixins: [uni.$u.mpMixin, uni.$u.mixin],
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
					customStyle: {},
				    customClass: '',
					title: '',
					onDel: null,
          onClick: null,
          isView: false,
          buttonDelText: '删除',
          buttonViewText: '查看详情'
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
	methods: {
		handleDel() {
			this.$emit('del', {...this.getProps, value: this.customValue})
			if (this.getProps.onDel && isFunction(this.getProps.onDel)) {
				this.getProps.onDel({...this.getProps, value: this.customValue})
			}
		},
    handleClick() {
			this.$emit('click', {...this.getProps, value: this.customValue})
			if (this.getProps.onClick && isFunction(this.getProps.onClick)) {
				this.getProps.onClick({...this.getProps, value: this.customValue})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import url('../../libs/css/free.css');
</style>
