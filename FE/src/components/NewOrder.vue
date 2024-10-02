<template>
  <v-dialog v-model="showDialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Nová objednávka</span>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="saveOrder">
          <v-text-field v-model="newOrder.customerId" label="ID zákazníka" required></v-text-field>
          <v-text-field v-model="newOrder.itemName" label="Položka objednávky" required></v-text-field>
          
          <!-- Dropdown for status order -->
          <v-select 
            v-model="selectedStatus" 
            :items="statusOptions.map(status => status.name)" 
            label="Stav objednávky" 
            required
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Zrušiť</v-btn>
        <v-btn color="blue darken-1" text @click="saveOrder">Uložiť</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { useStore } from 'vuex';

// Prepare data for new order
const newOrder = ref({
  customerId: '',
  itemName: '',
  state: 'Vyřizuje se' // Default state
});

// State for selected status
const selectedStatus = ref('pending');

// Setting up status options
const statusOptions = [
  { name: 'Vyřizuje se', value: 'pending' },
  { name: 'Posláno', value: 'shipped' },
  { name: 'Doručeno', value: 'delivered' },
  { name: 'Zrušeno', value: 'canceled' }
];


// Emit events
const emit = defineEmits(['close', 'save']);

const showDialog = ref(true);

const store = useStore(); // Initialize VueX store

// Function to close dialog
const closeDialog = () => {
  emit('close');
}

const saveOrder = () => {
  // console.log('Saved order:', newOrder.value);

  const orderData = {
    customerId: newOrder.value.customerId,
    state: selectedStatus.value,
    items: [
      {
        id: Math.floor(Math.random() * 100),
        product: 'Sample Product',
        name: newOrder.value.itemName,
        price: 100
      }
    ]
  };

  // console.log(orderData);

  store.dispatch('orders/createOrder', orderData)
    .then(response => {
      console.log('Nová objednávka uložená:', response);
      emit('save', response);  // Emit for save event
      closeDialog();           // Close dialog
    })
    .catch(error => {
      console.error('Chyba pri ukladaní objednávky:', error.response ? error.response.data : error.message);
    })
};




</script>
