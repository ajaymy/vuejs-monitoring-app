<template>
  <v-container fill-height fluid style="flex-wrap: wrap;">
    <v-layout justify-center wrap>
      <div>
        <v-btn color="warning" @click="executeScript()"> Execute Script</v-btn>
      </div>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      hostURL: process.env.VUE_APP_HOSTURL
    };
  },
  mounted: function() {
    console.log('TCL: mounted');
    //console.log('URL:', this.hostURL);
  },
  methods: {
    executeScript() {}
  }
};
</script>
