import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
// import formData from 'form-data'

Vue.use(Vuex);

function pushResult(phone, nin, selfie, score, success) {
  let body = {
    telephone: phone,
    nin: nin,
    selfie_photo: selfie,
    score: score,
    success: success,
    entries: true,
  };

  axios
    .post("https://sqldb-utfb7.ondigitalocean.app/", body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
        SERVICEID: "728370"
      },
    })
    .then((response) => {
      console.log("log", response.data);
    })
    .catch((err) => {
      console.log("log", err);
    });
}

function getConfidence(phone, nin, id, selfie, callback) {
  let parseSelfie = selfie.split(',')
  let body = {
    id: id,
    selfie: parseSelfie[1],
    user_id: phone,
  };

  let status
  let confidenceLevel

  axios
      .post("https://swiftend.com/verifySelfie/", body, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          SERVICEID: "728370"
        },
      })
      .then((response) => {
        const responseData = response.data.ResponseData
        confidenceLevel = parseFloat(responseData.confidenceValue)
        if (responseData.status && confidenceLevel >= 90.0) {
          // match
          status = true
        } else {
          status = false
        }
      })
      .catch((err) => {
        console.log("log", err);
      }).finally(() => {
        pushResult(phone, nin, 'data:,', confidenceLevel, status ? 1 : 0)
        setTimeout(() => {
          callback(status)
        }, 1000)
      });
}

// function enrollUser (uniqueNumber, imageString, fName, lastName) {
//     let WebApi = require("smile-identity-core");
//     let partner_id = '';
//     let api_key = ''; // Download your API key from the Smile Identity portal
//     let sid_server = '0'; // Use '0' for the sandbox (test) server, use '1' for production server
//     let connection = new WebApi(partner_id, '', api_key, sid_server);
//     // Create required tracking parameters
//     let partner_params = {
//         user_id: 'swtend-' + uniqueNumber,
//         job_id: Math.floor(100000000000 + Math.random() * 900000000000),
//         // Job Type Integer 1 for jobs that compare a selfie to an ID,
//         // 2 for authenticating a selfie against a previously registered user,
//         // 4 for registering a user,
//         // 8 for updating the enrolled photo
//         job_type: 1
//     };
//     let image_details =  [
//         {
//             image_type_id: 3,
//             image: imageString
//         }
//     ];
//     let id_info = {
//         first_name: fName,
//         last_name: lastName,
//         entered: 'true'
//     };
//     let options = {
//         return_job_status: true,
//         return_history: true,
//         return_image_links: true
//     };
//     let response = connection.submit_job(partner_params, image_details, id_info, options)
//     console.log('smileID response', response)
// }

