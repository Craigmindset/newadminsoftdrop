import axios, { AxiosError, AxiosResponse } from "axios"
import { baseUrl, ENDPOINTS } from "."

function getHeaderObject(contentType: string = "application/json", authToken: string | undefined = undefined){
    let headers = typeof authToken == "string" ? {
        "Content-Type": contentType,
        "Accept": "application/json",
        "Authorization": `Bearer ${authToken}`
    } : {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    return headers
}

async function runInterceptor(refreshAuthToken: (token: string)=>Promise<void>){
    let hasRetried = false
    axios.interceptors.response.use((value: AxiosResponse)=>{
        return value
    }, async (error: AxiosError | any)=>{
        let originalRequest = error.config
        console.log("request intercepted..", JSON.stringify(error.config, null, 2), error.response.status, originalRequest._retry)
        if(error.response?.status === 401 && !hasRetried){
            console.log("status code", error.response?.status, "original request", originalRequest, "hasRetried variable", hasRetried)
            hasRetried = true;
            // console.log("retry set to true..., original request retry", originalRequest._retry)
            let resp = await axios.post(`${baseUrl}${ENDPOINTS.refreshAuthKey}`)
            // console.log("response from retrying", resp.data)
            await refreshAuthToken(resp.data.accessToken)
            originalRequest.headers.Authorization = `Bearer ${resp.data.accessToken}`
            return axios(originalRequest)
        }
        return Promise.reject(error)
    })
}

export async function getData(
    endpoint: string, 
    refreshFunc: (token: string)=>void, 
    authToken: string | undefined
){
    await runInterceptor(refreshFunc as any)
    try{
        let res = await axios.get(`${baseUrl}${endpoint}`, {
            headers: getHeaderObject("application/json", authToken)
        })
        return {err: false, data: res}
    }catch(err: any){
        return {err: true, error: err}
    }
}

export async function postData(
    endpoint: string,
    refreshFunc: (token: string) => void,
    body: any, 
    authToken: string | undefined=undefined, 
    contentType: string = "application/json"
){
    await runInterceptor(refreshFunc as any)
    try{
        let res = await axios.post(`${baseUrl}${endpoint}`, body, {
            headers: getHeaderObject(contentType, authToken)
        })
        return {err: false, data: res}
    }catch(err: any){
        return {err: true, error: err}
    }
}

export async function patchData(
    endpoint: string, 
    refreshFunc: (token: string) => void,
    body: any, 
    authToken: string | undefined, 
    contentType: string = "application/json"
){
    await runInterceptor(refreshFunc as any)
    try{
        let res = await axios.patch(`${baseUrl}${endpoint}`, body, {
            headers: getHeaderObject(contentType, authToken)
        })
        return {err: false, data: res}
    }catch(err: any){
        return {err: true, error: err}
    }
}

export async function putData(
    endpoint: string, 
    refreshFunc: (token: string) => void,
    body: any, 
    authToken: string | undefined, 
    contentType: string = "application/json"
){
    await runInterceptor(refreshFunc as any)
    try{
        let res = await axios.put(`${baseUrl}${endpoint}`, body, {
            headers: getHeaderObject(contentType, authToken)
        })
        return {err: false, data: res}
    }catch(err: any){
        return {err: true, error: err}
    }
}