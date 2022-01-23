<template>
  <a-card :loading="loadingListServerInfo">
    <a-descriptions title="容器宿主机" bordered>
      <a-descriptions-item label="主机名">{{ dataListServerInfo?.name }}</a-descriptions-item>
      <a-descriptions-item label="ID" :span="2">{{ dataListServerInfo?.ID }}</a-descriptions-item>

      <a-descriptions-item label="操作系统">{{ dataListServerInfo?.operatingSystem }}</a-descriptions-item>
      <a-descriptions-item label="内核版本">{{ dataListServerInfo?.kernelVersion }}</a-descriptions-item>
      <a-descriptions-item label="架构">{{ dataListServerInfo?.architecture }}</a-descriptions-item>

      <a-descriptions-item label="运行中容器数量">{{ dataListServerInfo?.containersRunning }}</a-descriptions-item>
      <a-descriptions-item label="挂起中容器数量">{{ dataListServerInfo?.containersPaused }}</a-descriptions-item>
      <a-descriptions-item label="停止中容器数量">{{ dataListServerInfo?.containersStopped }}</a-descriptions-item>
      <a-descriptions-item label="镜像数量">{{ dataListServerInfo?.images }}</a-descriptions-item>
      <a-descriptions-item label="NCPU">{{ dataListServerInfo?.NCPU }}</a-descriptions-item>
      <a-descriptions-item label="总内存">{{ numFilter(dataListServerInfo?.memTotal) }}GiB</a-descriptions-item>
    </a-descriptions>
  </a-card>

</template>

<script lang="ts" setup>

import { useRequest } from 'vue-request'
import { apiListServerInfo } from '../../api/admin/ide'

const numFilter = (value: number) => {
  // 截取当前数据到小数点后两位
  const realVal = value / 1024 / 1024 / 1024
  return realVal.toFixed(2)
}

const { data: dataListServerInfo, loading: loadingListServerInfo } = useRequest(apiListServerInfo, {
  manual: false,
  formatResult: res => {
    return res.data.result
  }
})

</script>

<style scoped>

</style>
