<template>
  <div class="outer">
    <a-space class="btnSpace">
      <a-button type="primary" @click="handleVisibleModal">
        <form-outlined />进行签到
      </a-button>
      <a-button @click="handleRefreshStuGetCheckinByCourseId">
        <reload-outlined />刷新
      </a-button>
    </a-space>
    <a-table
      :columns="columns"
      :data-source="dataCheckInList?.records"
      :loading="loadingCheckInList"
      :pagination="pag"
    >
      <template #bodyCell="{ column, record }">
        <template
          v-if="column.dataIndex === 'createdAt'"
        >{{ dayjs(record.createdAt).format('YYYY-MM-DD hh:mm') }}</template>
        <template v-if="column.dataIndex === 'isCheckin'">
          <a-tag v-if="record.checkinDetail.isCheckin" color="success">已签</a-tag>
          <a-tag v-else color="error">未签</a-tag>
        </template>
      </template>
    </a-table>
    <a-modal v-model:visible="visibleModal" :footer="null" title="进行签到" :destroy-on-close="true">
      <student-checkin-form :course-id="courseId" @finish="handleFinishCheckin" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { usePagination } from 'vue-request'
import { FormOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import {
  apiStuGetCheckinByCourseId
} from '../../../api/web/checkin'
import { useRoute } from 'vue-router'
import { ColumnType, TablePaginationConfig } from 'ant-design-vue/es/table'
import StudentCheckinForm from './StudentCheckinForm.vue'
import {message} from "ant-design-vue";

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

const columns: ColumnType[] = [
  {
    title: '签到名称',
    dataIndex: 'checkinName',
    width: '40%'
  },
  {
    title: '签到时间',
    dataIndex: 'createdAt',
    width: '40%'
  },
  {
    title: '是否按时签到',
    dataIndex: 'isCheckin',
    width: '20%'
  }
]
const route = useRoute()

// 获取本人签到参与情况
const {
  data: dataCheckInList,
  loading: loadingCheckInList,
  error:errGetCheckingByCourseId,
  current,
  pageSize,
  total,
  refresh: refreshStuGetCheckinByCourseId
} = usePagination(apiStuGetCheckinByCourseId, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  }
})

const handleRefreshStuGetCheckinByCourseId = async () => {
  await refreshStuGetCheckinByCourseId()
  if (errGetCheckingByCourseId.value) {
    return
  }
  message.success('刷新成功')
}

// 分页数据
const pag = computed<TablePaginationConfig>(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

// 控制签到框的可见性
const visibleModal = ref<boolean>(false)

const handleVisibleModal = () => {
  visibleModal.value = true
}

const handleFinishCheckin = (res:boolean) => {
  visibleModal.value = false
  if (res) {
    refreshStuGetCheckinByCourseId()
  }
}

</script>

<style lang="scss" scoped>
.outer {
  .btnSpace {
    margin-bottom: 16px;
    display: flex;
  }
}

.modalContent {
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    margin-top: 20px;
  }

  .keyInput {
    width: 150px;
  }
}
</style>
