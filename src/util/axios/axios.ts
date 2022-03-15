import axios, { AxiosRequestConfig } from 'axios'
import { message as Message } from 'ant-design-vue/lib/components'
import qs from 'qs'
import { ResultEnum } from '../../enums/httpEnum'
import store from '../../store'

// export const baseURL = 'http://10.50.3.213:8199'
export const baseURL = 'http://localhost:8199'

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.patch['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'

const instance = axios.create({
  baseURL: baseURL,
  // baseURL: 'http://127.0.0.1:4523/mock/386173',
  timeout: 10000000,
  responseType: 'json'
})

instance.interceptors.request.use(
  (config:any) => {
    const token: string = store.getters['user/token']
    if (token && token !== '') {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response:any) => {
    const method = response.config.method
    const { data } = response
    if (response.headers['content-type'] === 'application/json') {
      if (data.code === ResultEnum.SUCCESS) {
        if (
          method === 'delete' ||
          method === 'post' ||
          method === 'put' ||
          method === 'patch'
        ) {
          Message.success('操作成功')
        }
        return response
      } else {
        Message.error(data.message)
        return Promise.reject(new Error(data.message))
      }
    }
    return response

    // 请求成功
    // const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS
    // // 是否显示提示信息
    // if (isShowMessage) {
    //   if (hasSuccess && (successMessageText || isShowSuccessMessage)) {
    //     // 是否显示自定义信息提示
    //     Message.success(successMessageText || message || '操作成功！')
    //   } else if (!hasSuccess && (errorMessageText || isShowErrorMessage)) {
    //     // 是否显示自定义信息提示
    //     Message.error(message || errorMessageText || '操作失败！')
    //   } else if (!hasSuccess && options.errorMessageMode === 'modal') {
    //     // errorMessageMode=‘custom-modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    //     Modal.confirm({ title: '错误提示', content: message })
    //   }
    // }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    // if (!isTransformRequestResult) {
    //   return res.data
    // }

    // if (!data) {
    // return '[HTTP] Request has no return value';
    // return reject(data)
    // }

    // 接口请求成功，直接返回结果
    // if (code === ResultEnum.SUCCESS) {
    //   return result
    // }
    // 接口请求错误，统一提示错误信息
    // if (code !== ResultEnum.SUCCESS) {
    //   if (message) {
    //     Message.error(data.message)
    //     // Promise.reject(new Error(message))
    //   } else {
    //     const msg = '操作失败,系统异常!'
    //     Message.error(msg)
    //     // Promise.reject(new Error(msg))
    //   }
    //   return reject()
    // }

    // // 登录超时
    // if (code === ResultEnum.TIMEOUT) {
    //   if (router.currentRoute.value.name === 'login') return
    //   // 到登录页
    //   const timeoutMsg = '登录超时,请重新登录!'
    //   Modal.destroyAll()
    //   Modal.warning({
    //     title: '提示',
    //     content: '登录身份已失效,请重新登录!',
    //     onOk: () => {
    //       router.replace({
    //         name: 'login',
    //         query: {
    //           redirect: router.currentRoute.value.fullPath
    //         }
    //       })
    //       storage.clear()
    //     }
    //   })
    //   return reject(new Error(timeoutMsg))
    // }

    // 这里逻辑可以根据项目进行修改
    // if (!hasSuccess) {
    //     return reject(new Error(message))
    // }

    // return data
    // return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
