<template>
  <div class="outer">
    <a-input-search
        v-model:value="searchValue"
        class="input"
        enter-button
        placeholder="搜索课程名"
        @search="onSearch"
    />
    <base-course-list
        :dataSource="dataSource?.records"
        :loading="loadingSearchCourse"
        :pag="pag"
        class="list"
    >
      <template #tag="{item}">
        <template v-if="item.isTakeDetail.isTake">
          <a-tag class="tag" color="success">已加入</a-tag>
        </template>
        <template v-else>
          <a-tag class="tag" color="default">未加入</a-tag>
        </template>
      </template>
      <template #actionButton="{ item }">
        <template v-if="!item.isTakeDetail.isTake">
          <a-popover trigger="click">
            <template #content>
              <a-input
                  v-model:value="joinCourseKey"
                  placeholder="请输入密钥"
              />
              <a-button class="btu" size="small" type="primary" @click="joinCourse(item.courseId)">加入</a-button>
            </template>
            <a-button  size="small" type="link" class="btu">加入课程</a-button>
          </a-popover>
        </template>
      </template>
    </base-course-list>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { usePagination, useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import { apiJoinClass, apiSearchCourse } from '../../api/web/course'
import BaseCourseList from './BaseCourseList.vue'
import { ROUTER_NAME } from '../../router'
import { TablePaginationConfig } from 'ant-design-vue/es/table/Table'

const router = useRouter()
const {
  run: runSearchCourse,
  data: dataSource,
  loading: loadingSearchCourse,
  refresh: refreshSearchCourse,
  total,
  current,
  pageSize
} = usePagination(apiSearchCourse, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  }
})

const { run: runJoinClass, loading: loadingJoinClass,  error: errJoinClass } = useRequest(apiJoinClass)

// 分页数据
const pag = computed<TablePaginationConfig>(() => ({
  onChange(page: number) {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

const onSearch = (searchValue: string) => {
  runSearchCourse({ courseName: searchValue })
}

const searchValue = ref<string>('')

const joinCourseKey = ref<string>('')

const joinCourse = async(courseId: number) => {
  await runJoinClass({
    courseId: courseId,
    secretKey: joinCourseKey.value
  })
  if (errJoinClass.value) {
    return
  }
  await refreshSearchCourse()
}

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

.tag {
  margin-left: 10px;
}

</style>
