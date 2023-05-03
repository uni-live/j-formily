# j-formily json表单生成器

```
<template>
	<view class="w-100">
		<view class="content" style="width: 750rpx">
			<j-form @register="register" @submit="submit">
				<template #formFooter>
					<view
						class="mt-1 w-100 flex justify-center bg-white align-center text-primary"
						@tap="add"
					>
						添加种类
					</view>
				</template>
			</j-form>
		</view>
	</view>
</template>

<script>
import {
	objectToArray,
	uuId,
} from '@/uni_modules/j-formily/libs/utils/formAnalysis.js'
import { useForm } from '@/uni_modules/j-formily/components/j-form/mixin/useForm'
import { JFORM_KEY } from '@/uni_modules/j-formily/components/j-form/const'
export default {
	mixins: [useForm],
	provide() {
		return {
			[JFORM_KEY]: () => ({
				props: {
					labelWidth: 200,
					schemas: this.schemas,
				},
			}),
		}
	},
	data() {
		return {
			title: 'Hello',
			n: 0,
			schemas: [
				{
					field: 'JTitle',
					component: 'JTitle',
					defaultValue: '我的项目'
				},
				{
					field: 'JInput',
					component: 'JInput',
					label: '事件类别',
				},
				{
					field: 'JTextarea',
					component: 'JTextarea',
					label: 'JTextarea',
					componentProps: {
						maxlength: 300,
						count: true
					}
				},
				{
					field: 'JRadioGroup',
					component: 'JRadioGroup',
					label: 'JRadioGroup',
					componentProps: {
						options: [
							{
								value: '123',
								label: '荔枝',
							},
							{
								value: '456',
								label: '香蕉',
							},
						],
					},
				},
				{
					field: 'JPicker',
					component: 'JPicker',
					label: 'JPicker',
					componentProps: {
						api: () => {
							return new Promise((res) => {
								setTimeout(() => {
									res([
										[
											{
												label: '异步加载',
												value: '0',
											},
											{
												label: '异步加载2',
												value: '2',
											},
										],
										[
											{
												label: '异步加载1',
												value: '1',
											},
										],
										[
											{
												label: '异步加载1',
												value: '1',
											},
										],
									])
								}, 2000)
							})
						},
						apiPicker: () => {
							return new Promise((res) => {
								setTimeout(() => {
									res([
										[
											{
												label: '异步加载',
												value: '0',
											},
											{
												label: '异步加载2',
												value: '2',
											},
										],
										[
											{
												label: '异步加载',
												value: '0',
											},
											{
												label: '异步加载2',
												value: '2',
											},
										],
										[
											{
												label: '异步加载',
												value: '0',
											},
											{
												label: '异步加载2',
												value: '2',
											},
										],
										[
											{
												label: '异步加载',
												value: '0',
											},
											{
												label: '异步加载2',
												value: '2',
											},
										],
									])
								}, 2000)
							})
						},
					},
				},
				{
					field: 'JNumberBox',
					component: 'JNumberBox',
					label: 'JNumberBox',
					required: true,
				},
				{
					field: 'JCheckboxGroup',
					component: 'JCheckboxGroup',
					label: 'JCheckboxGroup',
					componentProps: {
						options: [
							{
								name: '123',
								label: '荔枝',
							},
							{
								name: '456',
								label: '香蕉',
							},
						],
					},
				},
				{
					field: 'JSwitch',
					component: 'JSwitch',
					label: 'JSwitch',
				},
				{
					field: 'JSearch',
					component: 'JSearch',
					label: 'JSearch',
					componentProps: {
						api: async () => {
							return new Promise((resolve) => {
								setTimeout(() => {
									resolve([
										{
											value: '1',
											label: '123',
										},
									])
								}, 2000)
							})
						},
					},
				},
				{
					field: 'JTreeSelect',
					component: 'JTreeSelect',
					label: 'JTreeSelect',
					required: true,
					componentProps: {
						api: () => {
							return new Promise((res) => {
								setTimeout(() => {
									res([
										{
											label: '二级-1',
											value: '2-1',
											user: false,
											children: [
												{
													label: '二级-1-1',
													value: '2-1-1',
													user: true,
													children: [],
												},
												{
													label: '二级-1-2',
													value: '2-1-2',
													user: true,
													children: [],
												},
											],
											path: [
												{
													label: '一级',
													value: '1',
													user: true,
												},
												{
													label: '一级1',
													value: '2',
													user: true,
												},
											],
										},
										{
											label: '二级-1',
											value: '2-2',
											user: false,
											children: [
												{
													label: '二级-1-1',
													value: '2-2-1',
													user: true,
													children: [],
												},
											],
											path: [
												{
													label: '一级',
													value: '1',
													user: true,
												},
												{
													label: '一级1',
													value: '2',
													user: true,
												},
											],
										},
									])
								}, 2000)
							})
						},
						props: {
							label: 'label',
							value: 'value',
							children: 'children',
							multiple: false,
							checkStrictly: true,
							nodes: true,
						},
						// options: treeNode,
					},
				},
				{
					field: 'JUpload',
					component: 'JUpload',
					label: 'JUpload',
				},
				{
					field: 'JDatatimePicker',
					component: 'JDatatimePicker',
					label: 'JDatatimePicker',
				},
			],
		}
	},
	methods: {
		submit(e) {
			const aa = objectToArray(e)
			console.log(e, aa)
		},
		add() {
			
			const uuid = uuId()
			this.appendSchemaByField(
				{
					field: uuid,
					component: 'JInput',
					label: `明细${this.n}`,
				},
				''
			)
			this.appendSchemaByField(
				{
					field: `${uuid}xm`,
					component: 'UInput',
					label: '姓名',
				},
				''
			)
			this.appendSchemaByField(
				{
					field: `${uuid}zjh`,
					component: 'UInput',
					label: '证件号',
				},
				''
			)
			this.appendSchemaByField(
				{
					field: `${uuid}xb`,
					component: 'UInput',
					label: '性别',
				},
				''
			)
			this.n++
		},

		remove(field) {
			this.removeSchemaByFiled([
				field,
				`${field}xm`,
				`${field}zjh`,
				`${field}xb`,
			])
		},
	},
}
</script>
```