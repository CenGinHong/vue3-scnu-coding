<template>
  <a-list
    :class="style.list"
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
              :class="style.courseTitle"
              @click="routerToDetail(item.courseId)"
              >{{ item.courseName }}</a
            >
            <template v-if="item.isClose">
              <a-tag :class="style.tag" color="success">进行中</a-tag>
            </template>
            <template v-else>
              <a-tag :class="style.tag" color="default">已结课</a-tag>
            </template>
          </template>
          <template #description>
            <template v-if="item.teacherDetail">
              开课教师：{{ item.teacherDetail.username }}
            </template>
          </template>
        </a-list-item-meta>
        {{ item.courseDes }}
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
import { ComputedRef, useCssModule } from 'vue'
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

const style = useCssModule()
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

<style lang="scss" module>
.list {
  text-align: left;

  .courseTitle {
    font-size: 18px;
  }

  .tag {
    margin-left: 10px;
  }
}
</style>
