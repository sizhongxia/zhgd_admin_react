export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === "undefined"
      ? localStorage.getItem("antd-pro-authority")
      : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === "string") {
    return [authority];
  }
  return authority || ["guest"];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === "string" ? [authority] : authority;
  return localStorage.setItem(
    "antd-pro-authority",
    JSON.stringify(proAuthority)
  );
}

export function setLoginInfo(loginInfo) {
  return localStorage.setItem("loginfo", JSON.stringify(loginInfo));
}

export function getLoginInfo() {
  const loginInfo = localStorage.getItem("loginfo");
  let user;
  try {
    user = JSON.parse(loginInfo);
  } catch (e) {
    localStorage.setItem("loginfo", "{}");
  }
  return user || {};
}
