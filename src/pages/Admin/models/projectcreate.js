import { getCompanyOptions } from "@/services/unit/company";
import { save, update, getProBaseInfoById } from "@/services/unit/project";
import { getAreaLevelModels } from "@/services/area";
import { getByType } from "@/services/dictionary";
import { refreshToken } from "@/services/login";

export default {
    namespace: "projectcreate",

    state: {
        companys: [],
        areas: [],
        types: [],
        constructionnatures: [],
        mainstructuretypes: [],
        functions: [],
        current: {}
    },

    effects: {
        *saveOrUpdate({ payload }, { call }) {
            const checkResInfo = yield call(refreshToken);
            if (!checkResInfo) {
                return;
            }
            const { resolve, uuid } = payload;
            if(!!uuid) {
                const response = yield call(update, payload);
                !!resolve && resolve(response)
            } else {
                const response = yield call(save, payload);
                !!resolve && resolve(response)
            }
        },
        *initProject({ payload }, { call, put }) {
            const checkResInfo = yield call(refreshToken);
            if (!checkResInfo) {
                return;
            }
            const { resolve } = payload;
            const response = yield call(getProBaseInfoById, payload);
            if(response.code === 200) {
                yield put({
                    type: "saveProjectBaseInfo",
                    payload: response.data
                });
            }
            !!resolve && resolve(response)
        },
        *companyList({ payload }, { call, put }) {
            const checkResInfo = yield call(refreshToken);
            if (!checkResInfo) {
                return;
            }
            const response = yield call(getCompanyOptions, payload);
            yield put({
                type: "saveCompanyOptions",
                payload: response.data
            });
        },
        *dictionaryList({ payload }, { call, put }) {
            const response = yield call(getByType, payload);
            response.type = payload.type;
            yield put({
                type: "saveDictionaryOptions",
                payload: response
            });
        },
        *initArea(_, { call, put }) {
            const response = yield call(getAreaLevelModels);
            // console.info(responseD);
            // const response = yield call(getAreas, payload);

            // var areas = [];
            // for(let i of response.data){
            //     i.isLeaf = false;
            //     areas.push(i);
            // }
            yield put({
                type: "saveAreaLevel",
                payload: response.data
            });
        },
        // *areaLevel2({ payload }, { call, put }) {
        //     const checkResInfo = yield call(refreshToken);
        //     if (!checkResInfo) {
        //         return;
        //     }
        //     const { resolve } = payload;
        //     const response = yield call(getAreas, payload);

        //     var areas = [];
        //     for(let i of response.data){
        //         i.isLeaf = false;
        //         areas.push(i);
        //     }

        //     response.pcode = payload.pcode;
        //     response.data = areas;

        //     yield put({
        //         type: "saveAreaLevel2",
        //         payload: response
        //     });
        //     !!resolve && resolve(response)
        // },
        // *areaLevel3({ payload }, { call, put }) {
        //     const checkResInfo = yield call(refreshToken);
        //     if (!checkResInfo) {
        //         return;
        //     }
        //     const { resolve } = payload;
        //     const response = yield call(getAreas, payload);


        //     var areas = [];
        //     for(let i of response.data){
        //         i.isLeaf = true;
        //         areas.push(i);
        //     }

        //     response.pcode = payload.pcode;
        //     response.data = areas;
            
        //     yield put({
        //         type: "saveAreaLevel3",
        //         payload: response
        //     });
        //     !!resolve && resolve(response)
        // }
    },

    reducers: {
        saveCompanyOptions(state, action) {
            return {
                ...state,
                companys: action.payload,
            };
        },
        saveProjectBaseInfo(state, action) {
            return {
                ...state,
                current: action.payload,
            };
        },
        cleanCurrent(state) {
            return {
                ...state,
                current: {},
            };
        },
        showAreaNodeLoading(state, action) {
            let areas = state.areas;
            let currentNodeCode = action.payload.code;
            let size = areas.length;
            for(let i=0;i<size;i++) {
                if(areas[i].value === currentNodeCode) {
                    areas[i].loading = true;
                    break;
                }
                let children = areas[i].children;
                let csize = 0;
                if(!!children) {
                    csize = children.length;
                }
                for(let j=0;j<csize;j++) {
                    if(children[j].value === currentNodeCode) {
                        areas[i].children[j].loading = true;
                    }
                }
            }
            return {
                ...state,
                areas: areas
            };
        },
        // hideAreaNodeLoading(state, action) {
        //     let areas = state.areas;
        //     let size = areas.length;
        //     for(let i=0;i<size;i++) {
        //         if(areas[i].loading) {
        //             areas[i].loading = false;
        //             break;
        //         }
        //         let children = areas[i].children;
        //         let csize = 0;
        //         if(!!children) {
        //             csize = children.length;
        //         }
        //         for(let j=0;j<csize;j++) {
        //             if(children[j].loading) {
        //                 areas[i].children[j].loading = false;
        //             }
        //         }
        //     }
        //     return {
        //         ...state,
        //         areas: areas
        //     };
        // },
        saveAreaLevel(state, action) {
            return {
                ...state,
                areas: action.payload,
            };
        },
        // saveAreaLevel2(state, action) {
        //     let areas = state.areas;
        //     let currentPcode = action.payload.pcode;
        //     let size = areas.length;
        //     for(let i=0;i<size;i++) {
        //         if(areas[i].value === currentPcode) {
        //             areas[i].children = action.payload.data;
        //         }
        //     }
        //     return {
        //         ...state,
        //         areas: areas
        //     };
        // },
        // saveAreaLevel3(state, action) {
        //     let areas = state.areas;
        //     let currentPcode = action.payload.pcode;
        //     let size = areas.length;
        //     for(let i=0;i<size;i++) {
        //         let children = areas[i].children;
        //         let csize = 0;
        //         if(!!children) {
        //             csize = children.length;
        //         }
        //         for(let j=0;j<csize;j++) {
        //             if(children[j].value === currentPcode) {
        //                 areas[i].children[j].children = action.payload.data;
        //             }
        //         }
        //     }
        //     return {
        //         ...state,
        //         areas: areas
        //     };
        // },
        saveDictionaryOptions(state, action) {
            if(action.payload.type === "proType") {
                //工程类型
                return {
                    ...state,
                    types: action.payload.data,
                };
            }
            if(action.payload.type === "proConstructionNature") {
                //建设性质
                return {
                    ...state,
                    constructionnatures: action.payload.data,
                };
            }
            if(action.payload.type === "proMainStructureType") {
                //建设性质
                return {
                    ...state,
                    mainstructuretypes: action.payload.data,
                };
            }
            if(action.payload.type === "proFunction") {
                //建设性质
                return {
                    ...state,
                    functions: action.payload.data,
                };
            }
            return {
                ...state
            };
        }
    }
};
