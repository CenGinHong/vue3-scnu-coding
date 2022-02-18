<template>
  <a-space class="btnSpace">
    <a-dropdown-button>
      <a-upload
          :showUploadList="false"
          :custom-request="handleImportStudent">
        <user-add-outlined/>
        通过Excel导入学生
      </a-upload>
      <template #overlay>
        <a-menu>
          <a-menu-item key="1" @click="handleGetImportDemo">
            <download-outlined/>
            下载导入模板
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </a-space>
  <a-table
      :columns="columns"
      :data-source="dataAllStudent?.records"
      :loading="loadingAllStudent"
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
import { DownloadOutlined, UserAddOutlined, DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons-vue'
import { FilterValue } from 'ant-design-vue/es/table/interface'
import UserInfoForm from './UserInfoForm.vue'

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
    filters: dataAllStudent.value?.filter.major
  },
  {
    title: '单位',
    dataIndex: 'organization',
    width: '10%',
    filters: dataAllStudent.value?.filter.organization
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

const {
  data: dataAllStudent,
  loading: loadingAllStudent,
  refresh: refreshListAllStudent,
  run: runListAllStudent,
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
  formatResult: res => {
    return res.data
  },
  onSuccess: res => {
    // const blob = new Blob([res], { type: 'application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) // type这里表示xlsx类型
    // const downloadElement = document.createElement('a')
    // // 创建下载的链接
    // downloadElement.href = window.URL.createObjectURL(blob)
    // downloadElement.download = 'demo.xlsx' // 下载后文件名
    // document.body.appendChild(downloadElement)
    // downloadElement.click() // 点击下载
    // document.body.removeChild(downloadElement) // 下载完成移除元素
    // const fileName = 'demo.xlsx' // 导出文件名
    // if ('download' in document.createElement('a')) {
    //   // 支持a标签download的浏览器
    //   const link = document.createElement('a') // 创建a标签
    //   link.download = fileName // a标签添加属性
    //   link.style.display = 'none'
    //   link.href = URL.createObjectURL(blob)
    //   document.body.appendChild(link)
    //   link.click() // 执行下载
    //   URL.revokeObjectURL(link.href) // 释放url
    //   document.body.removeChild(link) // 释放标签
    // } else {
    //   // 其他浏览器
    //   navigator.msSaveBlob(blob, fileName)
    // }
    console.log(res)
    const blob = new Blob([res])// new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
    const fileName = '模板.xlsx'// 下载文件名称
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
  }
})

const saveFile = (data:any, name:string) => {
  try {
    const blobUrl = window.URL.createObjectURL(data)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.download = name
    a.href = blobUrl
    a.click()
  } catch (e) {
    console.log(e)
    alert('保存文件出错')
  }
}

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
  runListAllStudent({
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
    refreshListAllStudent()
  }
}

</script>

<style lang="scss" scoped>

.btnSpace {
  margin-bottom: 16px;
  display: flex;
}
</style>
