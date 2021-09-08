import instance from '../../util/axios/axios'
import { Result, uploadResp } from '../common'

enum Api {
  uploadFile = '/file/upload'
}

export function apiUploadFile (data: FormData) {
  return instance.post<Result<uploadResp>>(Api.uploadFile, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
