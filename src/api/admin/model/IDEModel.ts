import { pageParams } from '../../common'
import internal from "stream";

export interface listIDEResp {
    containerId: string
    userId: number
    userDetail?: {
        username: string
    }
    labId: number
    labDetail?: {
        title: string
        courseId: number
    }
    state: string
    status: string
    memoryLimit: number
    memory: number
}

export interface listIDEReq extends pageParams {

}

export interface removeContainerReq {
    containerId: string
}

export interface restartContainerReq {
    containerId: string
}

export interface serverInfoResp {
    ID: string
    name: string
    operatingSystem: string
    kernelVersion: string
    architecture: string
    containersRunning:string
    containersPaused:string
    containersStopped:string
    images: number
    NCPU: number
    memTotal: number
}
