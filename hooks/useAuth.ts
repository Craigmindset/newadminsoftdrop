import { ENDPOINTS, STORAGE_KEYS } from "@/constants";
import { postData } from "@/constants/api";
import { handleErrorCase } from "@/utils/helpers";
import { useEffect, useState } from "react"

export default function useAuth(){
    let [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
    let [accessToken, setAccessToken] = useState<any>("")
    let [refreshToken, setRefreshToken] = useState<any>("")

    let [authLoading, setAuthLoading] = useState(false)

    async function checkUserLoggedIn() {
      let _accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
      let _refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
      console.log("checking access and refresh tokens from local storage", _accessToken, _refreshToken)
      if (_accessToken !== null && _refreshToken !== null) {
        setAccessToken(_accessToken);
        setRefreshToken(_refreshToken);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
    
async function login(body: any, setError: (val: string)=>void) {
    setAuthLoading(true);
    let response = await postData(ENDPOINTS.login, refreshAuth, body);
    if (response.err) {
      console.log("login error", response.error.response.data)
      handleErrorCase(response, setAuthLoading, logout, setError);
      return;
    }

    console.log(
      "login success, body of data",
      response.data?.data,
      body
    );
    setAuthLoading(false);
    localStorage.setItem(
      STORAGE_KEYS.accessToken,
      response.data?.data.accessToken
    );
    localStorage.setItem(
      STORAGE_KEYS.refreshToken,
      response.data?.data.refreshToken
    );
    localStorage.setItem(STORAGE_KEYS.userPhone, body.phone);
    setAccessToken(response.data?.data.accessToken);
    setRefreshToken(response.data?.data.refreshToken);
    setIsLoggedIn(true);
    return { success: true };
  }

async function logout() {
    console.log(
      "refreshToken, accessToken",
      refreshToken,
      accessToken,
    );
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    setRefreshToken(null);
    setAccessToken(null);
    setIsLoggedIn(false);
}

async function refreshAuth(token: string) {
    localStorage.setItem(STORAGE_KEYS.accessToken, token);
    setAccessToken(token);
}

    useEffect(()=>{
        if(!accessToken && !refreshToken){
          checkUserLoggedIn()
        }
    }, [accessToken, refreshToken])
    console.log("access token", accessToken, "refreshToken", refreshToken)

    return{
        isLoggedIn,
        authLoading,
        accessToken,
        refreshAuth,
        login,
        logout
    }
}