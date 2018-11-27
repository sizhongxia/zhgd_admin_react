import request from "@/utils/request";

export async function updateDustNoise(params) {
    return request(`/device/towercrane/update`, {
        method: "POST",
        body: params
    });
}

export async function saveDustNoise(params) {
    return request(`/device/towercrane/save`, {
        method: "POST",
        body: params
    });
}

export async function getDeviceBaseInfoById(params) {
    return request(`/device/towercrane/getById`, {
        method: "POST",
        body: params
    });
}

export async function deleteById(params) {
    return request(`device/towercrane/deleteById`, {
        method: "POST",
        body: params
    });
}