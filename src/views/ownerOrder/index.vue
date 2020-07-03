<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">名称</label>
        <el-input v-model="query.name" clearable placeholder="名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">电话</label>
        <el-input v-model="query.phone" clearable placeholder="电话" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">驾驶证类型</label>
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
        <label class="el-form-item-label">运输类型</label>
        <el-select
          v-model="query.type"
          clearable
          size="small"
          placeholder="状态"
          class="filter-item"
          style="width: 90px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <label class="el-form-item-label">完结状态</label>
        <el-select
          v-model="query.status"
          clearable
          size="small"
          placeholder="状态"
          class="filter-item"
          style="width: 90px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in statusOptions"
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
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="drivingType" label="需要驾驶证类型">
          <template slot-scope="scope">
            {{ dict.label.driving[scope.row.drivingType] }}
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金额" />
        <el-table-column prop="type" label="运输类型">
          <template slot-scope="scope">
            {{ dict.label.transport[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="所需人数" />
        <el-table-column prop="content" label="备注" />
        <el-table-column prop="status" label="完结状态">
          <template slot-scope="scope">
            {{ dict.label.orderType[scope.row.status] }}
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudZyOwnerOrder from '@/api/zyOwnerOrder'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperations from '@crud/CRUD.operations'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, phone: null, drivingType: null, money: null, type: null, num: null, content: null, del: null, status: null, createBy: null, createTime: null }
export default {
  name: 'ZyOwnerOrder',
  components: { pagination, crudOperations, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['driving', 'transport', 'orderType'],
  cruds() {
    return CRUD({ title: '车主订单', url: 'api/zyOwnerOrder', sort: 'id,desc', crudMethod: { ...crudZyOwnerOrder }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'zyOwnerOrder:add'],
        edit: ['admin', 'zyOwnerOrder:edit'],
        del: ['admin', 'zyOwnerOrder:del']
      },
      rules: {
        id: [
          { required: true, message: 'id不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '名称' },
        { key: 'phone', display_name: '电话' },
        { key: 'drivingType', display_name: '驾驶证类型' },
        { key: 'type', display_name: '运输类型' },
        { key: 'status', display_name: '完结状态' }
      ],
      typeOptions: [
        { key: 1, display_name: '长途' },
        { key: 2, display_name: '短途' }
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
      ],
      statusOptions: [
        { key: 1, display_name: '完成' },
        { key: 2, display_name: '未匹配' }
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
