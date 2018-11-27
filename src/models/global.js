import { queryAreas } from '@/services/geographic';
import { check } from '@/services/sys';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    areas: []
  },

  effects: {
    *fetchAreas(_, { call, put }) {
      const response = yield call(queryAreas);
      yield put({
        type: 'saveAreas',
        payload: response,
      });
    },
    *check(_, { call, put }) {
      yield call(check);
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveAreas(state, action) {
      return {
        ...state,
        areas: action.payload || {},
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
