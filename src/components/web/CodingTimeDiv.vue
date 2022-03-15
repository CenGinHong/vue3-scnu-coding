<template>
  <div style="height: 150px ;width: 700px">
    <a-skeleton active :loading="loadingCodingTime">
      <e-charts
          :autoresize="true"
          :option="option"
      />
    </a-skeleton>
  </div>
</template>

<script lang="ts" setup>
// 获得编码时间
import { useRequest } from 'vue-request'
import { apiGetCodingTime } from '../../api/web/user'
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CalendarComponent, TitleComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import { HeatmapChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import ECharts from 'vue-echarts'
use([
  TitleComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer
])
// eslint-disable-next-line no-undef
const props = defineProps<{
  userId?: number
  courseId?: number
}>()

const {
  data: dataCodingTime,
  loading: loadingCodingTime
} = useRequest(apiGetCodingTime, {
  manual: false,
  defaultParams: [
    {
      userId: props.userId,
      courseId: props.courseId
    }
  ],
  formatResult: (res) => {
    const ret: [string, number][] = []
    const record = res.data.result!
    for (const recordElement of record) {
      ret.push([recordElement.createdAt, recordElement.duration])
    }
    return ret
  }
})

// 日历图数据
const option = computed(() => {
  return {
    title: {
      show: true
    },
    tooltip: {},
    calendar: {
      top: 30,
      left: 10,
      cellSize: 13,
      range: new Date().getFullYear(),
      itemStyle: {
        borderWidth: 0.5
      },
      dayLabel: {
        show: false
      },
      monthLabel: {
        show: false
      },
      yearLabel: { show: false }
    },
    visualMap: {
      show: false
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: dataCodingTime.value
    }
  }
})
</script>

<style scoped>

</style>
