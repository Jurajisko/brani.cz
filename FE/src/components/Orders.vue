<template>
  <v-container>
    <Snackbar :snackbar="showSnack" @close="showSnack = false" />
    <Dialog :show="showDialog" @close="showDialog = false"></Dialog>

    <!-- Komponenta pre dialógové okno novej objednávky -->
    <NewOrder v-if="showNewOrderDialog" @close="closeDialog" @save="addOrder" />

    <v-data-table :headers="headers" :items="items" :items-per-page="5" class="elevation-1">

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Orders</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openDialog">Přidat</v-btn>
        </v-toolbar>
      </template>

      <template #item.action="{ item }">
        <v-btn size="x-small" @click="edit(item)">Upravit</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Dialog from './Dialog.vue';
import Snackbar from './Snackbar.vue';

import NewOrder from './NewOrder.vue';  // Import komponenty pre pridávanie objednávok


const store = useStore()
const showDialog = ref(false)
const showSnack = ref(false)

// Premenná pre otvorenie/zatvorenie dialógu pre novú objednávku
const showNewOrderDialog = ref(false)
// Otváranie dialógového okna
const openDialog = () => {
  showNewOrderDialog.value = true;
}

// Zatváranie dialógového okna
const closeDialog = () => {
  showNewOrderDialog.value = false;
}

// Define table headers
const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'items' },
  { text: 'Customer', value: 'customerId' },
  { text: 'State', value: 'state' },
  { text: 'Action', value: 'action', sortable: false },
];

// Random data for the table
const items = computed(() => store.getters['orders/getOrders'])

const edit = (order) => {
  showDialog.value = true;
}

const addOrder = (orderData) => {
  console.log('Prijaté údaje pre novú objednávku:', orderData);
  
  store.dispatch('orders/createOrder', orderData)
    .then(() => {
      store.dispatch('orders/fetchOrders');
      showSnack.value = true;
    })
    .catch((error) => {
      console.error('Error creating order:', error);
    });

  closeDialog();
};


const createOrder = () => {
  // Simulácia vytvorenia novej objednávky
  const newOrder = {
    id: Math.floor(Math.random() * 1000),
    items: [{ id: 106, product: 'New Product', name: 'Sample Product', price: 100 }],
    customerId: 3,
    state: 'pending',
  };
  
  store.dispatch('orders/createOrder', newOrder);
}


</script>

<style scoped>
.v-data-table {
  max-width: 800px;
  margin: 0 auto;
}
</style>
