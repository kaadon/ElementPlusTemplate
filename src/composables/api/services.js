"use strict";

const baseUrl = '/member/v1/services'
export  const useServicesConnect = (data) => {
    return useAxios(`${baseUrl}/connect`, 'post', data)
}