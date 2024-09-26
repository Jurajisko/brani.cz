import orders from './modules/orders';

import { createStore } from 'vuex'

const store = createStore()
store.registerModule('orders', orders)

export default store;