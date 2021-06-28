<template>
  <v-row no-gutters>
    <v-col md="6" offset-md="3">
      <v-card class="pa-2" outlined tile>
        <v-card-text>
          <v-alert dense border="left" type="error" v-if="isNinLookupFailed">
            Lookup failed. Check details or TRY AGAIN LATER
          </v-alert>
<!--          <v-alert dense border="left" type="warning" v-if="timeOut">-->
<!--            Request timed out, Please try again later-->
<!--          </v-alert>-->
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            onsubmit="return false"
          >
            <v-progress-circular
                v-if="processing"
                :size="70"
                :width="7"
                color="purple"
                indeterminate
            ></v-progress-circular>

            <v-text-field
              v-if="!processing"
              v-model="nin"
              :counter="11"
              maxlength="11"
              :rules="ninRules"
              label="Enter your valid NIN or Phone Number registered with your NIN"
              required
            ></v-text-field>

            <v-row>
              <v-col sm="6" offset-sm="3">
                <v-row>
                  <v-alert type="success" v-if="captureDone">
                    Image Captured Successfully
                  </v-alert>
                  <WebCam
                    v-show="renderCam"
                    ref="webcam"
                    :device-id="deviceId"
                    width="100%"
                    @started="onStarted"
                    @stopped="onStopped"
                    @error="onError"
                    @cameras="onCameras"
                    @camera-change="onCameraChange"
                  ></WebCam>
                </v-row>
                <v-row>
                  <v-col>
                    <select v-model="camera">
                      <option>-- Select Device --</option>
                      <option
                        v-for="device in devices"
                        :key="device.deviceId"
                        :value="device.deviceId"
                      >
                        {{ device.label }}
                      </option>
                    </select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn small color="primary" @click="onCapture"
                      >Capture Photo</v-btn
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn small color="error" @click="onStop"
                      >Stop Camera</v-btn
                    >
                    <v-btn small color="warning" @click="onStart"
                      >Start Camera</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>

          <v-row align="center" justify="space-around">
            <v-btn
              :disabled="processing"
              @click="cancel"
              depressed
              color="error"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="processing"
              @click="validate"
              depressed
              color="primary"
            >
              Next
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import { WebCam } from "vue-web-cam";

export default {
  name: "EnterNin",

  data: () => ({
    interval: null,
    img: null,
    renderCam: true,
    captureDone: false,
    camera: null,
    deviceId: null,
    devices: [],
    nin: "",
    ninPhone: "",
    showError: false,
    valid: false,
    timeOut: false,
    processing: false,
    ninRules: [
      (v) => !!v || "NIN is required",
      (v) => (v && v.length === 11) || "NIN must be 11 digits only",
    ],
    ninPhoneRules: [
      (v) => !!v || "Your 9mobile number is required",
      (v) =>
        (v && v.length === 11) || "Your telephone must be 11 digits long only",
    ],
  }),

  methods: {
    validate() {
      this.showError = false;
      if (this.$refs.form.validate()) {
        if (this.captureDone && this.img !== 'data:,') {
          this.submitNin();
        } else {
          alert("Please, capture your face first");
        }
      }
    },
    cancel() {
      if (confirm("are you sure?")) {
        this.$store.dispatch("gotoPage", 1);
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    submitNin() {
      this.processing = true;
      // push selfie data to store
      this.$store.dispatch('saveSelfie', this.img)
      this.$store.dispatch("fetchNin", {
        nin: this.nin,
      });
      this.interval = setInterval(() => {
        if (this.isNinLookupDone) {
          clearInterval(this.interval)
          // go to the next page
          this.$store.dispatch("nextPage");
          this.processing = false
        }
      }, 1000);
    },
    onCapture() {
      if (this.renderCam) {
        this.img = this.$refs.webcam.capture();
        this.captureDone = true;
        this.renderCam = false;
      } else {
        alert("Camera is currently off, kindly turn it ON");
      }
    },
    onStarted(stream) {
      console.log("On Started Event", stream);
    },
    onStopped(stream) {
      console.log("On Stopped Event", stream);
    },
    onStop() {
      this.$refs.webcam.stop();
      this.renderCam = false;
      this.captureDone = false;
    },
    onStart() {
      this.renderCam = true;
      this.$refs.webcam.start();
      this.captureDone = false;
    },
    onError(error) {
      console.log("On Error Event", error);
    },
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
      console.log("On Camera Change Event", deviceId);
    },
  },

  computed: {
    ...mapGetters(["isNinLookupFailed", "isNinLookupDone"]),
    device: function () {
      return this.devices.find((n) => n.deviceId === this.deviceId);
    },
  },

  watch: {
    camera: function (id) {
      this.deviceId = id;
    },
    devices: function () {
      // Once we have a list select the first one
      const [first] = this.devices;
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    },
  },

  components: {
    WebCam,
  },
};
</script>
