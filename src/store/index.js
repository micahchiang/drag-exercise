import Vue from "vue";
import Vuex from "vuex";
import * as data from "../assets/stories.json";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    masterStoriesList: [],
    draftStories: [],
    liveStories: []
  },
  getters: {
    draftStories: state => state.draftStories,
    liveStories: state => state.liveStories
  },
  mutations: {
    setDrafts(state, data) {
      state.masterStoriesList = data;
      state.draftStories = data;
    },
    updateLists(state, data) {
      let message = data.message;
      switch (message) {
        case "draftToLive": {
          let story = state.draftStories.find(draft => {
            return draft.id == data.storyRef;
          });
          state.liveStories.push(story);
          state.draftStories.splice(data.storyArrayIndex, 1);
          break;
        }
        case "liveToDraft": {
          let story = state.liveStories.find(story => {
            return story.id == data.storyRef;
          });
          story.status = "Not Placed";
          state.liveStories.splice(data.storyArrayIndex, 1);
          state.draftStories.push(story);
          break;
        }
        case "liveOrderChange": {
          let story = state.liveStories.find(story => {
            return story.id == data.storyRef;
          });
          state.liveStories.splice(data.storyArrayIndex, 1);
          state.liveStories.splice(data.insertAtIndex, 0, story);
          break;
        }
        case "draftToLiveSlot": {
          let story = state.draftStories.find(draft => {
            return draft.id == data.storyRef;
          });
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
        let drafts = await data.stories;
        commit("setDrafts", drafts);
      } catch (e) {
        console.log(`An error occurred on data retrieval: ${e}`);
      }
    },
    updateLists({ commit }, data) {
      console.log("in updatelists action");
      commit("updateLists", data);
    }
  }
});

export default store;
