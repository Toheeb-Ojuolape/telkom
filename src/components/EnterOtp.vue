<template>
  <v-row no-gutters>
    <v-col
        md="6"
        offset-md="3"
    >
      <v-card
          class="pa-2"
          outlined
          tile
      >
        <v-card-title>OTP was sent to your mobile #: </v-card-title>
        <v-card-text>
          <v-alert
              dense
              border="left"
              type="warning"
              v-if="showError"
          >
            Invalid OTP supplied, Kindly try again
          </v-alert>
          <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              onsubmit="return false"
          >
            <v-text-field
                v-model="otp"
                :counter="6"
                maxlength="6"
                label="Enter OTP"
            ></v-text-field>
          </v-form>

          <v-row
              align="center"
              justify="space-around">
            <v-btn
                @click="cancel"
                depressed color="error">
              Cancel
            </v-btn>
            <v-btn
                @click="validate"
                depressed color="primary">
              Next
            </v-btn>
          </v-row>
        </v-card-text>

      </v-card>
    </v-col>
  </v-row>

</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: 'EnterOtp',

    data: () => ({
      interval: null,
      otp: '',
      showError: false,
      valid: false,
      otpRules: [
        v => !!v || 'OTP is required',
        v => (v && v.length === 6) || 'OTP must be 6 digits only',
      ],
    }),

    computed: {
      ...mapGetters(["isOtpValidationDone"])
    },

    methods: {
      validate () {
        // if(this.$refs.form.validate()) {
          this.submitOTP()
        
      },
      cancel () {
        if (confirm('are you sure?')) {
          this.$store.dispatch('previousPage')
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
      submitOTP () {
        this.$store.dispatch('nextPage')
        // this.$store.dispatch('validateOTP', {
        //   otp: this.otp
        // })
        // this.interval = setInterval(() => {
        //   if (this.isOtpValidationDone) {
        //     clearInterval(this.interval)
        //     this.processing = false
        //     if (!this.$store.getters.getOTP) {
        //       this.showError = true
        //     }
        //   }
        // }, 1000);
        // if (this.$store.getters.getOTP.toString() !== this.otp) {
        //   this.showError = true
        // } else {
        //   this.showError = true
        //   // go to next page
        //   
        // }
      }
    }
  }
</script>
