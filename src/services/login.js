import request from "@/utils/request";
import { Modal } from "antd";

export async function login(params) {
  return request("user/login", {
    method: "POST",
    body: params
  });
}

const checkErr = () => {
  localStorage.setItem("loginfo", "{}");
  Modal.error({
    content: "为了您的账号安全，请重新登录",
    onOk: () => {
      localStorage.setItem("loginfo", "{}");
      window.location.href = "#/user/login";
    }
  });
};

export async function refreshToken() {
  const tokenInfo = await request("user/refreshToken", {
    method: "POST",
    body: {}
  });
  if (
    !!tokenInfo &&
    tokenInfo.code === 200 &&
    !!tokenInfo.data &&
    !!tokenInfo.data.success &&
    tokenInfo.data.success.indexOf("YeeTong") === 0
  ) {
    const newToken = tokenInfo.data.success;
    const loginInfo = localStorage.getItem("loginfo");
    let user;
    try {
      user = JSON.parse(loginInfo);
    } catch (e) {
      checkErr();
      return false;
    }
    user.token = newToken;
    localStorage.setItem("loginfo", JSON.stringify(user));
    return true;
  } else {
    checkErr();
    console.debug("to login...");
    return false;
  }
}
