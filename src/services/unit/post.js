import request from "@/utils/request";

export async function requestList(params) {
  return request(`unit/post/data`, {
    method: "POST",
    body: params
  });
}
export async function save(params) {
  return request(`unit/post/save`, {
    method: "POST",
    body: params
  });
}
export async function update(params) {
  return request(`unit/post/update`, {
    method: "POST",
    body: params
  });
}
export async function getById(params) {
  return request(`unit/post/getById`, {
    method: "POST",
    body: params
  });
}
export async function deleteById(params) {
  return request(`unit/post/deleteById`, {
    method: "POST",
    body: params
  });
}
