import request from "@/utils/request";

export async function requestList(params) {
  return request(`unit/company/data`, {
    method: "POST",
    body: params
  });
}
export async function save(params) {
  return request(`unit/company/save`, {
    method: "POST",
    body: params
  });
}
export async function update(params) {
  return request(`unit/company/update`, {
    method: "POST",
    body: params
  });
}
export async function getById(params) {
  return request(`unit/company/getById`, {
    method: "POST",
    body: params
  });
}
export async function deleteById(params) {
  return request(`unit/company/deleteById`, {
    method: "POST",
    body: params
  });
}
export async function getCompanyOptions(params) {
  return request(`unit/company/getCompanyOptions`, {
    method: "POST",
    body: params
  });
}
