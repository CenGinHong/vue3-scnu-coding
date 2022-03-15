<template>
  <a-space class="btnSpace">
    <a-button type="primary" @click="visibleModalInsertLab = true">
      <form-outlined/>
      新建实验
    </a-button>
    <a-button @click="handleRefresh">
      <reload-outlined/>
      刷新
    </a-button>
  </a-space>
  <base-lab-list
      :data-source="dataListLab?.records"
      :loading="loadingListLab"
      :pag="pag"
  >
    <template #actions="{ item }">
      <a-button
          class="firstBtu"
          type="link"
          @click="handleRouterToLabDetail(item.labId)"
      >
        <send-outlined/>
        查看详情
      </a-button>
      <a-button
          class="btuColor"
          type="link"
          @click="handleShowUpdateLab(item.labId)"
      >
        <edit-outlined/>
        修改
      </a-button>
    </template>
  </base-lab-list>
  <a-modal
      v-model:visible="visibleModalUpdate"
      title="修改实验"
      width="800px"
      :footer="null"
      :destroy-on-close="true"
  >
    <update-lab-modal
        :lab-id="updateLabId"
        @finish="handleFinishUpdateLab"
    />
  </a-modal>
  <a-modal
      v-model:visible="visibleModalInsertLab"
      title="新建实验"
      width="800px"
      :footer="null"
      :destroy-on-close="true"
  >
    <insert-lab-modal
        :course-id="courseId"
        @finish="handleFinishInsertLab"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePagination } from 'vue-request'
import {
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  SendOutlined
} from '@ant-design/icons-vue'
import {
  apiListLabByCourseId
} from '../../../api/web/lab'

import {
  labDetailResp
} from '../../../api/web/model/lab'
import BaseLabList from '../BaseLabList.vue'
import { ROUTER_NAME } from '../../../router'
import { fileSrc2File } from '../../../util/utils'
import InsertLabModal from './InsertLabForm.vue'
import UpdateLabModal from './UpdateLabForm.vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

const router = useRouter()
// 获取实验内容
const {
  data: dataListLab,
  loading: loadingListLab,
  refresh: refreshListLab,
  total,
  current,
  pageSize
} = usePagination(apiListLabByCourseId, {
  manual: false,
  formatResult: (res) => {
    res.data.result!.records.forEach((item: labDetailResp) => {
      item.fileList = []
      if (item.attachmentSrc !== '') {
        item.fileList.push(fileSrc2File(item.attachmentSrc))
      }
    })
    return res.data.result
  },
  defaultParams: [
    {
      pageSize: 3 ,
      courseId: props.courseId
    }
  ]
})

const handleRefresh = () => {
  refreshListLab()
}

// 分页数据
const pag = computed(() => {
  return total.value > 0
    ? {
        onChange: (page: number) => {
          current.value = page
        },
        total: total.value,
        pageSize: pageSize.value
      }
    : null
})

// 跳转到实验详情
const handleRouterToLabDetail = (labId: number) => {
  router.push({
    name: ROUTER_NAME.TEACHER_LAB_DETAIL,
    params: {
      labId: labId
    }
  })
}

const visibleModalInsertLab = ref<boolean>(false)

const updateLabId = ref<number>(0)

// 弹出修改框
const handleShowUpdateLab = (labId:number) => {
  updateLabId.value = labId
  visibleModalUpdate.value = true
}

// 修改框是否可见
const visibleModalUpdate = ref<boolean>(false)

// 完成插入后刷新
const handleFinishInsertLab = () => {
  visibleModalInsertLab.value = false
  refreshListLab()
}

const handleFinishUpdateLab = () => {
  visibleModalUpdate.value = false
  refreshListLab()
}

</script>

<style lang="scss" scoped>

.btnSpace {
  display: flex;
  margin-bottom: 16px;
  padding-left: 16px;
}

.insertDiv {
  display: flex;
  padding-left: 24px;
  margin-bottom: 16px;
}

.btuColor {
  color: gray;
}

.firstBtu {
  margin-left: -15px;
}
</style>
