<template>
  <a-row class="row">
    <a-col :span="20" :offset="1" class="col">
      <a-tabs class="tab" size="large" v-model:activeKey="tabsActiveKey">
        <a-tab-pane key="1" tab="提交情况">
          <teacher-submit-table
              class="submitTable"
              :lab-id="Number(labId)"
          />
        </a-tab-pane>
        <a-tab-pane key="2" tab="实验批阅">
            <teacher-correct-submit :lab-id="Number(labId)" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="实验评论">
          <div class="labComment">
            <lab-comment :lab-id="Number(labId)" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="重复检测"> </a-tab-pane>
        <a-tab-pane key="5" tab="错误日志"> </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { ref, useCssModule } from 'vue'
import { useRoute } from 'vue-router'
import TeacherSubmitTable from '../../components/web/teacher/TeacherSubmitTable.vue'
import LabComment from '../../components/web/LabComment.vue'
import TeacherCorrectSubmit from '../../components/web/teacher/TeacherCorrectSubmit.vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: string
}>()

const route = useRoute()
const tabsActiveKey = ref<string>('1')

</script>

<style lang="scss" scoped>

.row {
  margin-top: 20px;
  height: auto;

  .col {
    background-color: white;
    border-radius: 8px;
    padding: 10px 10px 10px 10px;

    .submitTable {
      margin: 0 6px 0 6px;
    }

    .labComment {
      padding: 0 16px 0 16px;
    }

    .correct {
      padding: 20px 40px 0 40px;
    }
  }
}
</style>

<style lang="scss" scoped>
::v-deep(.ant-tabs-nav-wrap) {
  margin-left: 16px;
}
</style>
