import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth from "./modules/auth";


// Create store

//export default new createStore({
export default createStore({
  modules: {
    auth
  },
  plugins: [createPersistedState()],
 // strict: process.env.NODE_ENV !== 'production'
})