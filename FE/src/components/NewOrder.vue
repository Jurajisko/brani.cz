<template>
  <v-dialog v-model="showDialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Nová objednávka</span>
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field v-model="newOrder.customerId" label="ID zákazníka" required></v-text-field>
          <v-text-field v-model="newOrder.itemName" label="Položka objednávky" required></v-text-field>
          
          <!-- Dropdown pre stav objednávky -->
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
import axios from 'axios';

// Pripravené údaje pre novú objednávku
const newOrder = ref({
  customerId: '',
  itemName: '',
  state: 'pending' // Přednastavený stav objednávky
});

// Status objednávky (ak ho chceš ukladať samostatne)
const selectedStatus = ref('pending');

// Možnosti pre stav objednávky
const statusOptions = [
  { name: 'Vyřizuje se', value: 'pending' },
  { name: 'Posláno', value: 'shipped' },
  { name: 'Doručeno', value: 'delivered' },
  { name: 'Zrušeno', value: 'canceled' }
];


// Emitovanie udalostí pre zatvorenie a uloženie objednávky
const emit = defineEmits(['close', 'save']);

const showDialog = ref(true);

// Funkcia na zatvorenie dialógu
const closeDialog = () => {
  emit('close');
}

const isSubmitting = ref(false);

const saveOrder = () => {
  console.log('Ukladám objednávku'); // Kontrola spustenia

  if (isSubmitting.value) return;  // Zabráni ďalšiemu volaniu, ak sa práve odosiela

  isSubmitting.value = true;

  const orderData = {
    customerId: newOrder.value.customerId,  // ID zákazníka
    state: selectedStatus.value,            // Stav objednávky
    items: [
      {
        id: Math.floor(Math.random() * 1000), // Generované ID pre položku
        product: 'Sample Product',            // Názov produktu (môže byť dynamický)
        name: newOrder.value.itemName,        // Názov položky z formulára
        price: 100                            // Cena položky (môže byť dynamická)
      }
    ]
  };
  
  axios.post('http://localhost:3001/api/orders', orderData)
    .then(response => {
      console.log('Nová objednávka uložená:', response.data);
      emit('save', response.data);  // Emit uložené objednávky
      closeDialog();                // Zatvorenie dialógu
    })
    .catch(error => {
      console.error('Chyba pri ukladaní objednávky:', error);
    })
    .finally(() => {
      isSubmitting.value = false;  // Resetovanie po odoslaní
    });
};




</script>
