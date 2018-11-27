import request from "@/utils/request";

export async function requestList(params) {
    return request(`unit/project/data`, {
        method: "POST",
        body: params
    });
}

export async function save(params) {
    return request(`unit/project/save`, {
        method: "POST",
        body: params
    });
}
export async function update(params) {
    return request(`unit/project/update`, {
        method: "POST",
        body: params
    });
}
export async function updateLocationMap(params) {
    return request(`unit/project/updateLocationMap`, {
        method: "POST",
        body: params
    });
}

export async function deleteById(params) {
    return request(`unit/project/deleteById`, {
        method: "POST",
        body: params
    });
}

export async function getProBaseInfoById(params) {
    return request(`unit/project/getById`, {
        method: "POST",
        body: params
    });
}

export async function getProjectOptions(params) {
    return request(`unit/project/getProjectOptions`, {
        method: "POST",
        body: params
    });
}
