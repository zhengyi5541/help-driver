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
        <label class="el-form-item-label">运输类型</label>
        <el-select
          v-model="query.type"
          clearable
          size="small"
          placeholder="运输类型"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in transportOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <label class="el-form-item-label">订单状态</label>
        <el-select
          v-model="query.hire"
          clearable
          size="small"
          placeholder="订单状态"
          class="filter-item"
          style="width: 120px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in hireOptions"
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
        <el-table-column prop="drivingType" label="驾照类型">
          <template slot-scope="scope">
            {{ dict.label.driving[scope.row.drivingType] }}
          </template>
        </el-table-column>
        <el-table-column prop="drivingType" label="运输类型">
          <template slot-scope="scope">
            {{ dict.label.transport[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="hire" label="订单状态">
          <template slot-scope="scope">
            {{ dict.label.orderType[scope.row.hire] }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="备注" />
        <el-table-column label="详情" width="70px" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.hire === 1" type="info" round @click="openDrawer(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
      <el-drawer title="订单详情" :visible.sync="drawer" :with-header="true">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>司机信息</span>
          </div>
          <div>
            <ul class="user-info">
              <li><div style="height: 100%"> 司机姓名<div class="user-right"> {{ user.name }} </div></div></li>
              <li> 运输类型 <div class="user-right"> {{ dict.label.transport[user.type] }} </div></li>
              <li> 手机号码 <div class="user-right"> {{ user.phone }} </div></li>
              <li> 加载类型 <div class="user-right"> {{ dict.label.driving[user.drivingType] }} </div></li>
              <li> 订单备注 <div class="user-right"> {{ user.content }} </div></li>
            </ul>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>雇主信息</span>
          </div>
          <div>
            <ul class="user-info">
              <li><div style="height: 100%"> 雇主姓名<div class="user-right"> {{ user.ownerName }} </div></div></li>
              <li> 手机号码 <div class="user-right"> {{ user.ownerPhone }} </div></li>
            </ul>
          </div>
        </el-card>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import crudZyDriverOrder from '@/api/zyDriverOrder'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperations from '@crud/CRUD.operations'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import request from '@/utils/request'

const defaultForm = { id: null, name: null, age: null, drivingYear: null, phone: null, type: null, drivingType: null, work: null, content: null, hire: null, del: null, createBy: null, createTime: null }
export default {
  name: 'ZyDriverOrder',
  components: { pagination, crudOperations, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['transport', 'driving', 'work', 'orderType'],
  cruds() {
    return CRUD({ title: '司机订单', url: 'api/zyDriverOrder', sort: 'id,desc', crudMethod: { ...crudZyDriverOrder }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'zyDriverOrder:add'],
        edit: ['admin', 'zyDriverOrder:edit'],
        del: ['admin', 'zyDriverOrder:del']
      },
      rules: {
        id: [
          { required: true, message: 'id不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '姓名' },
        { key: 'phone', display_name: '电话' },
        { key: 'type', display_name: '可接受运输类型' },
        { key: 'hire', display_name: '订单状态' }
      ],
      transportOptions: [
        { key: 1, display_name: '长途' },
        { key: 2, display_name: '短途' }
      ],
      hireOptions: [
        { key: 1, display_name: '完成' },
        { key: 2, display_name: '未完成' }
      ],
      drawer: false,
      user: ''
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    openDrawer(id) {
      this.drawer = true
      request({
        url: 'api/zyDriverDetails/getDriverDetails?id=' + id,
        method: 'get'
      }).then(res => {
        this.user = res
      })
    }
  }
}
</script>

<style scoped>

</style>
<style rel="stylesheet/scss" lang="scss">
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .user-info {
    padding-left: 0;
    list-style: none;
    li{
      border-bottom: 1px solid #F0F3F4;
      padding: 11px 0;
      font-size: 13px;
    }
    .user-right {
      float: right;
      a{
        color: #317EF3;
      }
    }
  }
</style>
