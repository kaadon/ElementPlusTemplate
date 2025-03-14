"use strict";

const baseUrl = '/api/account'
export  const useAccountLogin = (data) => {
    return useAxios(`${baseUrl}/login`, 'post', data)
}


