<template>
  <div>
    <el-popover v-model="through" v-permission="permission.del" placement="top" width="180" trigger="manual" @show="throughPopoverShow" @hide="throughPopoverHide">
      <p>{{ msg }}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="doThrough">取消</el-button>
        <el-button :loading="crud.dataStatus[crud.getDataId(data)].delete === 2" type="primary" size="mini" @click="updateThrough(data.id)">确定</el-button>
      </div>
      <el-button slot="reference" :disabled="disabledDle" type="success" icon="el-icon-check" size="mini" @click="toThrough" />
    </el-popover>
    <el-popover v-model="rejected" v-permission="permission.del" placement="top" width="180" trigger="manual" @show="rejectedPopoverShow" @hide="rejectedPopoverHide">
      <p>{{ msgTow }}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="doRejected">取消</el-button>
        <el-button :loading="crud.dataStatus[crud.getDataId(data)].delete === 2" type="primary" size="mini" @click="updateRejected(data.id)">确定</el-button>
      </div>
      <el-button slot="reference" :disabled="disabledDle" type="warning" icon="el-icon-delete" size="mini" @click="toRejected" />
    </el-popover>
  </div>
</template>
<script>
import CRUD, { crud } from '@crud/crud'
import request from '@/utils/request'
export default {
  mixins: [crud()],
  props: {
    data: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    },
    disabledEdit: {
      type: Boolean,
      default: false
    },
    disabledDle: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: '确定通过本条数据吗？'
    },
    msgTow: {
      type: String,
      default: '确定驳回本条数据吗？'
    }
  },
  data() {
    return {
      through: false,
      rejected: false
    }
  },
  methods: {
    doThrough() {
      this.through = false
      this.crud.cancelDelete(this.data)
    },
    doRejected() {
      this.rejected = false
      this.crud.cancelDelete(this.data)
    },
    toThrough() {
      this.through = true
    },
    toRejected() {
      this.rejected = true
    },
    throughPopoverShow() {
      setTimeout(() => {
        document.addEventListener('click', this.handleDocumentClick)
      }, 0)
    },
    throughPopoverHide() {
      document.removeEventListener('click', this.handleDocumentClick)
    },
    rejectedPopoverShow() {
      setTimeout(() => {
        document.addEventListener('click', this.handleDocumentClick)
      }, 0)
    },
    rejectedPopoverHide() {
      document.removeEventListener('click', this.handleDocumentClick)
    },
    handleDocumentClick(event) {
      this.through = false
      this.rejected = false
    },
    updateThrough(id) {
      request({
        url: '/api/zyDriveUser/updateAudit',
        method: 'post',
        data: {
          audit: 2,
          id
        }
      }).then(res => {
        this.through = false
        location.reload()
      })
    },
    updateRejected(id) {
      request({
        url: '/api/zyDriveUser/updateAudit',
        method: 'post',
        data: {
          audit: 3,
          id
        }
      }).then(res => {
        this.rejected = false
        location.reload()
      })
    }
  }
}
</script>
