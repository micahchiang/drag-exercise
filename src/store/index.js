import Vue from "vue";
import Vuex from "vuex";
import BackendService from "../services/backend.service";
// import * as data from "../assets/stories.json";

Vue.use(Vuex);

const backendService = new BackendService();

const store = new Vuex.Store({
  state: {
    draftStories: [],
    liveStories: []
  },
  getters: {
    draftStories: state => state.draftStories,
    liveStories: state => state.liveStories
  },
  mutations: {
    setDrafts(state, data) {
      state.draftStories = data;
    },
    resetLists(state) {
      state.draftStories = [...state.draftStories, ...state.liveStories];
      state.liveStories = [];
      state.draftStories.forEach(draft => {
        draft.status = "Not Placed";
      });
    },
    updateLists(state, data) {
      let message = data.message;
      switch (message) {
        case "draftToLive": {
          let story = state.draftStories[data.storyArrayIndex];
          state.liveStories.push(story);
          state.draftStories.splice(data.storyArrayIndex, 1);
          break;
        }
        case "liveToDraft": {
          let story = state.liveStories[data.storyArrayIndex];
          story.status = "Not Placed";
          state.liveStories.splice(data.storyArrayIndex, 1);
          state.draftStories.push(story);
          break;
        }
        case "liveOrderChange": {
          let story = state.liveStories[data.storyArrayIndex];
          state.liveStories.splice(data.storyArrayIndex, 1);
          state.liveStories.splice(data.insertAtIndex, 0, story);
          break;
        }
        case "draftToLiveSlot": {
          let story = state.draftStories[data.storyArrayIndex];
          state.liveStories.splice(data.insertAtIndex, 0, story);
          state.draftStories.splice(data.storyArrayIndex, 1);
          break;
        }
        default: {
          // handle errors maybe?
          console.log("no change detected");
          break;
        }
      }
      // update live story slots
      state.liveStories.forEach((story, index) => {
        index === 0
          ? (story.status = "Hero Story")
          : (story.status = `Slot ${index}`);
      });
    }
  },
  actions: {
    async getDrafts({ commit }) {
      try {
        let drafts = await backendService.getDrafts();
        commit("setDrafts", drafts);
      } catch (e) {
        console.log(`An error occurred on data retrieval: ${e}`);
      }
    },
    updateLists({ commit }, data) {
      commit("updateLists", data);
    },
    resetLists({ commit }) {
      commit("resetLists");
    },
    async submitLists(data) {
      let backendPayload = { path: "/some/api/endpoint", data };
      try {
        let res = await backendService.postToServer(backendPayload);
        console.log(res);
      } catch (e) {
        console.log(`error posting to server: ${e}`);
      }
    }
  }
});

export default store;
