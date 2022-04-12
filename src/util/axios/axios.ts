import axios, { AxiosRequestConfig } from 'axios'
import { ResultEnum } from '../../enums/httpEnum'
import store from '../../store'
import { message } from 'ant-design-vue'

// export const baseURL = 'http://10.50.3.213:8199'
export const baseURL = 'http://localhost:8199'

const instance = axios.create({
  baseURL: baseURL,
  // baseURL: 'http://127.0.0.1:4523/mock/386173',
  timeout: 30000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token: string = store.getters['user/token']
    if (token && token !== '') {
      config.headers!.Authorization = 'Bearer ' + token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response: any) => {
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
          message.success('操作成功')
        }
        return response
      } else {
        message.error(data.message)
        return Promise.reject(new Error(data.message))
      }
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
