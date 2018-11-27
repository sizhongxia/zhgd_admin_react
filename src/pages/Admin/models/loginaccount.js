import { requestList, save, update, changeState, resetpwd } from "@/services/loginaccount";
import { refreshToken } from "@/services/login";
import { Modal, message } from "antd";

export default {
    namespace: "loginaccount",

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
        *changeState({ payload }, { call }) {
            const checkResInfo = yield call(refreshToken);
            if (!checkResInfo) {
                return;
            }
            const { resolve } = payload;
            if (!!payload.id) {
                payload.uuid = payload.id;
                const response = yield call(changeState, payload);
                if (response.code === 200) {
                    message.success("更新成功");
                    !!resolve && resolve(response);
                } else {
                    message.error(response.message);
                }
            } else {
                message.error("未选择数据");
            }
        },
        *resetpwd({ payload }, { call }) {
            const checkResInfo = yield call(refreshToken);
            if (!checkResInfo) {
                return;
            }
            if (!!payload.id) {
                payload.uuid = payload.id;
                const response = yield call(resetpwd, payload);
                if (response.code === 200) {
                    Modal.info({
                        title: "重置密码成功",
                        content: "新密码为 " + response.data + " 请牢记。"
                    })
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
