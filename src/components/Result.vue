<template>
  <v-row no-gutters>
    <v-col md="6" offset-md="3">
      <v-card class="pa-2" outlined tile>
        <v-card-text>
          <v-row align="center" justify="space-around">
            <v-col>
              <v-row>
                <v-col sm="2" offset-sm="5">
                  <v-img
                    v-if="!isNinLookupFailed"
                    :lazy-src="successfulImg"
                    max-height="100"
                    max-width="100"
                    :src="successfulImg"
                  ></v-img>

                  <v-img
                    v-else-if="isNinLookupFailed"
                    :lazy-src="failedImg"
                    max-height="100"
                    max-width="100"
                    :src="failedImg"
                  ></v-img>
                </v-col>
              </v-row>

              <!--              <v-row>-->
              <!--                <v-col md="3"-->
              <!--                       offset-md="4">-->
              <!--                  <v-row>-->
              <!--                    <v-col>-->
              <!--                      <v-img-->
              <!--                          :lazy-src="successfulImg"-->
              <!--                          max-height="70"-->
              <!--                          max-width="70"-->
              <!--                          :src="successfulImg"-->
              <!--                      ></v-img>-->
              <!--                    </v-col>-->
              <!--                    <v-col>-->
              <!--                      <v-img-->
              <!--                          :lazy-src="successfulImg"-->
              <!--                          max-height="70"-->
              <!--                          max-width="70"-->
              <!--                          :src="successfulImg"-->
              <!--                      ></v-img>-->
              <!--                    </v-col>-->
              <!--                  </v-row>-->
              <!--                </v-col>-->
              <!--              </v-row>-->

              <v-row>
                <v-col>
                  <!--                  <v-card v-if="successful">-->
                  <!--                    <v-card-title>Confidence Index : <span class="green&#45;&#45;text">90%</span></v-card-title>-->
                  <!--                  </v-card>-->

                  <!--                  <v-card v-if="!successful">-->
                  <!--                    <v-card-title>Confidence Index : <span class="red&#45;&#45;text">10%</span></v-card-title>-->
                  <!--                  </v-card>-->

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-if="!isNinLookupFailed">Thank you, your request is Successful.</v-list-item-title>
<!--                      <v-list-item-title v-if="successful">Thank you for linking your NIN</v-list-item-title>-->
                      <v-list-item-title v-if="isNinLookupFailed" class="red--text">Failure to link your NIN. Please, <a href="javascript:;" @click="startAgain">try again</a>.</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
<!--                  <v-card>-->
<!--                    <v-card-subtitle>Tips to complete a successful link.</v-card-subtitle>-->
<!--                    <v-card-text>-->
<!--                      <v-list>-->
<!--                        <v-list-item>You need good lighting, but avoid bright lights behind you.</v-list-item>-->
<!--                        <v-list-item>Its all about the face, not too far away or too close, look straight ahead.</v-list-item>-->
<!--                        <v-list-item>Remove anything in the way.</v-list-item>-->
<!--                        <v-list-item>A selfie is a Solo act - ensure no friend photo bomb.</v-list-item>-->
<!--                      </v-list>-->
<!--                    </v-card-text>-->
<!--                  </v-card>-->

                  <v-list-item two-line v-if="!isNinLookupFailed">
                    <v-list-item-content>
                      <v-list-item-title>Your Name</v-list-item-title>
                      <v-list-item-subtitle v-if="!isNinLookupFailed">{{
                        getNinData
                          ? getNinData.firstname + " " + getNinData.surname
                          : ""
                      }}</v-list-item-subtitle>
                      <v-list-item-subtitle v-if="isNinLookupFailed" class="red--text">-</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item two-line v-if="!isNinLookupFailed">
                    <v-list-item-content>
                      <v-list-item-title>Your NIN</v-list-item-title>
                      <v-list-item-subtitle v-if="!isNinLookupFailed">{{
                        getNinData ? getNinData.nin : ""
                      }}</v-list-item-subtitle>
                      <v-list-item-subtitle v-if="isNinLookupFailed" class="red--text">-</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item two-line v-if="!isNinLookupFailed">
                    <v-list-item-content>
                      <v-list-item-title>Your Selfie</v-list-item-title>
                      <v-list-item-subtitle v-if="!isNinLookupFailed">Verified</v-list-item-subtitle>
                      <v-list-item-subtitle v-if="isNinLookupFailed" class="red--text">Unverified</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Result",

  mounted() {
    // const cards = [true, true, true, true, true, true, true, true];
    // const random = Math.floor(Math.random() * cards.length);
    // this.successful = cards[random];
    // this.failed = !cards[random];
  },

  data: () => ({
    successfulImg: require("../assets/success_icon.png"),
    failedImg: require("../assets/error_icon.png"),
    // successful: false,
    // failed: false,
  }),

  methods: {
    startAgain() {
      this.$store.dispatch("gotoPage", 1);
    },
  },

  computed: {
    ...mapGetters(['getNinData', 'isNinLookupFailed', 'isNinLookupDone']),
  },
};
</script>
