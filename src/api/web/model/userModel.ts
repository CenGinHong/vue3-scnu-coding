export interface codingTime {
  record: {
    duration: number
    CreatedAt: string
  }[]
}

export interface getUserInfoResp {
  userId: number
  email: string
  userNum: string
  username: string
  school: string
  avatarUrl: string
  grade: number,
  gender: 0 | 1 | 2
  roleId: number
  major: string
  organization: string
}

export interface updateUserInfoReq {
  email: string
  userNum: string
  username: string
  grade: number
  school: string
  oldPassword: string
  password: string
  avatarUrl: string
  gender: 0 | 1 | 2
  major: string
  organization: string
  verCode: string,
}

export interface isEmailUsedReq {
  email: string
}

export interface isUserNumUsedReq {
  userNum: string
}

export interface isUsedResp {
  isUsed: boolean
}

export interface getCodingTimeResp {
  userId: number
}

export interface testData {
  id: number
}

export interface loginReq {
  userNum: string,
  password: string
}

export interface loginResp {
  token: string
}

export interface resetPasswordReq {
  userNum: string,
  email: string,
  verCode: string,
  newPassword: string,
}
