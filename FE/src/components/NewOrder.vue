<template>
  <v-dialog v-model="showDialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Nová objednávka</span>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="saveOrder">
          <v-select 
            v-model="selectedUser" 
            :items="userOptions" 
            item-text="title"
            item-value="value"
            :error-messages="userError"
            label="Zákazník" 
            required
          />

          <v-text-field 
            v-model="newOrder.itemName" 
            label="Položka objednávky" 
            :error-messages="itemNameError"
            required>
          </v-text-field>

          <!-- Dropdown for status order -->
          <v-select 
            v-model="selectedStatus" 
            :items="statusOptions" 
            item-text="title"
            item-value="value"
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
import { ref, defineEmits, onMounted } from 'vue';
import axios from 'axios';

// Prepare order data
const newOrder = ref({
  customerId: '',
  itemName: '',
  state: 'pending' // default value
});

// State of the new order
const selectedStatus = ref('pending');

// States for order
const statusOptions = [
  { title: 'Vyřizuje se', value: 'pending' },
  { title: 'Posláno', value: 'shipped' },
  { title: 'Doručeno', value: 'delivered' },
  { title: 'Zrušeno', value: 'canceled' }
];

// State of the new order
const selectedUser = ref('Vyberte meno');
// console.log('Selected user:', selectedUser.value);

// Get customer name based on customerId
const userOptions = ref([]);  // This should contain the list of users

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/users');
    userOptions.value = response.data.map(user => ({
      title: user.name,
      value: user.id
    }));

  } catch (error) {
    console.error('Error fetching users:', error);
  }
});

// Emit events
const emit = defineEmits(['close', 'save']);

const showDialog = ref(true);

// Error messages
const userError = ref('');
const itemNameError = ref('');

// Function to sanitize text inputs
const sanitizeInput = (input) => {
  const element = document.createElement('div');
  element.innerText = input;
  return element.innerHTML;
};

// Function for close dialog
const closeDialog = () => {
  emit('close');
};

// Function for saving order
const saveOrder = () => {
  // Reset error messages
  userError.value = '';
  itemNameError.value = '';

  // Validation: check if all required fields are filled
  let isValid = true;

  // Check if customerId is empty
 // Check if selectedUser is empty (if no customer is selected)
 if (!selectedUser.value || selectedUser.value === 'Vyberte meno') {
    userError.value = "Prosím, vyberte meno zákazníka.";
    isValid = false;
  }

  // Sanitize itemName input
  newOrder.value.itemName = sanitizeInput(newOrder.value.itemName);

  // Check if itemName is empty
  if (!newOrder.value.itemName) {
    itemNameError.value = "Prosím, zadajte položku objednávky.";
    isValid = false;
  }

  // If form is not valid, don't submit
  if (!isValid) {
    return;
  }

  const orderData = {
    customerId: selectedUser.value,
    state: selectedStatus.value,
    items: [
      {
        id: Math.floor(Math.random() * 100),  // Generating random id
        product: 'Sample Product',
        name: newOrder.value.itemName,
        price: 100
      }
    ]
  };
  // console.log('Order data:', orderData);

  emit('save', orderData);  // Emit order

  closeDialog();
};
</script>
