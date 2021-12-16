<template>
  <div>
    <form v-if="!isLoggedIn" onsubmit="return false;">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2" for="email">
          Email
        </label>
        <input
          v-model="formData.email"
          class="border rounded w-full text-white py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Email"
          type="email"
          autocomplete="username"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2" for="email">
          Password
        </label>
        <input
          v-model="formData.password"
          class="border rounded text-white text-white w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Password"
          type="password"
          autocomplete="current-password"
        />
      </div>
      <v-btn @click="signInUser" color="success button">Sign In</v-btn>
    </form>
    <div v-else>
      <p>You are logged in with {{ authUser.email }}.</p>
      <v-btn color="primary" outlined @click="logout">Logout</v-btn>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState({
      authUser: (state) => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  // fetch() {
  //   // INFO -> this.$fire.auth user etc. are accessible
  //   // INFO -> this.$store.state.authUser is accessible even on server-side
  // },
  data: () => ({
    formData: {
      email: '',
      password: '',
    },
  }),
  methods: {
    async signInUser() {
      try {
        await this.$fire.auth.signInWithEmailAndPassword(
          this.formData.email,
          this.formData.password
        )
      } catch (e) {
        alert(e)
      }
    },
    async logout() {
      try {
        await this.$fire.auth.signOut()
      } catch (e) {
        alert(e)
      }
    },
  },
})
</script>

<style>
.text-white{
  color: white !important;
  border: white solid 1px !important;
}
</style>
