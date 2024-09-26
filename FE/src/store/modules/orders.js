import axios from 'axios';

const state = {
  sampleData: [],
};

const getters = {
  getOrders: (state) => state.sampleData,
};

const actions = {
  fetchOrders({ commit }) {
    axios.get('http://localhost:3001/api/orders').then(res => {
      commit('SET_ORDERS', res.data)
    })
  },
};

const mutations = {
  SET_ORDERS: (state, data) => state.sampleData = data,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
