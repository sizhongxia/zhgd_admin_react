import request from "@/utils/request";

export async function updateVideo(params) {
    return request(`/device/video/update`, {
        method: "POST",
        body: params
    });
}

export async function saveVideo(params) {
    return request(`/device/video/save`, {
        method: "POST",
        body: params
    });
}

export async function getDeviceBaseInfoById(params) {
    return request(`/device/video/getById`, {
        method: "POST",
        body: params
    });
}

export async function deleteById(params) {
    return request(`device/video/deleteById`, {
        method: "POST",
        body: params
    });
}