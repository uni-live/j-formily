export default {
  props: {
    value: {
      type: [String, Array],
      default: () => [],
    },
    inputAlign: {
      type: String,
      default: 'left',
    },
    placeholder: {
      type: String,
      default: '',
    },
    // 高度，单位rpx
    height: {
      type: [Number, String],
      default: '',
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: true,
    },
    //是否是单选
    isSingle: {
      type: Boolean,
      default: true,
    },
  },
}
