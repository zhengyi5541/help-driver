<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">姓名</label>
        <el-input v-model="query.name" clearable placeholder="姓名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <!--<label class="el-form-item-label">驾驶证类型</label>
        <el-input v-model="query.drivingType" clearable placeholder="驾驶证类型" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
        <el-select
          v-model="query.drivingType"
          clearable
          size="small"
          placeholder="驾驶证类型"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in driverTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <!--<label class="el-form-item-label">审核状态</label>
        <el-input v-model="query.audit" clearable placeholder="审核状态" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
        <el-select
          v-model="query.audit"
          clearable
          size="small"
          placeholder="状态"
          class="filter-item"
          style="width: 90px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in enabledTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperations :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="drivingType" label="驾驶证类型">
          <template slot-scope="scope">
            {{ dict.label.driving[scope.row.drivingType] }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="正面" />
        <el-table-column prop="phone" label="反面" />
        <el-table-column prop="audit" label="审核状态">
          <template slot-scope="scope">
            {{ dict.label.audit[scope.row.audit] }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','zyDriveUser:edit','zyDriveUser:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperations
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudZyDriveUser from '@/api/zyDriveUser'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperations from '@crud/CRUD.operations'
import udOperations from '@crud/UD.operations'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, img: null, age: null, drivingYears: null, phone: null, drivingType: null, workingState: null, status: null, del: null, audit: null, driverPositive: null, driverReverse: null, createTime: null }
export default {
  name: 'ZyDriveUser',
  components: { pagination, crudOperations, rrOperation, udOperations },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['driving', 'audit'],
  cruds() {
    return CRUD({ title: '车主用户', url: 'api/zyDriveUser', sort: 'id,desc', crudMethod: { ...crudZyDriveUser }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'zyDriveUser:add'],
        edit: ['admin', 'zyDriveUser:edit'],
        del: ['admin', 'zyDriveUser:del']
      },
      rules: {
        id: [
          { required: true, message: 'id不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '姓名' },
        { key: 'drivingType', display_name: '驾驶证类型' },
        { key: 'audit', display_name: '审核状态' }
      ],
      enabledTypeOptions: [
        { key: 1, display_name: '未审核' },
        { key: 2, display_name: '通过' },
        { key: 3, display_name: '驳回' }
      ],
      driverTypeOptions: [
        { key: 1, display_name: 'A1' },
        { key: 2, display_name: 'A2' },
        { key: 3, display_name: 'A3' },
        { key: 4, display_name: 'B1' },
        { key: 5, display_name: 'B2' },
        { key: 6, display_name: 'C1' },
        { key: 7, display_name: 'C2' },
        { key: 8, display_name: 'C3' },
        { key: 9, display_name: 'C4' },
        { key: 10, display_name: 'D' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
