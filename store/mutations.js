import initialState from './state'

export default {
  RESET_STORE: (state) => {
    Object.assign(state, initialState())
  },

  SET_AUTH_USER: (state, { authUser }) => {
    console.log(authUser)
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email,
      token: authUser.multiFactor.user.accessToken
    }
  }
}
