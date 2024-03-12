<template>
  <main>
    <VLayout>
      <v-app-bar>
        <template v-slot:prepend>
          <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
        </template>
        <v-app-bar-title class="text-primary">
          <p class="text-subtitle-1">Timsheet</p>
          <p class="text-subtitle-2">Management</p>
        </v-app-bar-title>
      </v-app-bar>
      <v-main
        class="align-center justify-center bg-primary h-screen bg-main-page"
      >
        <slot />
      </v-main>
    </VLayout>
  </main>
</template>
<script setup></script>
