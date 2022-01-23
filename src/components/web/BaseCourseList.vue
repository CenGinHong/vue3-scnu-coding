<template>
  <a-list
      class="list"
      :data-source="props.dataSource"
      :loading="props.loading"
      :pagination="props.pag"
      item-layout="vertical"
      size="large"
  >
    <template #renderItem="{ item }">
      <a-list-item :key="item.courseId">
        <template #extra>
          <a-image
              :width="240"
              :height="135"
              :src="item.coverImg"
              fallback="https://via.placeholder.com/240x135?text=%E5%8A%A0%E8%BD%BD%E5%A4%B1%E8%B4%A5"
          />
        </template>
        <a-list-item-meta>
          <template #title>
            <a
                class="courseTitle"
                @click="routerToDetail(item.courseId)"
            >{{ item.courseName }}</a
            >
            <slot :item="item" name="tag"/>
          </template>
          <template #description>
            <template v-if="item.teacherDetail">
              开课教师：{{ item.teacherDetail.username }}
            </template>
          </template>
        </a-list-item-meta>
        <p>
          {{ item.courseDes }}
        </p>
        <slot :item="item" name="actionButton"/>
      </a-list-item>
    </template>

  </a-list>
</template>
<script lang="ts" setup>
import { ComputedRef } from 'vue'
import { IPagination } from '../../api/common'
import { useRouter } from 'vue-router'
import { useStore } from '../../store'
import { RoleEnum } from '../../enums/roleEnum'
import { ROUTER_NAME } from '../../router'
import { listCourseResp } from '../../api/web/model/courseModel'

// eslint-disable-next-line no-undef
const props = withDefaults(
  // eslint-disable-next-line no-undef
  defineProps<{
      dataSource?: listCourseResp[]
      pag: ComputedRef<IPagination>
      loading: boolean
    }>(),
  {
    dataSource: () => []
  }
)
const store = useStore()
const router = useRouter()
const userInfo = store.getters['user/userInfo']
const routerToDetail = (courseId: number) => {
  switch (userInfo.roleId) {
    case RoleEnum.TEACHER: {
      router.push({
        name: ROUTER_NAME.TEACHER_COURSE_DETAIL,
        params: {
          courseId
        }
      })
      break
    }
    case RoleEnum.STUDENT: {
      router.push({
        name: ROUTER_NAME.STUDENT_COURSE_DETAIL,
        params: {
          courseId
        }
      })
      break
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  text-align: left;

  .courseTitle {
    font-size: 18px;
  }

}
</style>
