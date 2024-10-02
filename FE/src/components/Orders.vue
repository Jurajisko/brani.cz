<template>
  <v-container>
    <Snackbar :snackbar="showSnack" @close="showSnack = false" />
    <Dialog :show="showDialog" @close="showDialog = false"></Dialog>

    <!-- New component for new order -->
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

// Import NewOrder component
import NewOrder from './NewOrder.vue';

const store = useStore()
const showDialog = ref(false)
const showSnack = ref(false)

// Constant for opening/closing new order dialog
const showNewOrderDialog = ref(false)

// Opening dialog window
const openDialog = () => {
  showNewOrderDialog.value = true;
}

// Close dialog window
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

// save new order (in Orders.vue)
const addOrder = (orderData) => {  
  store.dispatch('orders/createOrder', orderData)
    .then(() => {
      store.dispatch('orders/fetchOrders');
      showSnack.value = true;
    })
    .catch((error) => {
      console.error('Error creating order:', error);
    });

  closeDialog();  // Close dialog
};


// Save updated order
const updateOrder = (updatedOrder) => {
  // console.log('Uložená objednávka:', updatedOrder);

  store.dispatch('orders/updateOrder', updatedOrder)
    .then(() => {
      closeDialog();  // Close dialog
    })
    .catch((error) => {
      console.error('Chyba pri aktualizácii objednávky:', error);
    });
};


</script>

<style scoped>
.v-data-table {
  max-width: 800px;
  margin: 0 auto;
}
</style>
