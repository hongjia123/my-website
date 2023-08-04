<template>
  <NavBar />
  <KeepAlive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
  </KeepAlive>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
</template>
<script setup>
import { KeepAlive } from "vue";
import NavBar from "@components/nav";
</script>
