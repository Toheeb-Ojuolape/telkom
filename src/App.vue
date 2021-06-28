<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row class="text-center">
          <v-col cols="12">
            <v-img
                :src="require('./assets/9-mobile-logo.png')"
                class="my-3"
                contain
                height="200"
            />
          </v-col>
          <v-col
              class="mb-5"
              cols="12"
          >
            <Home v-if="getPageNumber === 1"/> <!-- page 1 -->
            <EnterOtp v-else-if="getPageNumber === 2"/> <!-- page 2 -->
            <EnterNin v-else-if="getPageNumber === 3"/> <!-- page 3 -->
            <AlreadyLinkedResult v-else-if="getPageNumber === -1"/> <!-- page -1, already linked customer -->
            <Result v-else /> <!-- page 4 -->
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Home from './components/Home';
import EnterOtp from './components/EnterOtp';
import EnterNin from './components/EnterNin';
import Result from './components/Result';
import AlreadyLinkedResult from './components/AlreadyLinkedResult';
import { mapGetters } from 'vuex';

export default {
  name: 'App',

  components: {
    Home,
    EnterOtp,
    EnterNin,
    Result,
    AlreadyLinkedResult,
  },

  computed : {
    ...mapGetters([
      'getPageNumber'
    ])
  }
};
</script>
