<template>
  <a-row>
    <a-col span="24">
      <a-button
          :class="style.insertBtn"
          type="primary"
          @click="visibleModalInsertCourse = true"
      >
        <form-outlined/>
        新建课程
      </a-button>
    </a-col>
  </a-row>
  <a-row>
    <a-col span="24">
      <base-course-list
          :dataSource="dataSource?.records"
          :loading="loading"
          :pag="pag"
      />
    </a-col>
  </a-row>
  <insert-course-form
      v-model:visible-modal="visibleModalInsertCourse"
      @refresh-list="refreshListCourse">
  </insert-course-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, useCssModule, watchEffect } from 'vue'
import { usePagination } from 'vue-request'
import { IPagination } from '../../../api/common'
import {
  apiListCourseByTeacherId
} from '../../../api/web/course'
import { useRouter } from 'vue-router'
import BaseCourseList from '../BaseCourseList.vue'
import { FormOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { createCourseReq } from '../../../api/web/model/courseModel'
import { Form } from 'ant-design-vue'
import InsertCourseForm from './InsertCourseModal.vue'

const useForm = Form.useForm

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

const style = useCssModule()
</script>

<style lang="scss" module>
.insertBtn {
  float: left;
  margin-left: 16px;
}
</style>
