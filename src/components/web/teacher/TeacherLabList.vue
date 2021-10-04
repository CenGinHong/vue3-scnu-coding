<template>
  <div :class="style.insertDiv">
    <a-button type="primary" @click="visibleModalInsertLab = true">
      <form-outlined />
      新建实验
    </a-button>
  </div>
  <base-lab-list
    :data-source="dataListLab?.records"
    :loading="loadingListLab"
    :pag="pag"
  >
    <template #attachment="{ item }">
      <a-upload :file-list="item.fileList" :remove="removeFile" />
    </template>
    <template #actions="{ item }">
      <a-button
        :class="style.firstBtu"
        type="link"
        @click="handleRouterToLabDetail(item.labId)"
      >
        <send-outlined />
        查看详情
      </a-button>
      <a-button
        :class="style.updateBtu"
        type="link"
        @click="handleShowUpdateLab(item)"
      >
        <edit-outlined />
        修改
      </a-button>
      <a-button danger type="link" @click="handleDeleteLab(item.labId)">
        <delete-outlined />
        删除
      </a-button>
    </template>
  </base-lab-list>
  <update-lab-modal
    v-model:visible="visibleUpdateModal"
    :update-lab-init-state="updateLabInitState"
    @refreshList="refreshListLab"
  >
  </update-lab-modal>
  <insert-lab-modal
    v-model:visible="visibleModalInsertLab"
    :course-id="courseId"
    @refresh-list="refreshListLab"
  >
  </insert-lab-modal>
</template>

<script lang="ts" setup>
import { computed, createVNode, reactive, ref, useCssModule } from 'vue'
import { useRouter } from 'vue-router'
import { usePagination, useRequest } from 'vue-request'
import {
  apiDeleteLab,
  apiListLabByCourseId
} from '../../../api/web/lab'

import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  SendOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import {
  labDetailResp,
  insertLabReq,
  updateLabReq
} from '../../../api/web/model/lab'
import { IFileItem } from '../../../api/common'
import BaseLabList from '../BaseLabList.vue'
import { ROUTER_NAME } from '../../../router'
import { fileSrc2File } from '../../../util/utils'
import dayjs, { Dayjs } from 'dayjs'
import InsertLabModal from './InsertLabModal.vue'
import UpdateLabModal from './UpdateLabModal.vue'

export interface updateLabExtendReq extends updateLabReq {
  fileList: IFileItem[]
}

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
    console.log(res)
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
      courseId: props.courseId
    }
  ]
})

// 分页数据
const pag = computed(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

// 在列表处阻断删除
const removeFile = () => {
  message.info('请在修改处删除文件')
  return false
}

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

// 删除实验
const {
  run: runDeleteLab,
  loading: loadingDeleteLab,
  error: errorDeleteLab
} = useRequest(apiDeleteLab)
const handleDeleteLab = (labId: number) => {
  Modal.confirm({
    title: () => '您确认要删除该实验吗',
    icon: () => createVNode(ExclamationCircleOutlined),
    content: () => '删除将不可挽回，请谨慎确认',
    onOk: async() => {
      await runDeleteLab({ labId })
      if (errorDeleteLab.value) {
        // 原地修改
        return
      }
      await refreshListLab()
    },
    onCancel() {},
    okButtonProps: { loading: loadingDeleteLab.value, danger: true },
    okText: () => '确认删除',
    cancelText: () => '取消'
  })
}

// 修改实验
const updateLabInitState = reactive<updateLabExtendReq>({
  labId: 0,
  title: '',
  content: '',
  deadline: dayjs(),
  fileList: [],
  attachmentSrc: ''
})

// 弹出修改框
const handleShowUpdateLab = (item: labDetailResp) => {
  updateLabInitState.labId = item.labId
  updateLabInitState.title = item.title
  updateLabInitState.content = item.content
  updateLabInitState.deadline = dayjs(item.deadline)
  updateLabInitState.attachmentSrc = undefined
  if (item.attachmentSrc !== '') {
    updateLabInitState.fileList = [fileSrc2File(item.attachmentSrc)]
  }
  visibleUpdateModal.value = true
}

// 修改框是否可见
const visibleUpdateModal = ref<boolean>(false)

const style = useCssModule()
</script>

<style lang="scss" module>
.insertDiv {
  display: flex;
  padding-left: 24px;
  margin-bottom: 16px;
}

.updateBtu {
  color: gray;
}

.firstBtu {
  margin-left: -15px;
}
</style>
