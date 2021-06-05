//import axios from "axios";

const state = {
  user: 'noUser'
};

const getters = {
  isAuthenticated: (state) => !!state.user,
  StateUser: (state) => state.user,
};

const actions = {
  async Register({commit}, user) {
  //  await commit("setUser", user.get("username"));
     await commit("setUser", user);
  },

  async LogOut({ commit }) {
    let user = null;
    commit("logout", user);
  },
};

const mutations = {
  setUser(state, user) {
    console.log('+++++++++',user)
    state.user = user;
   // state.user = Object.assign({}, state.user, user )
   //state.user = { ...state.obj, newProp: 123 }
  },

  logout(state, user) {
    state.user = user;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
