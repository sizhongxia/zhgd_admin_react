import request from "@/utils/request";

export async function requestList(params) {
  return request(`unit/department/data`, {
    method: "POST",
    body: params
  });
}
export async function save(params) {
  return request(`unit/department/save`, {
    method: "POST",
    body: params
  });
}
export async function update(params) {
  return request(`unit/department/update`, {
    method: "POST",
    body: params
  });
}
export async function getById(params) {
  return request(`unit/department/getById`, {
    method: "POST",
    body: params
  });
}
export async function deleteById(params) {
  return request(`unit/department/deleteById`, {
    method: "POST",
    body: params
  });
}
