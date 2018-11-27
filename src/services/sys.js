import request from "@/utils/request";

export async function check() {
  return request(`check`, {
    method: "POST",
    body: {}
  });
}