<template>
  <v-row no-gutters>
    <v-col md="6" offset-md="3">
      <v-card class="pa-2" outlined tile>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          onsubmit="return false"
        >
          <v-text-field
            v-model="phone"
            :counter="11"
            maxlength="11"
            :rules="phoneRules"
            label="Enter Your Phone Number"
            required
            clearable
          ></v-text-field>
        </v-form>

        <v-row align="center" justify="space-around">
          <v-btn @click="validate" depressed color="primary"> Next </v-btn>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Home",

  data: () => ({
    phone: "",
    valid: false,
    phoneRules: [
      (v) => !!v || "Your 9mobile number is required",
      (v) =>
        (v && v.length === 11) || "Your telephone must be 11 digits long only",
    ],
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        // before going to next. generate otp
        this.phoneNext();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    phoneNext() {
      this.$store.dispatch("nextPage");
      this.$store.dispatch("generateOTP", {
        phone: this.phone,
      });
    },
  },
};
</script>
