import request from "@/utils/request";

export async function updateDustNoise(params) {
    return request(`/device/dustNoise/update`, {
        method: "POST",
        body: params
    });
}

export async function saveDustNoise(params) {
    return request(`/device/dustNoise/save`, {
        method: "POST",
        body: params
    });
}

export async function getDeviceBaseInfoById(params) {
    return request(`/device/dustNoise/getById`, {
        method: "POST",
        body: params
    });
}

export async function deleteById(params) {
    return request(`device/dustNoise/deleteById`, {
        method: "POST",
        body: params
    });
}