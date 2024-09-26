<template>
  <v-container>
    <Snackbar :snackbar="showSnack" @close="showSnack = false" />
    <Dialog :show="showDialog" @close="showDialog = false"></Dialog>

    <v-data-table :headers="headers" :items="items" :items-per-page="5" class="elevation-1">

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Orders</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary">Přidat</v-btn>
        </v-toolbar>
      </template>

      <template #item.action="{ item }">
        <v-btn size="x-small" @click="edit()">Upravit</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Dialog from './Dialog.vue';
import Snackbar from './Snackbar.vue';

const store = useStore()
const showDialog = ref(false)
const showSnack = ref(false)

// Define table headers
const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'items' },
  { text: 'Customer', value: 'customerId' },
  { text: 'State', value: 'state' },
  { text: '', value: 'action' },
];

const states = {
  pending: 'Vyřizuje se',
  shipped: 'Posláno',
  delivered: 'Doručeno',
  canceled: 'Zrušeno',
}

// Random data for the table
const items = computed(() => store.getters['orders/getOrders'])

const edit = () => {
  showDialog.value = true;
}

</script>

<style scoped>
.v-data-table {
  max-width: 800px;
  margin: 0 auto;
}
</style>
