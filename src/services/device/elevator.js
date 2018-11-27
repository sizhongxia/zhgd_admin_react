import request from "@/utils/request";

export async function updateDustNoise(params) {
    return request(`/device/elevator/update`, {
        method: "POST",
        body: params
    });
}

export async function saveDustNoise(params) {
    return request(`/device/elevator/save`, {
        method: "POST",
        body: params
    });
}

export async function getDeviceBaseInfoById(params) {
    return request(`/device/elevator/getById`, {
        method: "POST",
        body: params
    });
}

export async function deleteById(params) {
    return request(`device/elevator/deleteById`, {
        method: "POST",
        body: params
    });
}