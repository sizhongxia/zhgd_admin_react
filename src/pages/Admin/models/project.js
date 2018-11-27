import { requestList, save, update, deleteById, updateLocationMap, resetCgPwd } from "@/services/unit/project";
import { refreshToken } from "@/services/login";
import { message } from "antd";

export default {
    namespace: "project",

    state: {
        data: {
            list: [],
            pagination: {}
        },
        current: {},
        visible: false
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
                payload: response.data
            });
        },
        *saveOrUpdate({ payload }, { call, put }) {
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
                    yield put({
                        type: "hideModel"
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                const response = yield call(save, payload);
                if (response.code === 200) {
                    message.success("保存成功");
                    !!resolve && resolve(response);
                    yield put({
                        type: "hideModel"
                    });
                } else {
                    message.error(response.message);
                }
            }
        },
        *updateLocationMap({ payload }, { call, put }) {
            const checkResInfo = yield call(refreshToken);
            if (!checkResInfo) {
                return;
            }
            const { resolve } = payload;
            const response = yield call(updateLocationMap, payload);
            if(response.code === 200) {
                message.success("更新成功");
                !!resolve && resolve(response);
            } else {
                message.error(response.message)
            }
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
        },
    },

    reducers: {
        saveState(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
        showModel(state, action) {
            return {
                ...state,
                visible: true,
                current: action.payload
            };
        },
        hideModel(state) {
            return {
                ...state,
                visible: false,
                current: {}
            };
        }
    }
};
