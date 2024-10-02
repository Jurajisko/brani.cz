<template>
  <v-dialog v-model="shouldBeVisible" persistent :overlay="false" max-width="500px" transition="dialog-transition">
    <v-card>
      <v-card-title>
        <span>Upravit objednávku</span>
      </v-card-title>
      <v-card-text>
        <v-select label="Status" :items="states" v-model="editedOrderState"></v-select>
      </v-card-text>
      <v-card-actions class="mx-1">
        <v-spacer></v-spacer>
        <v-btn @click="emit('close')">Zavřít</v-btn>
        <v-btn color="success" variant="tonal" @click="saveChanges">Upravit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  order: Object
})

const states = [
  { title: 'Vyřizuje se', value: 'pending' },
  { title: 'Posláno', value: 'shipped' },
  { title: 'Doručeno', value: 'delivered' },
  { title: 'Zrušeno', value: 'canceled' }
];

const emit = defineEmits(['close', 'save']);

const shouldBeVisible = computed({
  get() { return props.show },
  set() { emit('close') },
})

const orderExists = computed(() => props.order && props.order.state);

// Initialize the order state based on the current order's state
const editedOrderState = ref(props.order ? props.order.state : 'pending');

watch(() => props.order, (newOrder) => {
  if (newOrder && newOrder.state) {
    editedOrderState.value = newOrder.state;  // Rebind when new order is passed in props
  }
}, { immediate: true });

const saveChanges = () => {
  if (orderExists.value) {
    emit('save', { ...props.order, state: editedOrderState.value });
    emit('close');
  }
}

</script>
