import request from "@/utils/request";

export async function requestList(params) {
    return request(`loginaccount/data`, {
        method: "POST",
        body: params
    });
}

export async function save(params) {
    return request(`loginaccount/save`, {
        method: "POST",
        body: params
    });
}
export async function update(params) {
    return request(`loginaccount/update`, {
        method: "POST",
        body: params
    });
}

export async function changeState(params) {
    return request(`loginaccount/changeState`, {
        method: "POST",
        body: params
    });
}

export async function resetpwd(params) {
    return request(`loginaccount/resetPwd`, {
        method: "POST",
        body: params
    });
}