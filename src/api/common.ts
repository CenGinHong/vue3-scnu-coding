export interface filters {
  text: string
  value: string
  children?: filters[]
}

// 分页约束
export interface pageResp<T> {
  records: T[]
  total: number
  filter: {
    [filterName: string]: filters[]
  }
}

// 表格约束
export interface columnType {
  title: string
  dataIndex: string[] | string
  width?: string
  filters?: filters[] | undefined
  key?: string
  fixed?: string
  sorter?: boolean
  sortDirections?: string[]
  defaultSortOrder?: string
  filterMultiple?: string[] | boolean
  ellipsis?: boolean
}

export interface pageParams {
  current?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'descend' | 'ascend'

  [key: string]: any
}

// 选择器的类型
export interface selectType {
  value: number | string
  label: string
  disabled?: boolean
  key?: string
  title?: string
}

export interface saveResp {
  id: number
}

export interface deleteReq {
  id: number
}

export interface uploadResp {
  fileSrc: string
}

export interface Result<T = any> {
  code: number
  // type?: 'success' | 'error' | 'warning'
  message: string
  result?: T
}

export interface IFileItem extends Partial<File> {
  uid?: string | number
  status?: string
  response?: Result<uploadResp>
  url?: string
  preview?: string
  originFileObj?: File
  // file?: string | Blob;
}

export interface FileInfo {
  file: IFileItem
  fileList: IFileItem[]
}

export interface IPagination {
  current: number
  pageSize: number
  total: number
  onChange: (page?: number, pageSize?: number) => void
  position: string[]
}

export interface cascaderOption {
  value: string
  label: string
  children?: cascaderOption[]
}

export interface radioOption {
  value: string | number
  label: string
}

export interface ITransfer {
  key: string
  title: string
  description?: string
  disabled?: boolean
}
