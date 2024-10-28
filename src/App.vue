<template>
  <div class="app-container">
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
</script>

<style>
.app-container {
  display: flex;
  font-family: Arial, sans-serif;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
