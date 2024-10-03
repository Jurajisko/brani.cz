<template>
  <v-container>
    <Snackbar :snackbar="showSnack" :data="snackData" @close="showSnack = false" />
    
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

      <!-- Multi-line rendering of items in the table -->
      <template v-slot:item.items="{ item }">
        <div v-for="(product, index) in item.items" :key="index">
          {{ product.name }} {{ product.price }} Kč
        </div>
        <!-- <div v-for="(product, index) in item.items" :key="index">
          {{ product.customerId }}
        </div> -->
      </template>

      <!-- Render customer name instead of ID -->
      <template v-slot:item.customerId="{ item }">
        <div>
          {{ getCustomerName(item.customerId) }}  <!-- Fetch and display the customer's name -->
        </div>
      </template>

      <!-- Action button -->
      <template #item.action="{ item }">
        <v-btn size="x-small" @click="edit(item)">Upravit</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

import Dialog from './Dialog.vue';
import Snackbar from './Snackbar.vue';
import NewOrder from './NewOrder.vue';  // Import new component

const store = useStore();
const showDialog = ref(false);
const editedOrder = ref(null); // Object for currently edited order



// Flash messages component
const showSnack = ref(false);

// Snackbar data object
const snackData = ref({
  text: '',
  color: 'success',
});

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
  { text: 'Položky', value: 'items' },
  { text: 'Zákazník', value: 'customerId' },
  { text: 'Stav', value: 'state' },
  { text: 'Akcia', value: 'action', sortable: false },
];

// Fetch data for the table from the store
const items = computed(() => store.getters['orders/getOrders']);

// Get customer name based on customerId
const userOptions = ref([]);  // This should contain the list of users
// Zoznam používateľov
const users = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/users');
    userOptions.value = response.data.map(user => ({
      name: user.name,
      id: user.id
    }));

    users.value = response.data;

  } catch (error) {
    console.error('Error fetching users:', error);
  }
});

// Helper function to map customerId to the customer's name
const getCustomerName = (customerId) => {
  const user = userOptions.value.find(user => user.id === customerId);
  return user ? user.name : 'Unknown User';
};

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
      snackData.value = { text: 'Objednávka bola úspešne uložená!', color: 'success' }; // Set Snackbar message
      showSnack.value = true; // Show success saved
    })
    .catch((error) => {
      console.error('Error creating order:', error);
      snackData.value = { text: 'Nepodarilo sa uložiť objednávku', color: 'error' }; // Set error message
      showSnack.value = true; // Show error
    });

  closeDialog(); // close dialog
};

// Update order
const updateOrder = (updatedOrder) => {
  store.dispatch('orders/updateOrder', updatedOrder) // Dispatch update to backend
  .then(() => {
      store.dispatch('orders/fetchOrders'); // Refresh orders list
      closeDialog();  // Close dialog after save
      snackData.value = { text: 'Objednávka bola úspešne aktualizovaná!', color: 'success' }; // Set success message
      showSnack.value = true; // Show snack-bar for confirmation
    })
    .catch((error) => {
      console.error('Error updating order:', error);
      snackData.value = { text: 'Nepodarilo sa aktualizovať objednávku', color: 'error' }; // Set error message
      showSnack.value = true; // Show error
    });
};
</script>

<style scoped>
  .v-data-table {
    max-width: 800px;
    margin: 0 auto;
  }
  th.v-data-table-header {
    visibility: visible !important;
    color: white;  /* or any other color */
  }

</style>
