<template>
  <v-container>
    <Snackbar :snackbar="showSnack" @close="showSnack = false" />
    
    <!-- Dialog for editing order -->
    <Dialog :show="showDialog" :order="editedOrder" @close="closeDialog" @save="updateOrder" />

    <!-- NewOrder dialog Component -->
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

import NewOrder from './NewOrder.vue';  // Import new component

const store = useStore();
const showDialog = ref(false);
const showSnack = ref(false);
const editedOrder = ref(null); // Object for currently edited order

// Variable to open/close new order dialog
const showNewOrderDialog = ref(false);

// Open new order dialog
const openDialog = () => {
  showNewOrderDialog.value = true;
};

// Close new order dialog
const closeDialog = () => {
  showNewOrderDialog.value = false;
  showDialog.value = false;
};

// Define table headers
const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'items' },
  { text: 'Customer', value: 'customerId' },
  { text: 'State', value: 'state' },
  { text: 'Action', value: 'action', sortable: false },
];

// Random data for the table
const items = computed(() => store.getters['orders/getOrders']);

// Edit order
const edit = (order) => {
  editedOrder.value = order; // Set order to be edited
  showDialog.value = true;
};

// Save new order
const addOrder = (orderData) => {  
  store.dispatch('orders/createOrder', orderData) // Send new order to backend Vuex
    .then(() => {
      console.log('Order created:', orderData);
      store.dispatch('orders/fetchOrders'); // Actualization list order of table
      showSnack.value = true; // Show success saved
    })
    .catch((error) => {
      console.error('Error creating order:', error);
    });

  closeDialog(); // close dialog
};

// Update order with new state
const updateOrder = (updatedOrder) => {
  store.dispatch('orders/updateOrder', updatedOrder) // Dispatch to Vuex for backend update
    .then(() => {
      store.dispatch('orders/fetchOrders'); // Refresh orders list
      closeDialog();  // Close dialog after save
      showSnack.value = true; // Show snack-bar for confirmation
    })
    .catch((error) => {
      console.error('Error updating order:', error);
    });
};
</script>

<style scoped>
.v-data-table {
  max-width: 800px;
  margin: 0 auto;
}
</style>
