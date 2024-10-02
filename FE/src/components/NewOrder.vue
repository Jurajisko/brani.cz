<template>
  <v-dialog v-model="showDialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Nová objednávka</span>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="saveOrder">
          <v-text-field 
            v-model="newOrder.customerId" 
            label="ID zákazníka" 
            :error-messages="customerIdError"
            required>
          </v-text-field>
          <v-text-field 
            v-model="newOrder.itemName" 
            label="Položka objednávky" 
            :error-messages="itemNameError"
            required>
          </v-text-field>

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

// Prepare order data
const newOrder = ref({
  customerId: '',
  itemName: '',
  state: 'pending' // default value
});

// State of the new order
const selectedStatus = ref('Vyřizuje se');

// States for order
const statusOptions = [
  { name: 'Vyřizuje se', value: 'pending' },
  { name: 'Posláno', value: 'shipped' },
  { name: 'Doručeno', value: 'delivered' },
  { name: 'Zrušeno', value: 'canceled' }
];

// Emit events
const emit = defineEmits(['close', 'save']);

const showDialog = ref(true);

// Error messages
const customerIdError = ref('');
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
  customerIdError.value = '';
  itemNameError.value = '';

  // Validation: check if all required fields are filled
  let isValid = true;

  // Check if customerId is empty
  if (!newOrder.value.customerId) {
    customerIdError.value = "Prosím, zadajte ID zákazníka.";
    isValid = false;
  }
  // Check if customerId contains only numbers
  else if (!/^\d+$/.test(newOrder.value.customerId)) {
    customerIdError.value = "ID zákazníka môže obsahovať iba čísla.";
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
    customerId: newOrder.value.customerId,
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

  emit('save', orderData);  // Emit order

  closeDialog();
};
</script>
