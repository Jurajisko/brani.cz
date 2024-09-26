<template>
  <v-dialog v-model="shouldBeVisible" persistent :overlay="false" max-width="500px" transition="dialog-transition">
    <v-card>
      <v-card-title>
        <span>Upravit objednávku</span>
      </v-card-title>
      <v-card-text>
        <v-select label="Status" :items="states"></v-select>
      </v-card-text>
      <v-card-actions class="mx-1">
        <v-spacer></v-spacer>
        <v-btn @click="emit('close')">Zavřít</v-btn>
        <v-btn color="success" variant="tonal">Upravit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  show: Boolean
})

const states = [
  { title: 'Vyřizuje se', value: 'pending' },
  { title: 'Posláno', value: 'shipped' },
  { title: 'Doručeno', value: 'delivered' },
  { title: 'Zrušeno', value: 'canceled' }
];


const emit = defineEmits(['close'])

const shouldBeVisible = computed({
  get() { return props.show },
  set() { emit('close') },
})

</script>

<style lang="scss" scoped></style>