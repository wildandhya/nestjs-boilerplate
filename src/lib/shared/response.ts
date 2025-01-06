export abstract class BaseResponse<T> {
    status: boolean
    message: string
    data: T | null

    constructor(status: boolean, message:string, data: T | null){
        this.status = status
        this.message = message
        this.data = data
    }
}