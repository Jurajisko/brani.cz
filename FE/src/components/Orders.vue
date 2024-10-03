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
  
      <!-- Render rows with dynamic classes based on the order state -->
    <template v-slot:item="{ item }">
      <tr :class="getClassForState(item.state)">
        <td>{{ item.id }}</td>
        <td>
          <div v-for="(product, index) in item.items" :key="index">
            {{ product.name }} {{ product.price }} Kč
          </div>
        </td>
        <td>{{ getCustomerName(item.customerId) }}</td>
        <td>{{ item.state }}</td>
        <td><v-btn size="x-small" @click="edit(item)">Upravit</v-btn></td>
      </tr>
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

// Method to get class for state
const getClassForState = (state) => {
  switch(state) {
    case 'pending':
      return 'order-pending';
    case 'shipped':
      return 'order-shipped';
    case 'delivered':
      return 'order-delivered';
    case 'canceled':
      return 'order-canceled';
    default:
      return '';
  }
};

// Fetch data for the table from the store
const items = computed(() => store.getters['orders/getOrders']);

// Get customer data from API users
const userOptions = ref([]);  // This should contain the list of users
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/users');
    userOptions.value = response.data.map(user => ({
      name: user.name,
      id: user.id
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
});

// Helper function to get customer name
const getCustomerName = (customerId) => {
  const user = userOptions.value.find(user => user.id === customerId);
  // console.log('User:', user);
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
      // console.log('Order created:', orderData);
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

  .v-data-table >>> .order-pending {
    background-color: rgba(255, 255, 0, 0.1); /* Yellow for pending */
  }
  .v-data-table >>> .order-pending:hover {
    background-color: rgba(255, 255, 0, 0.15);
  }

  .v-data-table >>> .order-shipped {
    background-color: rgba(0, 0, 255, 0.1); /* Blue for shipped */
  }
  .v-data-table >>> .order-shipped:hover {
    background-color: rgba(0, 0, 255, 0.15);
  }

  .v-data-table >>> .order-delivered {
    background-color: rgba(0, 255, 0, 0.1); /* Green for delivered */
  }
  .v-data-table >>> .order-delivered:hover {
    background-color: rgba(0, 255, 0, 0.15);
  }

  .v-data-table >>> .order-canceled {
    background-color: rgba(255, 0, 0, 0.1); /* Red for canceled */
  }
  .v-data-table >>> .order-canceled:hover {
    background-color: rgba(255, 0, 0, 0.15);
  }


  /* Moble view */
  @media (max-width: 600px) {
    .v-data-table >>> thead,
    .v-data-table >>> tbody {
      display: block;
      width: calc(100vw - 32px);
    }
    .v-data-table tbody tr {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }

    .v-data-table tbody tr td:nth-child(1) {
      width: 10%;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .v-data-table tbody tr td:nth-child(2) {
      width: 90%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }

    .v-data-table tbody tr td:nth-child(3) {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: calc(10% + 16px);
    }

    .v-data-table tbody tr td:nth-child(4) {
      width: 25%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .v-data-table tbody tr td:nth-child(5) {
      width: 25%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
}
</style>