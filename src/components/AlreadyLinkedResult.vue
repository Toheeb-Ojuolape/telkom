<template>
  <v-row no-gutters>
    <v-col md="6" offset-md="3">
      <v-card class="pa-2" outlined tile>
        <v-card-text>
          <v-row align="center" justify="space-around">
            <v-col>
              <v-row>
                <v-col>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>You were previously Linked.</v-list-item-title>
                      <v-list-item-title class="red--text">Want to link another number? Please, <a href="javascript:;" @click="startAgain">click here</a>.</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title>Your Phone Number</v-list-item-title>
                      <v-list-item-subtitle>{{ getTelephone }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Your NIN</v-list-item-title>
                      <v-list-item-subtitle>{{ getNin }}</v-list-item-subtitle>
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
  name: "AlreadyLinkedResult",

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
    ...mapGetters(['getNin', 'getTelephone']),
  },
};
</script>
