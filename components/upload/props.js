export default {
	props: {
		// 接受的文件类型, 可选值为all media image file video
		accept: {
			type: String,
			default: 'image'
		},
		//是否显示组件自带的图片预览功能
		showUploadList: {
			type: Boolean,
			default: true,
		},
		// 后端地址
		action: {
			type: String,
			default: "",
		},
		// 最大上传数量
		maxCount: {
			type: [String, Number],
			default: 52,
		},
		//  是否显示进度条
		showProgress: {
			type: Boolean,
			default: true,
		},
		// 是否启用
		disabled: {
			type: Boolean,
			default: false,
		},
		// 预览上传的图片时的裁剪模式，和image组件mode属性一致
		imageMode: {
			type: String,
			default: "aspectFill",
		},
		// 头部信息
		header: {
			type: Object,
			default () {
				return {};
			},
		},
		// 额外携带的参数
		formData: {
			type: Object,
			default () {
				return {};
			},
		},
		// 上传的文件字段名
		name: {
			type: String,
			default: "file",
		},
		// 所选的图片的尺寸, 可选值为original compressed
		sizeType: {
			type: Array,
			default () {
				return ["original", "compressed"];
			},
		},
		sourceType: {
			type: Array,
			default () {
				return ["album", "camera"];
			},
		},
		// 是否在点击预览图后展示全屏图片预览
		previewFullImage: {
			type: Boolean,
			default: false,
		},
		// 是否开启图片多选，部分安卓机型不支持
		multiple: {
			type: Boolean,
			default: true,
		},
		// 是否展示删除按钮
		deletable: {
			type: Boolean,
			default: true,
		},
		// 文件大小限制，单位为byte
		maxSize: {
			type: [String, Number],
			default: Number.MAX_VALUE,
		},
		// 显示已上传的文件列表
		fileList: {
			type: Array,
			default () {
				return [];
			},
		},
		// 上传区域的提示文字
		uploadText: {
			type: String,
			default: "选择图片",
		},
		// 是否自动上传
		autoUpload: {
			type: Boolean,
			default: true,
		},
		// 是否显示toast消息提示
		showTips: {
			type: Boolean,
			default: true,
		},
		// 是否通过slot自定义传入选择图标的按钮
		customBtn: {
			type: Boolean,
			default: false,
		},
		// 内部预览图片区域和选择图片按钮的区域宽度
		width: {
			type: [String, Number],
			default: 72,
		},
		// 内部预览图片区域和选择图片按钮的区域高度
		height: {
			type: [String, Number],
			default: 72,
		},
		// 右上角关闭按钮的背景颜色
		delBgColor: {
			type: String,
			default: "#fa3534",
		},
		// 右上角关闭按钮的叉号图标的颜色
		delColor: {
			type: String,
			default: "#ffffff",
		},
		// 右上角删除图标名称，只能为uView内置图标
		delIcon: {
			type: String,
			default: "close",
		},
		// 如果上传后的返回值为json字符串，是否自动转json
		toJson: {
			type: Boolean,
			default: true,
		},
		// 上传前的钩子，每个文件上传前都会执行
		beforeUpload: {
			type: Function,
			default: null,
		},
		// 移除文件前的钩子
		beforeRemove: {
			type: Function,
			default: null,
		},
		// 允许上传的图片后缀
		limitType: {
			type: Array,
			default () {
				// 支付宝小程序真机选择图片的后缀为"image"
				// https://opendocs.alipay.com/mini/api/media-image
				return ["png", "jpg", "jpeg", "webp", "gif", "image"];
			},
		},
		// 在各个回调事件中的最后一个参数返回，用于区别是哪一个组件的事件
		index: {
			type: [Number, String],
			default: "",
		},
	}
}
