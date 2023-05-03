// resultField: {
//   type: String,
// },
// labelField: {
//   type: String,
//   default: 'label',
// },
// valueField: {
//   type: String,
//   default: 'value',
// },
// //获取数据方法
// api: {
//   type: Function,
//   default: () => [],
// },
// params: {
//   type: Object,
//   default: () => {},
// }, // 顶部标题

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    showToolbar: {
      type: Boolean,
      default: true,
    },
    focus: {
      type: Boolean,
      default: false,
    },
    // 传入的树形结构数据，每个对象必须包含唯一的keyValue值
    options: {
      type: Array,
      default: () => [],
    },
    // 是否允许点击遮罩关闭 (默认 false )
    closeOnClickOverlay: {
      type: Boolean,
      default: false,
    },
    round: {
      type: [Boolean, String, Number],
      default: 0,
    },
    shape: {
      type: String,
      default: 'square',
    },
    placeholder: {
      type: String,
      default: '请输入关键字',
    },
    title: {
      type: String,
      default: '',
    },
    // 取消按钮的文字
    cancelText: {
      type: String,
      default: '取消',
    },
    // 确认按钮的文字
    confirmText: {
      type: String,
      default: '确认',
    },
    // "取消"按钮的颜色
    cancelColor: {
      type: String,
      default: '#909193',
    },
    // "确定"按钮的颜色
    confirmColor: {
      type: String,
      default: '#3c9cff',
    },
    loading: {
      type: Boolean,
      default: false,
    },
	status: {
		type: String,
		default: 'loadmore'
	}
  },
}
