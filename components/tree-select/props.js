export default {
  props: {
    // 是否显示日历弹窗
    show: {
      type: Boolean,
      default: false,
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
    // 传入的树形结构数据，每个对象必须包含唯一的keyValue值
    options: {
      type: Array,
      default: () => [],
    },
    // 顶部标题
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
    showToolbar: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },

    // props: {//多项模式(任意选中多项)
    //     label: 'name',
    //     children: 'children',
    //     multiple:true
    // },
    // props: {//多项模式(关联子级)
    //     label: 'name',
    //     children: 'children',
    //     multiple:true,
    //     checkStrictly:true
    // },
    // props: {//单选模式(任意一项)
    //     label: 'name',
    //     children: 'children',
    //     multiple:false,
    //     nodes:false
    // },
    // props: {//单选模式(只能选子集)
    //     label: 'name',
    //     children: 'children',
    //     multiple:false,
    //     nodes:true
    // }*
    //
    // treeSelect props 说明
    // 发送的数据结构
    /**
     * label String 指定选项标签为选项对象的某个属性值
     * children String  指定选项的子选项为选项对象的某个属性值
     * multiple Boolean 值为true时为多选，为false时是单选
     * checkStrictly Boolean 需要在多选模式下才传该值，checkStrictly为false时，可让父子节点取消关联，选择任意一级选项。为true时关联子级，可以全选
     * nodes Boolean 在单选模式下，nodes为false时，可以选择任意一级选项，nodes为true时，只能选择叶子节点
     */
    props: {
      type: Object,
      default: () => ({
        label: 'label',
        children: 'children',
        multiple: false,
        nodes: true,
      }),
    },
    // 是否开启选择操作，值是false时仅展示，无操作
    isCheck: {
      type: Boolean,
      default: true,
    },
    //传入的树形结构数据，每个对象必须包含唯一的keyValue值
    treeNone: {
      type: Array,
      default: () => [],
    },
    // 唯一的key值,必须是唯一的才行（纯展示可不带）
    keyValue: {
      type: String,
      default: 'keyValue',
    },
    // 是否开启搜索框
    isSearch: {
      type: Boolean,
      default: true,
    },
    // 默认选中值，根据keyValue字段匹配
	// [
	//     {
	//         [keyValue]: xxx,
	//         name: "xxx",
	//         user: false,
	//         path:[],//该值的路径
	//     },
	// ]
    checkList: {
      type: Array,
      default: () => [],
    },
  },
}
