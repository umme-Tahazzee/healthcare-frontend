import apiClient from "@/lib/apiClient";


interface user {
      email : string,
      password : string
}


export  function userLogin(payload: user) {
     return apiClient("/auth/login", {
         method : "POST",
         body: payload
     })
}


export  function getMe() {
     return apiClient("/auth/me", {
         method : "get",
      
     })
}


export  function userLogout() {
     return apiClient("/auth/logout", {
         method : "POST",
     })
}