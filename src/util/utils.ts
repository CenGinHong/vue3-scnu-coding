import { UploadFile } from 'ant-design-vue/lib/upload/interface'
import { getUUID } from 'ant-design-vue/es/vc-dialog/util'
import { AxiosResponse } from 'axios'

export function scoreTagColor(score: number): string {
  if (score >= 90) {
    return 'green'
  } else if (score < 90 && score >= 80) {
    return 'cyan'
  } else if (score < 80 && score >= 70) {
    return 'purple'
  } else if (score < 70 && score >= 60) {
    return 'orange'
  } else if (score < 60 && score >= 0) {
    return 'red'
  } else {
    return 'default'
  }
}

export function randomString(e: number): string {
  e = e || 32
  const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz012345678'
  const a = t.length
  let n = ''
  for (let i = 0; i < e; i++) {
    n += t.charAt(Math.floor(Math.random() * a))
  }
  return n
}

export function randomNumberString(e: number): string {
  e = e || 32
  const t = '012345678'
  const a = t.length
  let n = ''
  for (let i = 0; i < e; i++) {
    n += t.charAt(Math.floor(Math.random() * a))
  }
  return n
}

export function getExt(fileName: string): string {
  return fileName.substring(fileName.lastIndexOf('.') + 1)
}

export function getBase64(file: File): Promise<String> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export function fileSrc2File(src: string): UploadFile {
  let name = src.substring(src.lastIndexOf('/') + 1, src.length)
  name = name.substring(name.indexOf('_') + 1, src.length)
  return {
    uid: getUUID().toString(),
    name,
    status: 'done',
    url: src
  }
}

export function dataToFile(res: AxiosResponse) {
  let fileName = decodeURI(res.headers['content-disposition'])
  fileName = fileName.substring(fileName.indexOf('=') + 1, fileName.length)
  const type = decodeURI(res.headers['content-type'])
  const blob = new Blob([res.data], { type: type })
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  } else {
    // IE10+下载
    // window.navigator.msSaveBlob(blob, fileName)
  }
}
