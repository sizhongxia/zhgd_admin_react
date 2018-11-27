
import { message, Modal } from "antd";
import router from 'umi/router';

import {
  requestList,
  save,
  update,
  getById,
  deleteById
} from "@/services/unit/post";

import { refreshToken } from "@/services/login";

export default {
  namespace: "post",

  state: {
    data: {
      list: [],
      deptName: "",
      pagination: {}
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }
      const response = yield call(requestList, payload);

      if(response.code === -1) {
        Modal.error({
          content: response.message,
        });
        router.push("/exception/404");
        return;
      }
      yield put({
        type: "saveState",
        payload: response
      });
    },
    *getById({ payload }, { call, put }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }
      const response = yield call(getById, payload);
      yield put({
        type: "saveCurrentState",
        payload: response
      });
    },
    *deleteById({ payload }, { call }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }
      const { resolve } = payload;
      const response = yield call(deleteById, payload);
      if (response.code === 200) {
        message.success("删除成功");
        !!resolve && resolve(response);
      } else {
        message.error(response.message);
      }
    },
    *saveOrUpdate({ payload }, { call }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }
      const { resolve } = payload;
      if (!!payload.id) {
        payload.uuid = payload.id;
        const response = yield call(update, payload);
        if (response.code === 200) {
          message.success("修改成功");
          !!resolve && resolve(response);
        } else {
          message.error(response.message);
        }
      } else {
        const response = yield call(save, payload);
        if (response.code === 200) {
          message.success("保存成功");
          !!resolve && resolve(response);
        } else {
          message.error(response.message);
        }
      }
    }
  },

  reducers: {
    saveState(state, action) {
      return {
        ...state,
        data: action.payload.data,
        current: {},
        visible2: false
      };
    },
    hideModel(state) {
      return {
        ...state,
        visible2: false,
        current: {}
      };
    },
    saveCurrentState(state, action) {
      return {
        ...state,
        current: action.payload.data,
        visible2: true
      };
    }
  }
};
