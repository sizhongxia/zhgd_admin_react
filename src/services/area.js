import request from "@/utils/request";

export async function requestList(params) {
    return request(`sys/area/data`, {
        method: "POST",
        body: params
    });
}

export async function save(params) {
    return request(`sys/area/save`, {
        method: "POST",
        body: params
    });
}
export async function update(params) {
    return request(`sys/area/update`, {
        method: "POST",
        body: params
    });
}

export async function deleteById(params) {
    return request(`sys/area/deleteById`, {
        method: "POST",
        body: params
    });
}

export async function getAreas(params) {
    return request(`sys/area/getAreas`, {
        method: "POST",
        body: params
    });
}

export async function getAreaLevelModels() {
    return request(`sys/area/getAreaLevelModels`, {
        method: "POST"
    });
}