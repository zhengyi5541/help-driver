<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">姓名</label>
        <el-input v-model="query.name" clearable placeholder="姓名" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">电话</label>
        <el-input v-model="query.phone" clearable placeholder="电话" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">审核状态</label>
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
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="audit" label="审核状态">
          <template slot-scope="scope">
            {{ dict.label.audit[scope.row.audit] }}
          </template>
        </el-table-column>
        <el-table-column prop="licenseImg" label="营业执照" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','zyEmployerUser:edit','zyEmployerUser:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperatione
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
import crudZyEmployerUser from '@/api/zyEmployerUser'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperations from '@crud/CRUD.operations'
import udOperatione from '@crud/UD.operatione'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, phone: null, audit: null, status: null, del: null, licenseImg: null, createTime: null }
export default {
  name: 'ZyEmployerUser',
  components: { pagination, crudOperations, rrOperation, udOperatione },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['audit'],
  cruds() {
    return CRUD({ title: '雇主列表', url: 'api/zyEmployerUser', sort: 'id,desc', crudMethod: { ...crudZyEmployerUser }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'zyEmployerUser:add'],
        edit: ['admin', 'zyEmployerUser:edit'],
        del: ['admin', 'zyEmployerUser:del']
      },
      rules: {
        id: [
          { required: true, message: 'id不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '姓名' },
        { key: 'phone', display_name: '电话' },
        { key: 'audit', display_name: '审核状态' }
      ],
      enabledTypeOptions: [
        { key: 1, display_name: '未审核' },
        { key: 2, display_name: '通过' },
        { key: 3, display_name: '驳回' }
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
