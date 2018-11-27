import request from "@/utils/request";

export async function deviceList(params) {
    return request(`device/data`, {
        method: "POST",
        body: params
    });
}

export async function getReceiptByUuid(params) {
    return request(`device/getReceiptByUuid`, {
        method: "POST",
        body: params
    });
}

export async function getProjectDeviceOptions(params) {
    return request(`device/getProjectDeviceOptions`, {
        method: "POST",
        body: params
    });
}

export async function resetReceiptByUuid(params) {
    return request(`device/resetReceiptByUuid`, {
        method: "POST",
        body: params
    });
}
