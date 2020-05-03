<template>
  <v-container fill-height fluid grid-list-xl>
    <v-flex md12>
      <material-card class="card-tabs" color="#41484d">
        <v-flex slot="header">
          <v-tabs v-model="tabs" color="transparent" slider-color="white">
            <span class="subheading font-weight-light mr-3" style="align-self: center">Architecture:</span>
            <v-tab class="mr-3">
              <v-icon class="mr-2">mdi-bug</v-icon>Overview
            </v-tab>
            <v-tab class="mr-3">
              <v-icon class="mr-2">mdi-code-tags</v-icon>Technologies
            </v-tab>
            <v-tab>
              <v-icon class="mr-2">mdi-cloud</v-icon>Hosting
            </v-tab>
          </v-tabs>
        </v-flex>

        <v-tabs-items v-model="tabs">
          <v-tab-item>
            <v-container fill-height fluid grid-list-xl>
              <v-layout row justify-center>
                <v-flex md6>
                  <v-img src="arch_510X300.png" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container fluid grid-list-xl>
              <v-layout row justify-center>
                <v-flex xs2 mx-1>
                  <v-card>
                    <v-toolbar color="pink" dark>
                      <v-toolbar-title class="white--text">Node JS</v-toolbar-title>
                    </v-toolbar>
                    <v-img src="nodejs.png" aspect-ratio="2.75"></v-img>
                    <v-card-title primary-title>
                      <div>
                        <div>provide RESTful APIs</div>
                      </div>
                    </v-card-title>
                  </v-card>
                </v-flex>
                <v-flex xs2 mx-1>
                  <v-card>
                    <v-toolbar color="pink" dark>
                      <v-toolbar-title class="white--text">SQLite</v-toolbar-title>
                    </v-toolbar>
                    <v-img src="sqlite.png" aspect-ratio="2.75"></v-img>
                    <v-card-title primary-title>
                      <div>
                        <div>stand-alone RDBMS</div>
                      </div>
                    </v-card-title>
                  </v-card>
                </v-flex>
                <v-flex xs2 mx-1>
                  <v-card>
                    <v-toolbar color="pink" dark>
                      <v-toolbar-title class="white--text">Vue + Vuetify</v-toolbar-title>
                    </v-toolbar>
                    <v-img src="vue-vuetify.png" aspect-ratio="2.75"></v-img>
                    <v-card-title primary-title>
                      <div>
                        <div>Framework to create the UI</div>
                      </div>
                    </v-card-title>
                  </v-card>
                </v-flex>
                <v-flex xs2 mx-1>
                  <v-card>
                    <v-toolbar color="pink" dark>
                      <v-toolbar-title class="white--text">Python 3.7.4</v-toolbar-title>
                    </v-toolbar>
                    <v-img src="python.png" aspect-ratio="2.75"></v-img>
                    <v-card-title primary-title>
                      <div>
                        <div>script to simulate data</div>
                      </div>
                    </v-card-title>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container fill-height fluid grid-list-xl>
              <v-layout row justify-center>
                <v-flex md6>
                  <v-card>
                    <v-toolbar color="pink" dark>
                      <v-toolbar-title class="white--text">How this site has been hosted</v-toolbar-title>
                    </v-toolbar>
                    <v-list>
                      <v-list-tile v-for="item in listItems" :key="item.ID">
                        <v-list-tile-content>
                          <v-list-tile-title>{{item.ID}}. {{item.Desc}}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </material-card>
    </v-flex>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      url: process.env.VUE_APP_HOSTURL,
      listItems: [
        {
          ID: "1",
          Desc: "A personal Raspberry Pi3 board has been used to host this site"
        },
        {
          ID: "2",
          Desc:
            "Vue.js/Vuetify is used to create the front-end. Nodejs along with Expressjs used for back-end and RESTful APIs"
        },
        {
          ID: "3",
          Desc: "SQLite for back-end data storage"
        },
        {
          ID: "4",
          Desc:
            "Python 3.7.4 script used to simulate the data and store in SQLite"
        },
        {
          ID: "5",
          Desc:
            "Since the PI3 is available on my LAN, port forwarding has been done on the router to let the site be accessible over Internet"
        },
        {
          ID: "6",
          Desc:
            "For the sake of URL readability, registered a free domain at duckdns.org"
        }
      ],
      items: [],

      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false
      }
    };
  },
  mounted: function() {
    //console.log("URL ", this.url);
  },
  methods: {
    complete(index) {
      this.list[index] = !this.list[index];
    },
    toggle(index) {
      const i = this.selected.indexOf(index);

      if (i > -1) {
        this.selected.splice(i, 1);
      } else {
        this.selected.push(index);
      }
    }
  }
};
</script>