<template>
  <div :class="style.insertDiv">
    <a-button type="primary" @click="visibleInsertModal=true">
      <form-outlined/>
      新建实验
    </a-button>
  </div>

  <base-lab-list :data-source="dataListLab?.records" :loading="loadingListLab" :pag="pagination">
    <template #actions="{ item }">
      <a-button :class="style.firstBtu" type="link" @click="handleRouterToLabDetail(item.labId)">
        <send-outlined/>
        查看详情
      </a-button>
      <a-button :class="style.updateBtu" type="link" @click="handleShowUpdateLab(item)">
        <edit-outlined/>
        修改
      </a-button>
      <a-button danger type="link" @click="handleDeleteLab(item.labId)">
        <delete-outlined/>
        删除
      </a-button>
    </template>
  </base-lab-list>

  <a-modal
      v-model:visible="visibleUpdateModal"
      :ok-button-props="{ loading: loadingUpdateLab }"
      cancel-text="取消"
      ok-text="确认修改"
      title="修改实验"
      width="800px"
      @ok="handleUpdateLab">
    <a-form :label-col="{ span: 3 }" :model="updateLabFormState" :wrapper-col="{ span: 20 }">
      <a-form-item label="实验名称">
        <a-input v-model:value="updateLabFormState.title"/>
      </a-form-item>
      <a-form-item label="实验内容">
        <a-textarea v-model:value="updateLabFormState.content" rows="4"/>
      </a-form-item>
      <a-form-item label="截止日期">
        <a-date-picker
            v-model:value="updateLabFormState.deadline"
            placeholder="选择截止日期"
            showToday
            style="width: 100%"
            type="date"/>
      </a-form-item>
      <a-form-item label="上传附件">
        <a-upload
            :before-upload="updateBeforeUpload">
          <a-button>
            <upload-outlined/>
            点击上传
          </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
      v-model:visible="visibleInsertModal"
      :ok-button-props="{ loading: loadingInsertLab }"
      cancel-text="取消"
      ok-text="确认新建"
      title="新建实验"
      width="800px"
      @ok="handleInsertLab">
    <a-form :label-col="{ span: 3 }" :model="insertFormState" :wrapper-col="{ span: 20 }">
      <a-form-item label="实验名称">
        <a-input v-model:value="insertFormState.title"/>
      </a-form-item>
      <a-form-item label="实验内容">
        <a-textarea v-model:value="insertFormState.content" allow-clear rows="4"/>
      </a-form-item>
      <a-form-item label="截止日期">
        <a-date-picker
            v-model:value="insertFormState.deadline"
            placeholder="选择截止日期"
            showToday
            style="width: 100%"
            type="date"/>
      </a-form-item>
      <a-form-item label="上传附件">
        <a-upload
            :before-upload="insertBeforeUpload"
            :file-list="insertFileList">
          <a-button>
            <upload-outlined></upload-outlined>
            点击上传
          </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, createVNode, reactive, ref, useCssModule } from 'vue'
import { useRouter } from 'vue-router'
import { usePagination, useRequest } from 'vue-request'
import { apiDeleteLab, apiInsertLab, apiListLabByCourseId, apiUpdateLab } from '../../../api/web/lab'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  SendOutlined,
  UploadOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { labDetailResp, insertLab, updateLab } from '../../../api/web/model/lab'
import { IFileItem } from '../../../api/common'
import { apiUploadFile } from '../../../api/web/file'
import BaseLabList from '../BaseLabList.vue'
import { ROUTER_NAME } from '../../../router'

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
    return res.data.result
  },
  defaultParams: [{
    courseId: props.courseId
  }]
})
// 分页数据
const pagination = computed(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

const { run: runUpload, data: dataUpload } = useRequest(apiUploadFile, {
  formatResult: (res) => {
    return res.data.result
  }
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

const {
  run: runDeleteLab,
  loading: loadingDeleteLab,
  error: errorDeleteLab
} = useRequest(apiDeleteLab)
const handleDeleteLab = (labId: number) => {
  Modal.confirm({
    title: '您确认要删除该实验吗',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除将不可挽回，请谨慎确认',
    onOk: async () => {
      await runDeleteLab({ labId })
      if (!errorDeleteLab) {
        // 原地修改
        await refreshListLab()
      }
    },
    onCancel () {
    },
    okButtonProps: { loading: loadingDeleteLab.value },
    okText: '确认删除',
    cancelText: '取消'
  })
}

// 修改实验
const updateLabFormState = reactive<updateLab>({
  labId: 0,
  title: '',
  content: ''
})

// 弹出修改框
const handleShowUpdateLab = (item: labDetailResp) => {
  updateLabFormState.labId = item.labId
  updateLabFormState.title = item.title
  updateLabFormState.content = item.content
  updateLabFormState.deadline = item.deadline
  if (item.attachmentFileDetail) {
    const file: IFileItem = {
      uid: item.attachmentFileDetail.localFileId,
      url: item.attachmentFileDetail.url,
      size: item.attachmentFileDetail.size,
      type: item.attachmentFileDetail.contentType
    }
    updateFileList.value = [file]
  }
  visibleUpdateModal.value = true
}

// 修改框是否可见
const visibleUpdateModal = ref<boolean>(false)
const updateFileList = ref<IFileItem[]>([])
const { run: runUpdateLab, loading: loadingUpdateLab, error: errorUpdateLab } = useRequest(apiUpdateLab)
const handleUpdateLab = async () => {
  // 先上传文件
  if (updateFileList.value.length > 0) {
    const formData = new FormData()
    formData.append('file', updateFileList.value[0] as any)
    await runUpload(formData)
    if (dataUpload.value) {
      updateLabFormState.attachmentFileId = dataUpload.value.fileId
    }
  }
  await runUpdateLab(updateLabFormState)
  if (!errorUpdateLab) {
    await refreshListLab()
  }
}

// 新建框是否可见
const visibleInsertModal = ref<boolean>(false)
// 新建实验
const insertFormState = reactive<insertLab>({
  title: '',
  content: ''
})
const {
  run: runInsertLab,
  loading: loadingInsertLab,
  error: errorInsertLab
} = useRequest(apiInsertLab, {
  formatResult: (res) => {
    return res.data.result
  }
})
const insertFileList = ref<IFileItem[]>([])
const handleInsertLab = async () => {
  // 先上传文件
  if (insertFileList.value.length > 0) {
    const formData = new FormData()
    formData.append('file', insertFileList.value[0] as any)
    await runUpload(formData)
    if (dataUpload.value) {
      updateLabFormState.attachmentFileId = dataUpload.value.fileId
    }
  }
  await runInsertLab(updateLabFormState)
  if (!errorInsertLab) {
    // 原地插入
    await refreshListLab()
  }
}

const beforeUpload = (file: IFileItem) => {
  const supportUploadType: string[] = ['image/jpeg', 'image/png']
  // 该类型不支持
  if (file.type === undefined || !supportUploadType.includes(file.type)) {
    message.error('不支持的上传文件类型')
  }
  const isLt2M = file.size / 1024 / 1024 < 1
  if (!isLt2M) {
    message.error('图片大小需小于1MB!')
  }
  return false
}

const insertBeforeUpload = (file: IFileItem) => {
  insertFileList.value = [file]
  return beforeUpload(file)
}

const updateBeforeUpload = (file: IFileItem) => {
  insertFileList.value = [file]
  return beforeUpload(file)
}

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
