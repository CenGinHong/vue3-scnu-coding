<template>
  <div class="outer">
    <a-input-search
      v-model:value="searchValue"
      class="input"
      enter-button
      placeholder="搜索课程名或教师名"
      @search="onSearch"
    />
    <base-course-list
      :dataSource="dataSource?.records"
      :loading="loadingGetDataList"
      :pag="pag"
      class="list"
    >
      <template #actionButton="{ item }">
        <template v-if="item.isTake">
          <a-button
            class="btu"
            type="primary"
            @click="handleRouterToCourse(item.courseId)"
            >进入课程</a-button
          >
        </template>
        <template v-else>
          <a-popover trigger="click">
            <template #content>
              <a-input
                v-model:value="enterCourseKey"
                placeholder="请输入密钥"
              />
              <a-button class="btu" size="small" type="primary">加入</a-button>
            </template>
            <a-button class="btu">加入课程</a-button>
          </a-popover>
        </template>
      </template>
    </base-course-list>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { usePagination } from 'vue-request'
import { useRouter } from 'vue-router'
import { apiSearchCourse } from '../../api/web/course'
import BaseCourseList from './BaseCourseList.vue'
import { IPagination } from '../../api/common'
import { ROUTER_NAME } from '../../router'

const router = useRouter()
const {
  run: runSearchCourse,
  data: dataSource,
  loading: loadingGetDataList,
  total,
  current,
  pageSize
} = usePagination(apiSearchCourse, {
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

const onSearch = (searchValue: string) => {
  runSearchCourse({ courseNameOrTeacherName: searchValue })
}

const searchValue = ref<string>('')

const enterCourseKey = ref<string>('')

const handleRouterToCourse = (courseId: number) => {
  router.push({
    name: ROUTER_NAME.STUDENT_COURSE_DETAIL,
    params: courseId
  })
}
</script>

<style lang="scss" scoped>
.outer {
  display: flex;
  flex-direction: column;
  text-align: left;

  .input {
    width: 300px;
    padding-left: 24px;
  }

  .list {
    margin-top: 20px;
    padding-left: 0;

    .ant-list-item-meta {
      margin-bottom: 0;

      .ant-list-item-meta-title {
        > a {
          font-size: 20px;
        }
      }

      .ant-list-item-meta-description {
        margin-bottom: 0;
      }
    }

    .btu {
      margin-top: 20px;
    }
  }
}

.btu {
  margin-top: 20px;
}
</style>
