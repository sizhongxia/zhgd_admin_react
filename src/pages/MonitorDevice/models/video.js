import { deviceList, getProjectDeviceOptions } from "@/services/device/device";
import { saveVideo, updateVideo, getDeviceBaseInfoById, deleteById } from "@/services/device/video";
import { refreshToken } from "@/services/login";
import { getProjectOptions } from "@/services/unit/project";

import { message } from "antd";

export default {
  namespace: "video",

  state: {
    data: {
      list: [],
      pagination: {}
    },
    projects: [],
    towercranes: [],
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
            const response = yield call(updateVideo, payload);
            !!resolve && resolve(response)
        } else {
            const response = yield call(saveVideo, payload);
            !!resolve && resolve(response)
        }
    },
    *getProjectTowercranes({ payload }, { call, put }) {
      const checkResInfo = yield call(refreshToken);
      if (!checkResInfo) {
        return;
      }
      const { resolve } = payload;
      const response = yield call(getProjectDeviceOptions, {...payload, deviceType: 1});
      yield put({
        type: "saveProjectTowercranes",
        payload: response.data
      });
      !!resolve && resolve(response)
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
    saveProjectOptions(state, action) {
      return {
        ...state,
        projects: action.payload.projects
      };
    },
    saveProjectTowercranes(state, action) {
      return {
        ...state,
        towercranes: action.payload
      };
    },
    cleanProjectTowercranes(state) {
      return {
        ...state,
        towercranes: []
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
    }
  }
};
