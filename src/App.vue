<template>
  <div id="app">
    <!--TODO: Add loader here -->
    <main class="main">
      <router-view />
    </main>

    <notifications :ignoreDuplicates="true" :duration="5000" />
  </div>
</template>
