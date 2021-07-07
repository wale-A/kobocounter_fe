<template>
  <router-view />
  <notifications :ignoreDuplicates="true" :duration="5000" />
</template>
