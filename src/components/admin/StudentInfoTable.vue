<template>
  <a-space  class="btnSpace">
    <a-dropdown-button>
      <user-add-outlined/>
      通过CSV导入学生
      <template #overlay>
        <a-menu>
          <a-menu-item key="1">
            <download-outlined />
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
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { ColumnType, TablePaginationConfig, TableProps } from 'ant-design-vue/es/table'
import { computed } from 'vue'
import dayjs from 'dayjs'
import { usePagination } from 'vue-request'
import { apiListAllStudent } from '../../api/admin/user'
import { RoleEnum } from '../../enums/roleEnum'
import { UserAddOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { FilterValue } from 'ant-design-vue/es/table/interface'
const columns = computed<ColumnType[]>(() => [
  {
    title: '姓名',
    dataIndex: 'username',
    width: '5%'
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
  }
])

const { data: dataAllStudent, loading: loadingAllStudent, run: runListAllStudent, pageSize, current, total } =
    usePagination(apiListAllStudent, {
      manual: false,
      formatResult: res => {
        return res.data.result
      },
      defaultParams: [
        {
          role: RoleEnum.STUDENT
        }
      ]
    })

const pag = computed<TablePaginationConfig>(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

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

</script>

<style lang="scss" scoped>

.btnSpace {
  margin-bottom: 16px;
  display: flex;
}
</style>
