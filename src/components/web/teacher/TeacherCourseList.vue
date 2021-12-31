<template>
  <a-space class="btnSpace">
    <a-button
        class="insertBtn"
        type="primary"
        @click="handleShowModalInsertCourse"
    >   <form-outlined/>
    新建课程
    </a-button>
  </a-space>

  <base-course-list
      :dataSource="dataSource?.records"
      :loading="loading"
      :pag="pag"
  />
  <a-modal
      v-model:visible="visibleModalInsertCourse"
      title="新建课程"
      width="800px"
      :footer="null"
  >
    <insert-course-form
        @finish="handleFinishInsertCourse">
    </insert-course-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { usePagination } from 'vue-request'
import { IPagination } from '../../../api/common'
import {
  apiListCourseByTeacherId
} from '../../../api/web/course'
import { useRouter } from 'vue-router'
import BaseCourseList from '../BaseCourseList.vue'
import { FormOutlined, PlusOutlined } from '@ant-design/icons-vue'
import InsertCourseForm from './InsertCourseForm.vue'

// 路由
const router = useRouter()
// 课程列表
const {
  data: dataSource,
  loading,
  total,
  current,
  pageSize,
  refresh: refreshListCourse
} = usePagination(apiListCourseByTeacherId, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  }
})

// 分页数据
const pag = computed<IPagination>(() => ({
  onChange(page: number) {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

// 插入课程的可见框
const visibleModalInsertCourse = ref<boolean>(false)

const handleShowModalInsertCourse = () => {
  visibleModalInsertCourse.value = true
}

const handleFinishInsertCourse = (res: boolean) => {
  if (res) {
    refreshListCourse()
  }
  visibleModalInsertCourse.value = false
}

</script>

<style lang="scss" scoped>
.btnSpace {
  display: flex;
  margin-bottom: 26px;
}
</style>
