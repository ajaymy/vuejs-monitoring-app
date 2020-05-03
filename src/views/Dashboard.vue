<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout wrap>
      <v-flex md12 sm12 lg6>
        <material-chart-card
          :data="twoDaysChartInfo.data"
          :options="twoDaysChartInfo.options"
          color="info"
          type="Bar"
        >
          <h4 class="title font-weight-light">Daily Production</h4>

          <p class="category d-inline-flex font-weight-light">
            <!-- <v-icon color="green" small>mdi-arrow-up</v-icon> -->
            <span class="green--text">Two days production</span>
          </p>

          <template slot="actions">
            <v-icon class="mr-2" small>mdi-clock-outline</v-icon>
            <span class="caption grey--text font-weight-light">updated 4 minutes ago</span>
          </template>

          <v-badge color="error">
            <template slot="badge">
              <span></span>
            </template>
            <span class="pl-5 caption">Yesterday</span>
          </v-badge>
          <v-badge color="#0e1d5f">
            <template slot="badge">
              <span></span>
            </template>
            <span class="pl-5 caption">Today</span>
          </v-badge>
        </material-chart-card>
      </v-flex>
      <v-flex md12 sm12 lg6>
        <material-chart-card
          :data="uphChartInfo.data"
          :options="uphChartInfo.options"
          color="#af045c"
          type="Bar"
        >
          <h4 class="title font-weight-light">Hourly Production Rate</h4>
          <p class="category d-inline-flex font-weight-light">Machine UPH</p>

          <template slot="actions">
            <v-icon class="mr-2" small>mdi-clock-outline</v-icon>
            <span
              class="caption grey--text font-weight-light"
            >UPH between {{ currentHour }} - {{ nextHour }}</span>
          </template>
        </material-chart-card>
      </v-flex>
      <v-flex md12 sm12 lg6>
        <material-chart-card
          :data="OeeChartInfo.data"
          :options="OeeChartInfo.options"
          color="black"
          type="Line"
        >
          <h3 class="title font-weight-light">OEE</h3>
          <p class="category d-inline-flex font-weight-light">One Week OEE</p>

          <template slot="actions">
            <!-- <v-icon class="mr-2" small>mdi-clock-outline</v-icon> -->
            <!-- <span class="caption grey--text font-weight-light">as of today</span> -->
            <v-badge color="#e3e42b">
              <template slot="badge">
                <span></span>
              </template>
              <span class="pl-5 caption">MC1</span>
            </v-badge>
            <v-badge color="#f05b4f">
              <template slot="badge">
                <span></span>
              </template>
              <span class="pl-5 caption">MC2</span>
            </v-badge>
            <v-badge color="#f4c63d">
              <template slot="badge">
                <span></span>
              </template>
              <span class="pl-5 caption">MC3</span>
            </v-badge>
            <v-badge color="#d17905">
              <template slot="badge">
                <span></span>
              </template>
              <span class="pl-5 caption">MC4</span>
            </v-badge>
          </template>
        </material-chart-card>
      </v-flex>
      <v-flex md12 sm12 lg6>
        <material-card color="orange" title="Machine Status" :text="machineStatusDate" offset="10">
          <v-data-table :headers="machineStatusHeaders" :items="items" hide-actions>
            <!-- <template slot="headerCell" slot-scope="{ headers }">
              <span class="font-weight-light text-warning text--darken-3" v-text="headers.text" />
            </template>-->
            <template slot="items" slot-scope="{ index, item }">
              <td>{{ item.mcID }}</td>
              <td>{{ item.mcName }}</td>
              <td class="text-xs-right">{{ item.runTime }}</td>
              <td class="text-xs-right">{{ item.idleTime }}</td>
              <td class="text-xs-right">{{ item.downTime }}</td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
      <!-- <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="green"
          icon="mdi-store"
          title="Revenue"
          value="$34,245"
          sub-icon="mdi-calendar"
          sub-text="Last 24 Hours"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="orange"
          icon="mdi-content-copy"
          title="Used Space"
          value="49/50"
          small-value="GB"
          sub-icon="mdi-alert"
          sub-icon-color="error"
          sub-text="Get More Space..."
          sub-text-color="text-primary"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="red"
          icon="mdi-information-outline"
          title="Fixed Issues"
          value="75"
          sub-icon="mdi-tag"
          sub-text="Tracked from Github"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg3>
        <material-stats-card
          color="info"
          icon="mdi-twitter"
          title="Followers"
          value="+245"
          sub-icon="mdi-update"
          sub-text="Just Updated"
        />
      </v-flex>     
      <v-flex md12 lg6>
        <material-card class="card-tabs" color="green">
          <v-flex slot="header">
            <v-tabs v-model="tabs" color="transparent" slider-color="white">
              <span
                class="subheading font-weight-light mr-3"
                style="align-self: center"
                >Tasks:</span
              >
              <v-tab class="mr-3">
                <v-icon class="mr-2">mdi-bug</v-icon>Bugs
              </v-tab>
              <v-tab class="mr-3">
                <v-icon class="mr-2">mdi-code-tags</v-icon>Website
              </v-tab>
              <v-tab> <v-icon class="mr-2">mdi-cloud</v-icon>Server </v-tab>
            </v-tabs>
          </v-flex>

          <v-tabs-items v-model="tabs">
            <v-tab-item v-for="n in 3" :key="n">
              <v-list three-line>
                <v-list-tile @click="complete(0)">
                  <v-list-tile-action>
                    <v-checkbox :value="list[0]" color="green" />
                  </v-list-tile-action>
                  <v-list-tile-title
                    >Sign contract for "What are conference organized afraid
                    of?"</v-list-tile-title
                  >
                  <div class="d-flex">
                    <v-tooltip top content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="success"
                        icon
                      >
                        <v-icon color="primary">mdi-pencil</v-icon>
                      </v-btn>
                      <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip top content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="danger"
                        icon
                      >
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-tile>
                <v-divider />
                <v-list-tile @click="complete(1)">
                  <v-list-tile-action>
                    <v-checkbox :value="list[1]" color="success" />
                  </v-list-tile-action>
                  <v-list-tile-title>
                    Lines From Great Russian Literature? Or E-mails From My
                    Boss?
                  </v-list-tile-title>
                  <div class="d-flex">
                    <v-tooltip top content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="success"
                        icon
                      >
                        <v-icon color="primary">mdi-pencil</v-icon>
                      </v-btn>
                      <span>Edit</span>
                    </v-tooltip>

                    <v-tooltip top content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="danger"
                        icon
                      >
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-tile>
                <v-divider />
                <v-list-tile @click="complete(2)">
                  <v-list-tile-action>
                    <v-checkbox :value="list[2]" color="success" />
                  </v-list-tile-action>
                  <v-list-tile-title>
                    Flooded: One year later, assessing what was lost and what
                    was found when a ravaging rain swept through metro Detroit
                  </v-list-tile-title>
                  <div class="d-flex">
                    <v-tooltip top content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="success"
                        icon
                      >
                        <v-icon color="primary">mdi-pencil</v-icon>
                      </v-btn>
                      <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip top content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="danger"
                        icon
                      >
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-tile>
              </v-list>
            </v-tab-item>
          </v-tabs-items>
        </material-card>
      </v-flex>-->
    </v-layout>
  </v-container>
