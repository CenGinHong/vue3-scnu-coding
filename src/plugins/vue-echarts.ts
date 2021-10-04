import {
  TitleComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components'
import { HeatmapChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { use } from 'echarts/core'

use([
  TitleComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer
])
