<template>
  <a-space class="btnSpace">
    <a-button @click="handleGetImportDemo">
      <download-outlined/>
      下载导入模板
    </a-button>
    <a-dropdown>
      <a-button>
        <user-add-outlined/>
        通过Excel导入用户
        <down-outlined/>
      </a-button>
      <template #overlay>
        <a-menu>
          <a-menu-item key="1">
            <a-upload
                :showUploadList="false"
                accept=".xlsx"
                :custom-request="handleImportStudent">
              导入学生
            </a-upload>
          </a-menu-item>
          <a-menu-item key="2">
            <a-upload
                :showUploadList="false"
                accept=".xlsx"
                :custom-request="handleImportTeacher">
              导入教师
            </a-upload>
          </a-menu-item>
          <a-menu-item key="3">
            <a-upload
                :showUploadList="false"
                accept=".xlsx"
                :custom-request="handleImportAdmin">
              导入管理员
            </a-upload>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-button @click="handleRefresh">
      <reload-outlined/>
      刷新
    </a-button>
    <!--    <a-button danger>-->
    <!--      <user-delete-outlined/>-->
    <!--      删除用户-->
    <!--    </a-button>-->
  </a-space>
  <a-table
      :columns="columns"
      :data-source="dataAllUser?.records"
      :loading="loadingAllUser"
      :pagination="pag"
      @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'gender'">
        <a-tag v-if="record.gender === 0" color="default">未知</a-tag>
        <a-tag v-else-if="record.gender === 1" color="blue">男</a-tag>
        <a-tag v-else-if="record.gender === 2" color="pink">女</a-tag>
      </template>
      <template
          v-if="column.dataIndex === 'createdAt'"
      >{{ dayjs(record.createdAt).format('YYYY-MM-DD hh:mm') }}
      </template>
      <template v-if="column.dataIndex === 'roleId'">
        <a-tag v-if="record.roleId === 1" color="success">
          教师
        </a-tag>
        <a-tag v-else-if="record.roleId === 2" color="processing">
          学生
        </a-tag>
        <a-tag v-else-if="record.roleId === 3" color="warning">
          管理员
        </a-tag>
      </template>
      <template v-if="column.key==='operation'">
        <a-space>
          <a-tooltip title="修改" @click="handleShowUserForm(record.userId)">
            <a>
              <edit-outlined/>
            </a>
          </a-tooltip>
          <!--          <a-tooltip title="删除" @click="handleShowUserForm(record.userId)">-->
          <!--            <a class="delBtn">-->
          <!--              <delete-outlined/>-->
          <!--            </a>-->
          <!--          </a-tooltip>-->
        </a-space>
      </template>
    </template>
  </a-table>
  <a-modal title="用户信息" v-model:visible="visibleModalUserInfo"
           :destroy-on-close="true"
           :footer="null">
    <user-info-form @finish="handleFinishUserForm" :user-id="selectedUserId"/>
  </a-modal>
</template>

<script lang="ts" setup>
import { ColumnType, TablePaginationConfig, TableProps } from 'ant-design-vue/es/table'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { usePagination, useRequest } from 'vue-request'
import { apiGetImportDemo, apiImportStudent, apiListUser } from '../../api/admin/user'
import { RoleEnum } from '../../enums/roleEnum'
import {
  DownloadOutlined,
  UserAddOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserDeleteOutlined,
  ReloadOutlined,
  EditOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import { FilterValue, Key } from 'ant-design-vue/es/table/interface'
import UserInfoForm from './UserInfoForm.vue'
import { dataToFile } from '../../util/utils'
import { message } from 'ant-design-vue'

const columns = computed<ColumnType[]>(() => [
  {
    title: '姓名',
    dataIndex: 'username',
    width: '8%'
  },
  {
    title: '身份',
    dataIndex: 'roleId',
    width: '3%',
    filters: [{
      text: '教师',
      value: '1'
    }, {
      text: '学生',
      value: '2'
    }, {
      text: '管理员',
      value: '3'
    }]
  },
  {
    title: '学工号',
    dataIndex: 'userNum',
    width: '10%',
    sorter: true
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: '8%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '3%',
    customFilterDropdown: false
  },
  {
    title: '专业',
    dataIndex: 'major',
    width: '10%',
    filters: dataAllUser.value?.filter.major
  },
  {
    title: '单位',
    dataIndex: 'organization',
    width: '10%',
    filters: dataAllUser.value?.filter.organization
  },
  {
    title: '注册时间',
    dataIndex: 'createdAt',
    width: '10%'
  },
  {
    title: '操作',
    key: 'operation',
    width: '5%'
  }
])

const selectedRowKeys = ref<Key[]>([])

const onSelectChange = (keys: Key[]) => {
  selectedRowKeys.value = keys
}

const {
  data: dataAllUser,
  loading: loadingAllUser,
  refresh: refreshListAllUser,
  run: runListAllUser,
  error: errListAllUser,
  pageSize,
  current,
  total
} =
    usePagination(apiListUser, {
      manual: false,
      formatResult: res => {
        return res.data.result
      }
    })

const pag = computed<TablePaginationConfig>(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

const { run: runGetImportDemo } = useRequest(apiGetImportDemo, {
  onSuccess: res => {
    dataToFile(res)
  }
})

const handleGetImportDemo = () => {
  runGetImportDemo()
}

const { run: runImportStudent } = useRequest(apiImportStudent)

const handleImportStudent = (data: any) => {
  const form = new FormData()
  form.set('file', data.file)
  form.set('roleId', String(RoleEnum.STUDENT))
  runImportStudent(form)
}

const handleImportTeacher = (data: any) => {
  const form = new FormData()
  form.set('file', data.file)
  form.set('roleId', String(RoleEnum.TEACHER))
  runImportStudent(form)
}

const handleImportAdmin = (data: any) => {
  const form = new FormData()
  form.set('file', data.file)
  form.set('roleId', String(RoleEnum.ADMIN))
  runImportStudent(form)
}

const handleTableChange: TableProps['onChange'] = (
  pag: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: any
) => {
  for (const key in filters) {
    if (filters[key] === null) {
      delete filters[key]
    }
  }
  runListAllUser({
    role: RoleEnum.STUDENT,
    current: pag.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    filterFields: filters
  })
}
const selectedUserId = ref<number>(0)
const visibleModalUserInfo = ref<boolean>()

const handleShowUserForm = (userId: number) => {
  selectedUserId.value = userId
  visibleModalUserInfo.value = true
}

const handleFinishUserForm = (refresh: boolean) => {
  visibleModalUserInfo.value = false
  if (refresh) {
    refreshListAllUser()
  }
}

const handleRefresh = async() => {
  await refreshListAllUser()
  if (errListAllUser.value) {
    return
  }
  message.success('刷新成功')
}

</script>

<style lang="scss" scoped>

.btnSpace {
  margin-bottom: 16px;
  display: flex;
}

.delBtn {
  color: #ff4d4f;
}
</style>
