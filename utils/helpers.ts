import { Toast } from "@/components/ui/toast"

export function getErrorMessage(response: any){
  let errormsg = response.error.response?.data[0]?.message || response?.error?.response?.data?.error?.message || response?.error?.response?.data?.message || response.error?.response?.message || response?.error?.message

  return errormsg
}

export function handleErrorCase(response: any, setLoadingState: (val: boolean)=>void, logout: ()=>void, setError: (val: string)=>void){
   if(response.error.status === 401){
      logout()
      return
    }
    let errromsg = getErrorMessage(response)
    setLoadingState(false)
    setError(errromsg)
}