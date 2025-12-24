import { ENDPOINTS } from "@/constants"
import { getData } from "@/constants/api"
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
        if(res.err){
            handleErrorCase(res, setAdminLoading, logout, setError)
            return
        }
        setAdminLoading(false)
        setCarriers(res.data?.data)
    }

    async function getTransactions(page: number, limit: number){
        setAdminLoading(true)
        let res = await getData(`${ENDPOINTS.transactions}?page=${page}&limit=${limit}`, refreshAuth, authToken)
        console.log("response from carrier get", res.error || res.data?.data)
        if(res.err){
            handleErrorCase(res, setAdminLoading, logout, setError)
            return
        }
        setAdminLoading(false)
        setTransactions(res.data?.data)
    }

    useEffect(()=>{
        if(!adminLoading){
            authToken && !dashboard && getDashboardData()
            authToken && !senders && getSenders(1, 20)
            authToken && !carriers && getCarriers(1, 20)
            authToken && !transactions && getTransactions(1, 20)
        }
    }, [dashboard, authToken, senders, adminLoading])

    return{
        dashboard,
        senders,
        carriers,
        transactions,
        error,
        adminLoading,
        getSenders,
        getCarriers,
        getTransactions
    }
}