</template>

<script>
import { bus } from "@/utils/eventhandler";
import Helper from "@/utils/dashhelper";
import Legend from "chartist-plugin-legend";
export default {
  data() {
    return {
      currentHour: "a",
      nextHour: "b",
      dailySalesChart: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [
            [12, 17, 7, 17, 23, 18, 38],
            [9, 23, 39, 13, 45, 60, 10]
          ]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          showPoint: false,
          low: 0,
          high: 100, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dataCompletedTasksChart: {
        data: {
          labels: ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      OeeChartInfo: {
        data: {
          labels: [],
          series: [[]]
        }
      },
      uphLabels: ["M1", "M2"],
      uphData: [35, 75],
      uphChartInfo: {
        data: {
          labels: this.uphLabels,
          series: this.uphData
        }
      },
      twodaysLabels: [],
      twoDaysSeries: [],
      twoDaysChartInfo: {
        data: {
          labels: this.twodaysLabels,
          series: this.twoDaysSeries
        }
      },
      emailsSubscriptionChart: {
        data: {
          labels: ["A", "B"],
          series: [[15, 20]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 100,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      },
      machineStatusDate: "",
      machineStatusArray: [],
      machineStatusHeaders: [
        {
          sortable: false,
          text: "ID",
          value: "id"
        },
        {
          sortable: false,
          text: "Machine",
          value: "machine"
        },
        {
          sortable: false,
          text: "RunTime",
          value: "runtime",
          align: "right"
        },
        {
          sortable: false,
          text: "IdleTime",
          value: "idletime",
          align: "right"
        },
        {
          sortable: false,
          text: "DownTime",
          value: "downtime",
          align: "right"
        }
      ],
      machineStatusItems: this.machineStatusArray,
      headers: [
        {
          sortable: false,
          text: "ID",
          value: "id"
        },
        {
          sortable: false,
          text: "Name",
          value: "name"
        },
        {
          sortable: false,
          text: "Salary",
          value: "salary",
          align: "right"
        },
        {
          sortable: false,
          text: "Country",
          value: "country",
          align: "right"
        },
        {
          sortable: false,
          text: "City",
          value: "city",
          align: "right"
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
    //console.log('Label:', new Date());
    // Helper.getCurrentTime();
    Helper.getUPH();
    Helper.getmachineStatus();

    bus.$on("RenderUPHChart", params => {
      //console.log('RenderChart ON');
      this.uphLabels = params.labels;
      this.uphData = params.series;
      this.currentHour = params.currHour;
      this.nextHour = params.nextHour;
      this.renderUPHChart();
    });
    bus.$on("TwoDaysCount", params => {
      this.twodaysLabels = params.labels;
      this.twoDaysSeries = params.series;
      this.renderTwoDaysChart();
    });
    bus.$on("MachineStatus", params => {
      this.items = params.machineStatusArray;
      this.machineStatusDate = params.date;
    });
    bus.$on("OeeInfo", params => {
      this.renderOEEChart(params);
    });
  },
  methods: {
    complete(index) {
      this.list[index] = !this.list[index];
    },
    updateHour(params) {
      this.currentHour = params.currHour;
      this.nextHour = params.nextHour;
      //console.log('Params1 ', this.currentHour, this.nextHour);
    },

    renderUPHChart() {
      // console.log('TCL: renderUPHChart -> emailLabels', this.uphLabels);
      // console.log('TCL: renderUPHChart -> emailData', this.uphData);
      this.uphChartInfo = {
        data: {
          labels: this.uphLabels,
          series: [this.uphData]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 20,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        }
      };
    },
    renderTwoDaysChart() {
      this.twoDaysChartInfo = {
        data: {
          labels: this.twodaysLabels,
          series: this.twoDaysSeries
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        }
      };
      Helper.getOEE();
    },
    renderOEEChart(params) {
      this.OeeChartInfo = {
        data: {
          labels: params.labels,
          series: params.series
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 40,
          high: 100, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      };
    }
  }
};
</script>
<style scoped></style>
