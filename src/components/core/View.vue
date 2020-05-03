<template>
  <v-content>
    <div id="core-view">
      <v-fade-transition mode="out-in">
        <keep-alive>
          <router-view />
        </keep-alive>
      </v-fade-transition>
    </div>
    <!-- <core-footer v-if="$route.name !== 'Maps'" /> -->
  </v-content>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: 'Production Monitoring System'
    };
  }
};
</script>

<style>
#core-view {
  padding-bottom: 100px;
}
</style>
