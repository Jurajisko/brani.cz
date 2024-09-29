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

  createOrder({ commit }, order) {
    axios.post('http://localhost:3001/api/orders', order).then(res => {
      commit('ADD_ORDER', res.data);
    });
  }
  
};

const mutations = {
  SET_ORDERS: (state, data) => state.sampleData = data,
  ADD_ORDER: (state, newOrder) => state.sampleData.push(newOrder),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
