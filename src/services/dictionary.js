import request from "@/utils/request";

export async function requestList(params) {
  return request(`dictionary/data`, {
    method: "POST",
    body: params
  });
}
export async function save(params) {
  return request(`dictionary/save`, {
    method: "POST",
    body: params
  });
}
export async function update(params) {
  return request(`dictionary/update`, {
    method: "POST",
    body: params
  });
}
export async function getById(params) {
  return request(`dictionary/getById`, {
    method: "POST",
    body: params
  });
}
export async function getAllTypes() {
    return request(`dictionary/getAllTypes`, {
      method: "POST",
      body: {}
    });
}
export async function deleteById(params) {
  return request(`dictionary/deleteById`, {
    method: "POST",
    body: params
  });
}
export async function getByType(params) {
  return request(`dictionary/getByType`, {
    method: "POST",
    body: params
  });
}
