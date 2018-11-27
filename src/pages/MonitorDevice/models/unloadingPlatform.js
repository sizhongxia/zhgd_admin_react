import { deviceList, getReceiptByUuid, resetReceiptByUuid } from "@/services/device/device";
import { saveDustNoise, updateDustNoise, getDeviceBaseInfoById, deleteById } from "@/services/device/unloadingPlatform";
import { refreshToken } from "@/services/login";
import { getCompanyOptions } from "@/services/unit/company";
import { getProjectOptions } from "@/services/unit/project";

import { message } from "antd";

export default {
  namespace: "unloadingPlatform",
  
  state: {
    data: {
      list: [],
      pagination: {}
    },
    projects: [],
    supplierCompanys: [],
    agentCompanys: [],
    current: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }
      const response = yield call(deviceList, payload);
      if (response.code !== 200) {
        message.error(response.message);
        response.data = {
          list: [],
          pagination: {
            total: 0
          }
        }
      }
      yield put({
        type: "saveState",
        payload: response.data
      });
    },
    *saveOrUpdate({ payload }, { call }) {
        const checkResInfo = yield call(refreshToken);
        if (!checkResInfo) {
            return;
        }
        const { resolve, uuid } = payload;
        if(!!uuid) {
            const response = yield call(updateDustNoise, payload);
            !!resolve && resolve(response)
        } else {
            const response = yield call(saveDustNoise, payload);
            !!resolve && resolve(response)
        }
    },
    *initDevice({ payload }, { call, put }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }
      const { resolve } = payload;
      const response = yield call(getDeviceBaseInfoById, payload);
      if (response.code === 200) {
        yield put({
          type: "saveDeviceBaseInfo",
          payload: response.data
        });
      }
      !!resolve && resolve(response)
    },
    *getReceiptByUuid({ payload }, { call }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }
      const { resolve } = payload;
      const response = yield call(getReceiptByUuid, payload);
      !!resolve && resolve(response)
    },
    *resetReceiptByUuid({ payload }, { call }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }
      const { resolve } = payload;
      const response = yield call(resetReceiptByUuid, payload);
      !!resolve && resolve(response)
    },
    *initCompanyList(_, { call, put }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }

      // 8:设备供应商
      const response1 = yield call(getCompanyOptions, { type: 8 });
      // 9:设备代理商
      const response2 = yield call(getCompanyOptions, { type: 9 });

      var compantData = {
        supplierCompanys: [],
        agentCompanys: []
      };
      if (response1.code === 200) {
        compantData.supplierCompanys = response1.data;
      }
      if (response2.code === 200) {
        compantData.agentCompanys = response2.data;
      }
      yield put({
        type: "saveCompanyOptions",
        payload: compantData
      });
    },
    *initProjectList(_, { call, put }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }

      const response = yield call(getProjectOptions, { type: 8 });

      var projectData = {
        projects: [],
      };
      if (response.code === 200) {
        projectData.projects = response.data;
      }
      yield put({
        type: "saveProjectOptions",
        payload: projectData
      });
    },
    *remove({ payload }, { call, put }) {
        const checkResInfo = yield call(refreshToken);
        if (!checkResInfo) {
            return;
        }
        const { resolve } = payload;
        if (!!payload.id) {
            payload.uuid = payload.id;
            const response = yield call(deleteById, payload);
            if (response.code === 200) {
                message.success("删除成功");
                !!resolve && resolve(response);
            } else {
                message.error(response.message);
            }
        } else {
            message.error("未选择数据");
        }
    }
  },
  reducers: {
    saveState(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    saveCompanyOptions(state, action) {
      return {
        ...state,
        supplierCompanys: action.payload.supplierCompanys,
        agentCompanys: action.payload.agentCompanys
      };
    },
    saveProjectOptions(state, action) {
      return {
        ...state,
        projects: action.payload.projects
      };
    },
    saveDeviceBaseInfo(state, action) {
      return {
        ...state,
        current: action.payload
      };
    },
    cleanCurrent(state) {
      return {
          ...state,
          current: {},
      };
    },

  }
};
