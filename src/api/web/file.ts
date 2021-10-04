import instance, { baseURL } from '../../util/axios/axios'
import { Result, uploadResp } from '../common'
import { deleteFileReq } from './model/file'

enum Api {
  file = '/file',
}

export const uploadApi = baseURL + Api.file

export function apiUploadFile(data: FormData) {
  return instance.post<FormData, Result<uploadResp>>(Api.file, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function apiDeleteFile(params: deleteFileReq) {
  return instance.delete<Result>(Api.file, {
    params
  })
}
