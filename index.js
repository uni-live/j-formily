import {
	uuId,
	objectToArray
} from './libs/utils/formAnalysis'
import regExp from './libs/utils/regExp'

function merg() {
	return uni.$j ? uni.$j : {}
}

const $j = {
	uuId,
	objectToArray,
	regExp,
	...merg()
}

// $u挂载到uni对象上

uni.$j = $j
const install = (Vue) => {
	// 同时挂载到uni和Vue.prototype中
	// #ifndef APP-NVUE
	// 只有vue，挂载到Vue.prototype才有意义，因为nvue中全局Vue.prototype和Vue.mixin是无效的
	Vue.prototype.$j = $j
	// #endif
}

export default {
	install,
	...$j,
}
