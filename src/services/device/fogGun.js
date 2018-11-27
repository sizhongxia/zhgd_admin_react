import request from "@/utils/request";

export async function updateFogGun(params) {
    return request(`/device/fogGun/update`, {
        method: "POST",
        body: params
    });
}

export async function saveFogGun(params) {
    return request(`/device/fogGun/save`, {
        method: "POST",
        body: params
    });
}

export async function getDeviceBaseInfoById(params) {
    return request(`/device/fogGun/getById`, {
        method: "POST",
        body: params
    });
}

export async function deleteById(params) {
    return request(`device/fogGun/deleteById`, {
        method: "POST",
        body: params
    });
}