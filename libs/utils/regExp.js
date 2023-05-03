//用户名正则
export const userP = /^[a-zA-Z0-9_-]{4,16}$/

//密码强度正则
//最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
export const passWordP =
  /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/

//正整数正则
export const posP = /^\d+$/

//负整数正则
export const negP = /^-\d+$/

//整数正则
export const intP = /^-?\d+$/

//正数正则 可以是整数也可以是浮点数
export const posFloatP = /^\d*\.?\d+$/

//负数正则 可以是整数也可以是浮点数
export const negFloatP = /^-\d*\.?\d+$/

// 数字正则
export const numP = /^-?\d*\.?\d+$/

//Email正则
export const emailP =
  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

//手机号正则
export const phoneP = /^1[34578]\d{9}$/

//身份证号正则
export const idCardP =
  /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

// URL正则
export const urlP =
  /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

//IPv4地址正则
export const ipv4P =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

//十六进制颜色正则
export const colorP = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/

//日期正则，简单判定,未做月份及日期的判定
export const easyDateP = /^\d{4}(\-)\d{1,2}\1\d{1,2}$/

//日期正则，复杂判定
export const mazyP =
  /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/

//QQ号正则，5至11位
export const qqP = /^[1-9][0-9]{4,10}$/

//微信号正则
export const wzP = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/

//车牌号正则
export const carP =
  /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/

//包含中文正则
export const cnP = /[\u4E00-\u9FA5]/

export default {
	userP,
	passWordP,
	posP,
	negP,
	intP,
	posFloatP,
	negFloatP,
	numP,
	emailP,
	phoneP,
	idCardP,
	urlP,
	ipv4P,
	colorP,
	easyDateP,
	mazyP,
	qqP,
	wzP,
	carP,
	cnP
}