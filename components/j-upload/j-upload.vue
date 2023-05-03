<template>
  <Upload
    :accept="getProps.accept"
    :showUploadList="getProps.showUploadList"
    :action="getProps.action"
    :maxCount="getProps.maxCount"
    :showProgress="getProps.showProgress"
    :disabled="getProps.disabled"
    :imageMode="getProps.imageMode"
    :header="getProps.header"
    :formData="getProps.formData"
    :name="getProps.name"
    :sizeType="getProps.sizeType"
    :sourceType="getProps.sourceType"
    :previewFullImage="getProps.previewFullImage"
    :multiple="getProps.multiple"
    :deletable="getProps.deletable"
    :maxSize="getProps.maxSize"
    :fileList="customValue"
    :uploadText="getProps.uploadText"
    :autoUpload="getProps.autoUpload"
    :showTips="getProps.showTips"
    :customBtn="getProps.customBtn"
    :width="getProps.width"
    :height="getProps.height"
    :delBgColor="getProps.delBgColor"
    :delColor="getProps.delColor"
    :delIcon="getProps.delIcon"
    :toJson="getProps.toJson"
    :beforeUpload="getProps.beforeUpload"
    :beforeRemove="getProps.beforeRemove"
    :limitType="getProps.limitType"
    :index="getProps.index"
    @on-success="onChange"
    @on-preview="onClickPreview"
    @on-remove="onDelete"
  />
</template>

<script>
  import { isArray, isEmpty } from '../../libs/utils/is.js'
  import { deepMerge } from '../../libs/utils/deepMerge'
  import { COMP_KEY } from '../j-form/const'
  import { isFunction } from '../../libs/utils/is'
  import Upload from '../upload/upload.vue'
  export default {
    name: 'j-upload',
    mixins: [uni.$u.mpMixin, uni.$u.mixin],
    inject: {
      COMP_KEY,
    },
    components: {
      Upload,
    },
    data() {
      return {
        customValue: [],
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
            // #ifdef  H5
            accept: 'file',
            // #endif

            //#ifdef MP-WEIXIN
            // eslint-disable-next-line no-dupe-keys
            accept: 'all',
            // #endif

            showUploadList: true,
            action: '',
            maxCount: 52,
            showProgress: true,
            disabled: false,
            imageMode: 'aspectFill',
            header: {},
            formData: {},
            name: 'file',
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            previewFullImage: false,
            multiple: true,
            deletable: true,
            maxSize: Number.MAX_VALUE,
            fileList: [],
            uploadText: '选择图片',
            autoUpload: true,
            showTips: true,
            customBtn: false,
            width: 80,
            height: 80,
            delBgColor: '#fa3534',
            delColor: '#ffffff',
            delIcon: 'close',
            toJson: true,
            beforeUpload: null,
            beforeRemove: null,
            limitType: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'image'],
            index: '',
            customStyle: {},
            customClass: '',

            onInput: null,
            onChange: null,
            onDelete: null,
            onPreview: null,
          },
          comp.compAttr
        )
        return pick
      },
    },
    watch: {
      getValue: {
        handler: function (newValue) {
          this.customValue = newValue ?? []
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      onDelete(index, lists, name) {
        const result = this.getResult(lists)
        this.onChange(result)
        this.$emit('delete', result)
        if (this.getProps.onDelete && isFunction(this.getProps.onDelete)) {
          this.getProps.onDelete(result)
        }
      },
      // 图片浏览
      onClickPreview(url, lists, index) {
        let result = this.getResult(lists)

        if (result && isArray(result) && !isEmpty(result)) {
          result = result[0]
        }

        if (this.getProps.onPreview && isFunction(this.getProps.onPreview)) {
          this.getProps.onPreview(result)
        } else {
          // #ifdef H5
          window.open(result.onlinePreview)
          // #endif
        }
      },
      onChange(data, index, lists, name) {
        const result = this.getResult(lists)
        this.$emit('input', result)
        this.$emit('change', result)

        if (this.getProps.onInput && isFunction(this.getProps.onInput)) {
          this.getProps.onInput(result)
        }
        if (this.getProps.onChange && isFunction(this.getProps.onChange)) {
          this.getProps.onChange(result)
        }
      },
      getResult(lists) {
        let result = []
        if (lists && isArray(lists)) {
          lists.forEach((item) => {
            if (item && !item.error) {
              if (item.response && item.response.data) {
                if (isArray(item.response.data)) {
                  if (isEmpty(item.response.data)) {
                    result.push({ url: item.url })
                  } else {
                    result.push({ ...item.response.data[0], url: item.url })
                  }
                } else {
                  result.push({ ...item.response.data, url: item.url })
                }
              } else {
                result.push(item)
              }
            }
          })
        }
        return result
      },
    },
  }
</script>
