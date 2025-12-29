import { ENDPOINTS } from "@/constants"
import { getData, patchData } from "@/constants/api"
import { handleErrorCase } from "@/utils/helpers"
import { useEffect, useState } from "react"

export default function useAdmin(authToken: string, refreshAuth: (token: string)=> void, logout: ()=>void){
    let [dashboard, setDashboard] = useState(null)
    let [senders, setSenders] = useState<any>(null)
    let [carriers, setCarriers] = useState<any>(null)
    let [transactions, setTransactions] = useState<any>(null)

    let [error, setError] = useState("")

    let [adminLoading, setAdminLoading] = useState(false)

    async function getDashboardData(){
        setAdminLoading(true)
        let res = await getData(ENDPOINTS.dashboard, refreshAuth, authToken)
        if(res.err){
            handleErrorCase(res, setAdminLoading, logout, setError)
            return
        }

        setAdminLoading(false)
        setDashboard(res.data?.data)
    }

    async function getSenders(page: number, limit: number){
        setAdminLoading(true)
        let res = await getData(`${ENDPOINTS.users}?role=SENDER&page=${page}&limit=${limit}`, refreshAuth, authToken)
        console.log("response from senders get", res.error || res.data?.data)
        if(res.err){
            handleErrorCase(res, setAdminLoading, logout, setError)
            return
        }
        setAdminLoading(false)
        setSenders(res.data?.data)
    }

    async function getCarriers(page: number, limit: number){
        setAdminLoading(true)
        let res = await getData(`${ENDPOINTS.users}?role=CARRIER&page=${page}&limit=${limit}`, refreshAuth, authToken)
        console.log("response from carriers get", res.error || res.data?.data)
        if(res.err){
            handleErrorCase(res, setAdminLoading, logout, setError)
            return
        }
        setAdminLoading(false)
        setCarriers(res.data?.data)
    }

    async function getSingleUser(userId: string){
        setAdminLoading(true)
        let res = await getData(`${ENDPOINTS.users}/${userId}`, refreshAuth, authToken)
        console.log("result from gettign single user", res.error?.response?.data || res.data?.data)
        if(res.err){
            handleErrorCase(res, setAdminLoading, logout, setError)
            return
        }
        setAdminLoading(false)
        return {success: true, data: res.data?.data}
    }

    async function getTransactions(page: number, limit: number){
        setAdminLoading(true)
        let res = await getData(`${ENDPOINTS.transactions}?page=${page}&limit=${limit}`, refreshAuth, authToken)
        console.log("response from transaction get", res.error || res.data?.data)
        if(res.err){
            handleErrorCase(res, setAdminLoading, logout, setError)
            return
        }
        setAdminLoading(false)
        setTransactions(res.data?.data)
    }

    async function toggleGuarantorOrVehicleDetails(id: string, vehicleType: string, body: any){
        console.log("toggle clicked.. id:", id, body)
        setAdminLoading(true)
        let res
        if(vehicleType === "walking" || vehicleType === "bicycle"){
            res = await patchData(`/admin/carrier/${id}/guarantor-details`, refreshAuth, body, authToken)
            console.log("response from guarantor toggle", res.error || res.data)
            if(res.err){
                handleErrorCase(res, setAdminLoading, logout, setError)
                return
            }
        }

        if(vehicleType === "bike" || vehicleType === "car"){
            res = await patchData(`/admin/carrier/${id}/vehicle-details`, refreshAuth, body, authToken)
            console.log("response from vehicle toggle", res.error || res.data)
            if(res.err){
                handleErrorCase(res, setAdminLoading, logout, setError)
                return
            }
        }

        setAdminLoading(false)

    }

    useEffect(()=>{
            authToken && !dashboard && getDashboardData()
            authToken && !senders && getSenders(1, 20)
            authToken && !carriers && getCarriers(1, 20)
            //authToken && !transactions && getTransactions(1, 20)
    }, [dashboard, authToken, senders, carriers])

    return{
        dashboard,
        senders,
        carriers,
        transactions,
        error,
        adminLoading,
        getSingleUser,
        getSenders,
        getCarriers,
        getTransactions,
        toggleGuarantorOrVehicleDetails
    }
}