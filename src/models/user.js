import { getLoginInfo } from "@/utils/authority";
import { Modal, message } from "antd";

export default {
  namespace: "user",

  state: {
    list: [],
    currentUser: {}
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield getLoginInfo();
      if (response && !response.status && !!response.token) {
        yield put({
          type: "saveCurrentUser",
          payload: response
        });
      } else {
        window.location.href = "#/user/login";
      }
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {}
      };
    }
  }
};
