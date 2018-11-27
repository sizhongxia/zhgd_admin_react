
import { message } from "antd";

import {
  requestList,
  save,
  update,
  getById,
  getAllTypes,
  deleteById
} from "@/services/dictionary";

import { refreshToken } from "@/services/login";

export default {
  namespace: "dictionary",

  state: {
    data: {
      list: [],
      pagination: {}
    },
    types: []
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }
      const response = yield call(requestList, payload); 
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
    *getAllTypes({ payload }, { call, put }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }
      const response = yield call(getAllTypes, payload);
      yield put({
        type: "saveAllType",
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
          !! resolve  && resolve(response);
        } else {
          message.error(response.message);
        }
      } else {
        const response = yield call(save, payload);
        if (response.code === 200) {
          message.success("保存成功");
          !! resolve  && resolve(response);
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
    },
    saveAllType(state, action) {
        return {
          ...state,
          types: action.payload.data
        };
      },
  }
};
