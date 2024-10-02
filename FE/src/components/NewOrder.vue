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

// Prepare order data
const newOrder = ref({
  customerId: '',
  itemName: '',
  state: 'pending' // defualut value
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

// Function for close dialog
const closeDialog = () => {
  emit('close');
}

// Function for saving order
const saveOrder = () => {
  // Validation: check if all required fields are filled
  if (!newOrder.value.customerId) {
    alert("Prosím, zadajte ID zákazníka.");
    return;
  }

  if (!newOrder.value.itemName) {
    alert("Prosím, zadajte položku objednávky.");
    return;
  }

  const orderData = {
    customerId: newOrder.value.customerId,
    state: selectedStatus.value,
    items: [
      {
        id: Math.floor(Math.random() * 100),  // Genarating random id
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
