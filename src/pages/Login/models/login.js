import { routerRedux } from "dva/router";
import { stringify } from "qs";
import { login } from "@/services/login";
import { setAuthority, setLoginInfo } from "@/utils/authority";
import { getPageQuery } from "@/utils/utils";
import { reloadAuthorized } from "@/utils/Authorized";

import { message } from "antd";

export default {
  namespace: "login",

  state: {
    status: undefined
  },

  effects: {
    *login({ payload }, { call, put }) {
      // payload 有效载荷,参数
      const response = yield call(login, payload);

      if (response.code !== 200) {
        message.destroy();
        message.error(response.message);
        return;
      }

      response.status = true;

      yield put({
        type: "changeLoginStatus",
        payload: response
      });

      // Login successfully
      reloadAuthorized();

      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.startsWith("/#")) {
            redirect = redirect.substr(2);
          }
        } else {
          window.location.href = redirect;
          return;
        }
      }
      yield put(routerRedux.replace(redirect || "/"));
    },

    *logout(_, { put }) {
      yield put({
        type: "changeLoginStatus",
        payload: {
          data: {
            currentAuthority: "nologin"
          }
        }
      });

      reloadAuthorized();

      yield put(
        routerRedux.push({
          pathname: "/user/login",
          search: stringify({
            redirect: window.location.href
          })
        })
      );
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.data.currentAuthority);
      setLoginInfo(payload.data);

      return {
        ...state,
        status: payload.status
      };
    }
  }
};