const store = new Vuex.Store({
  state: {
    pageNumber: 1,
    otp: null,
    telephone: null,
    nin: null,
    ninLookupFailed: false,
    ninLookupDone: false,
    ninResponse: {},
    selfie: null,
    otpValidationDone: null
  },
  mutations: {
    nextPage(state) {
      state.pageNumber++;
    },
    previousPage(state) {
      state.pageNumber--;
    },
    gotoPage(state, page) {
      state.pageNumber = page;
    },
    // generateOTP(state) {
    //   state.otp = Math.floor(100000 + Math.random() * 900000);
    // },
    otpValidated(state) {
      state.otp = true;
    },
    otpFailedValidation(state) {
      state.otp = false;
    },
    doneThings(state) {
      state.otp = null;
    },
    setTelephone(state, phone) {
      state.telephone = phone;
    },
    setNin(state, nin) {
      state.nin = nin;
    },
    setNinLookupFailed(state) {
      state.ninLookupFailed = true;
    },
    setNinLookupDone(state) {
      state.ninLookupDone = true;
    },
    setNinData(state, data) {
      state.ninResponse = data;
    },
    setSelfie(state, base64) {
      state.selfie = base64;
    },
  },
  actions: {
    nextPage(context) {
      context.commit("nextPage");
    },
    previousPage(context) {
      context.commit("previousPage");
    },
    gotoPage(context, payload) {
      context.commit("gotoPage", payload);
    },
    saveSelfie(context, base64) {
      context.commit("setSelfie", base64);
    },
    doneThings(context) {
      context.commit('doneThings')
    },
    validateOTP(context, payload) {
      let doingCheck = false;
      axios
          .post(
              "https://sqldb-utfb7.ondigitalocean.app/sendotp/",
              {
                msisdn: context.getters.getTelephone,
                validate: true,
                otp: payload.otp
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "*/*",
                  Token: "ygdjhkjasf34567sftx4yhgs5y6hb6",
                  "Access-Control-Allow-Origin": "*",
                },
              }
          )
          .then((response) => {
            console.log("validate-otp", response.data);
            if (response.data.status) {
              context.commit('otpValidated')
              doingCheck = true
              // once OTP is validated successfully, then call endpoint to check if its an already linked customer
              isNinLinked(context.getters.getTelephone).then((isLinked) => {
                if (isLinked.linked) {
                  context.commit('setNin', isLinked.nin)
                  context.commit('gotoPage', -1) // go to a page that tells customers they are already linked
                } else {
                  context.commit('nextPage')
                }
              }).finally(() => {
                context.state.otpValidationDone = true
              })
            } else {
              context.commit('otpFailedValidation')
            }
          })
          .catch((err) => {
            console.log("validate-otp", err);
          })
          .finally(() => {
            if (!doingCheck) {
              context.state.otpValidationDone = true
            }
          });
    },
    generateOTP(context, payload) {
      // context.commit("generateOTP");
      context.commit("setTelephone", payload.phone);
      // then call API to send OTP to phone
      // const to = context.getters.getTelephone.substring(1);
      axios
        .post(
          "https://sqldb-utfb7.ondigitalocean.app/sendotp/",
          {
            msisdn: context.getters.getTelephone,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
              Token: "ygdjhkjasf34567sftx4yhgs5y6hb6",
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((response) => {
          console.log("send-otp", response.data);
        })
        .catch((err) => {
          console.log("send-otp-error", err);
        });
    },
    fetchNin(context, payload) {
      context.commit("setNin", payload.nin);
      axios
        .get(
          "https://swiftend.com/verifynindemo/?regNo=" + context.getters.getNin,
          {
            headers: {
              SERVICEID: "863152",
            },
          }
        )
        .then((response) => {
          console.log("nin-lookup", '-');
          if (response.data.ResponseData) {
            // 95845306683
            context.commit("setNinData", response.data.ResponseData);
            // then enrollUser
            // let ninData = response.data.ResponseData
            // enrollUser(ninData.telephoneno, ninData.photo, ninData.firstname, ninData.surname)
            context.commit("setNin", context.getters.getNinData.nin);
            getConfidence(
                context.getters.getTelephone,
                context.getters.getNinData.nin,
                context.getters.getNinData.photo,
                context.getters.getSelfie,
                function (status) {
                  if (!status) {
                    context.commit("setNinLookupFailed");
                  }
                  context.commit("setNinLookupDone");
                }
            )
            // pushResult(
            //   context.getters.getTelephone,
            //   context.getters.getNin,
            //   context.getters.getSelfie,
            //   0,
            //   0
            // );
          } else {
            context.commit("setNinLookupFailed");
          }
        })
        .catch((err) => {
          console.log("nin-lookup", err);
          //context.commit("setNinLookupFailed");
        })
    },
  },
  getters: {
    getPageNumber: (state) => {
      return state.pageNumber;
    },
    getOTP: (state) => {
      return state.otp;
    },
    getTelephone: (state) => {
      return state.telephone;
    },
    getNin: (state) => {
      return state.nin;
    },
    getNinData: (state) => {
      return state.ninResponse;
    },
    isNinLookupFailed: (state) => {
      return state.ninLookupFailed;
    },
    isNinLookupDone: (state) => {
      return state.ninLookupDone;
    },
    isOtpValidationDone: (state) => {
      return state.otpValidationDone
    },
    isOTPValid: (state) => {
      return state.otp
    },
    getSelfie: (state) => {
      return state.selfie;
    },
  },
});

function isNinLinked (phone) {
  return new Promise((resolve) => {
    let r = {
      linked: false,
      nin: null,
    }
    axios
        .post("https://sqldb-utfb7.ondigitalocean.app/", {
          validate: true,
          msisdn: phone,
        }, {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "Access-Control-Allow-Origin": "*",
            SERVICEID: "728370"
          },
        })
        .then((response) => {
          if (response.data.status !== "404") {
            r.linked = true
            r.nin = response.data.data
          }
        })
        .catch((err) => {
          console.log("log", err);
        })
        .finally(() => {
          resolve(r)
        });
  });
}

export default store;
