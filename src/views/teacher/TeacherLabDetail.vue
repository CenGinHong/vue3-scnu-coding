<template>
  <!--<lab-comment :lab-id="Number(labId)"/>-->
  <div :class="style.row">
    <a-tabs :class="style.tab" size="large" v-model:activeKey="tabsActiveKey">
      <a-tab-pane key="1" tab="提交情况">
        <teacher-submit-table :class="style.submitTable" :lab-id="Number(labId)" @mark="mark"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="实验批阅">
        <teacher-mark-submit :lab-id="Number(labId)" :class="style.markSubmit" :ref="sonRef"/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="实验评论">
        <div :class="style.labComment">
          <lab-comment :lab-id="Number(labId)"/>
        </div>
      </a-tab-pane>
      <a-tab-pane key="4" tab="重复检测">
      </a-tab-pane>
      <a-tab-pane key="5" tab="错误日志">
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, useCssModule } from 'vue'
import { useRoute } from 'vue-router'
import TeacherMarkSubmit from '../../components/web/teacher/TeacherMarkSubmit.vue'
import TeacherSubmitTable from '../../components/web/teacher/TeacherSubmitTable.vue'
import LabComment from '../../components/web/LabComment.vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: string
}>()

const route = useRoute()
const tabsActiveKey = ref<string>('1')

const sonRef = ref()

const mark = (username: string, userNum: string, labSubmitId: number) => {
  console.log(sonRef.value)
  sonRef.value?.test(username)
}
const style = useCssModule()

</script>

<style lang="scss" module>

.row:hover {
  box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.25);
}

.row {
  background-color: white;
  margin-left: 100px;
  margin-right: 100px;
  margin-top: 20px;
  height: auto;
  border-radius: 10px;
  transition: box-shadow 0.3s;

  .tab {
    padding-top: 20px;
    min-height: 420px;

    .ant-tabs {
      margin: 0;
    }

    .labComment {
      padding: 0 40px 0 40px;
    }
  }

  .submitTable {
    padding: 0 40px 0 40px;
  }

  .markSubmit {
    padding: 20px 40px 0 40px;
  }
}

</style>

<style lang="scss" scoped>
::v-deep(.ant-tabs-nav-scroll) {
  float: left;
  margin-left: 30px;
}
</style>
