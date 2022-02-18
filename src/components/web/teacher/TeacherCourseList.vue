<template>
  <a-space class="btnSpace">
    <a-button
        type="primary"
        @click="handleShowModalInsertCourse"
    >
      <form-outlined/>
      新建课程
    </a-button>
  </a-space>
  <base-course-list
      :dataSource="dataSource?.records"
      :loading="loading"
      :pag="pag"
  >
    <template #tag="{item}">
      <template v-if="item.isClose">
        <a-tag class="tag" color="success">进行中</a-tag>
      </template>
      <template v-else>
        <a-tag class="tag" color="default">已结课</a-tag>
      </template>
    </template>
  </base-course-list>
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
import {
  apiListCourseByTeacherId
} from '../../../api/web/course'
import { useRouter } from 'vue-router'
import BaseCourseList from '../BaseCourseList.vue'
import { FormOutlined } from '@ant-design/icons-vue'
import InsertCourseForm from './InsertCourseForm.vue'
import { TablePaginationConfig } from 'ant-design-vue/es/table/Table'

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
const pag = computed<TablePaginationConfig>(() => ({
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

const handleFinishInsertCourse = () => {
  visibleModalInsertCourse.value = false
}

</script>

<style lang="scss" scoped>
.btnSpace {
  display: flex;
  margin: 0 0 16px 16px;
}

.tag {
  margin-left: 10px;
}
</style>
