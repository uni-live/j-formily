import { isNumber } from '../../libs/utils/is.js'

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component) {
  if (
    component.includes('JInput') ||
    component.includes('JKeyboard') ||
    component.includes('JNumberBox') ||
    component.includes('JTextarea')
  ) {
    return '请输入'
  }
  if (
    component.includes('JSelect') ||
    component.includes('JPicker') ||
    component.includes('JCheckbox') ||
    component.includes('JRadio') ||
    component.includes('JSwitch') ||
    component.includes('JUpload') ||
    component.includes('JSearch') ||
    component.includes('JTreeSelect') ||
    component.includes('JDatatimePicker') ||
    component.includes('JRangHm')
  ) {
    return '请选择'
  }
  return ''
}

const DATE_TYPE = ['JCalendar']

function genType() {
  return [...DATE_TYPE]
}

/**
 * @description: 生成验证类型
 */
export function setComponentRuleType(rule, component) {
  if (
    [
      'JPicker',
      'JTextarea',
      'JKeyboard',
      'JInput',
      'JRadioGroup',
      'JDatatimePicker',
      'JSearch',
    ].includes(component)
  ) {
    rule.type = 'string'
  } else if (['JUpload', 'JCheckbox', 'JRangHm'].includes(component)) {
    rule.type = 'array'
  } else if (['JNumberBox'].includes(component)) {
    rule.type = 'number'
  }
}

/**
 * @description: 转换值得类型
 */
export function handleInputNumberValue(component, val) {
  if (!component) return val
  if (['JNumberBox'].includes(component)) {
    return val && isNumber(val) ? val : Number(val)
  }
  return val
}

/**
 * 时间字段
 */
export const dateItemType = genType()
