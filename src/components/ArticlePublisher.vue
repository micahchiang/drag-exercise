<template>
  <main>
    <header>
      <button
        v-on:click="showModal('Reset List?')"
        class="btn btn__reset"
      >Reset</button>
      <button
        v-on:click="showModal('Submit List?')"
        class="btn btn__save"
      >Save Changes</button>
    </header>
    <section
      class="content__container"
      v-on:drop="onDrop"
      v-on:dragover="onDragOver"
      v-on:dragenter="onDragEnter"
    >
      <div class="content__lane">
        <h3 class="content__lane-title">Queue</h3>
        <div
          id="draftLane"
          class="content__lane__content__container"
        >
          <div
            class="content__lane__content__container-block"
            v-for="(draft, index) in draftStories"
            :key=draft.id
            :id=index
            :data-story=draft.id
            v-bind:draggable="true"
            v-on:dragstart="onDragStart($event)"
          >
            <ArticleSummaryCard v-bind="draft" />
          </div>
        </div>
      </div>
      <div class="content__lane">
        <h3 class="content__lane-title">Live On The Page</h3>
        <div
          id="liveLane"
          class="content__lane__content__container"
        >
          <div
            class="content__lane__content__container-block"
            v-for="(story,index) in liveStories"
            :key=story.id
            :id=index
            :data-story=story.id
            v-bind:draggable="true"
            v-on:dragstart="onDragStart($event)"
          >
            <ArticleSummaryCard v-bind="story" />
          </div>
        </div>
      </div>
    </section>
    <div
      v-if="hasModal"
      class="modal__container"
    >
      <main class="modal__body">
        <h3>{{modalMessage}}</h3>
        <button
          v-on:click="hideModal()"
          class="btn btn__cancel"
        >Cancel</button>
        <button
          v-on:click="handleConfirm()"
          class="btn btn__save"
        >Confirm</button>
      </main>
    </div>
  </main>
</template>

<script>
import ArticleSummaryCard from "./ArticleSummaryCard";
import { mapState } from "vuex";

// Cases to handle:
// 1.) Move a story from draft to live - done
// 2.) Move a story from draft to a specific spot in live - done
// 3.) Move stories up and down in live - done
// 4.) Move stories from live back to draft - done

export default {
  name: "ArticlePublisher",
  components: {
    ArticleSummaryCard
  },
  computed: {
    ...mapState({
      draftStories: state => state.draftStories,
      liveStories: state => state.liveStories
    })
  },
  data: function() {
    return {
      draggedEl: null,
      draggedStoryRef: null,
      originLane: null,
      hasModal: false,
      modalMessage: ""
    };
  },
  created: function() {
    this.$store.dispatch("getDrafts");
  },
  methods: {
    onDragStart: function(e) {
      e.dataTransfer.effectAllowed = "move";
      this.draggedEl = e.target.id;
      this.draggedStoryRef = e.target.dataset.story;
      this.originLane = e.target.parentNode.id;
    },
    // preventDefault to allow onDrop
    onDragOver: function(e) {
      e.preventDefault();
    },
    onDragEnter: function(e) {
      e.preventDefault();
    },
    onDrop: function(e) {
      if (e.target.id === "liveLane" && this.originLane === "draftLane") {
        // Move a story from draft to live
        this.handleUpdate("draftToLive", this.draggedStoryRef, this.draggedEl);
      } else if (
        e.target.id === "draftLane" &&
        this.originLane === "liveLane"
      ) {
        // Move a story from live to draft
        this.handleUpdate("liveToDraft", this.draggedStoryRef, this.draggedEl);
      } else if (
        this.originLane === "liveLane" &&
        e.target.parentNode.id === "liveLane"
      ) {
        // Move a story up and down in live
        let indexToInsertAt = e.target.id;
        this.handleUpdate(
          "liveOrderChange",
          this.draggedStoryRef,
          this.draggedEl,
          indexToInsertAt
        );
      } else if (
        this.originLane === "draftLane" &&
        e.target.parentNode.id === "liveLane"
      ) {
        // Move a story from draft to specific spot in live
        let indexToInsertAt = e.target.id;
        this.handleUpdate(
          "draftToLiveSlot",
          this.draggedStoryRef,
          this.draggedEl,
          indexToInsertAt
        );
      }
    },
    handleUpdate: function(
      message,
      storyRef,
      storyArrayIndex,
      insertAtIndex = 0
    ) {
      let payload = { message, storyRef, storyArrayIndex, insertAtIndex };
      console.log("reaches handle update", payload);
      this.$store.dispatch("updateLists", payload);
    },
    showModal: function(msg) {
      this.modalMessage = msg;
      this.hasModal = true;
    },
    hideModal: function() {
      this.modalMessage = "";
      this.hasModal = false;
    },
    handleConfirm: function() {
      if (this.modalMessage === "Reset List?") {
        this.$store.dispatch("resetLists");
      } else if (this.modalMessage === "Submit List?") {
        this.$store.dispatch("submitLists", this.liveStories);
      }
      this.hideModal();
    }
  }
};
</script>

<style lang="scss" scoped>
/* Colors */
$color--white: #ffffff;
$border--light: #cccccc;
$background--light: #eeeeee;
$btn--teal: #08c4a7;
$btn--green: #26c25a;
$btn--red: #ff3760;

main {
  background-color: $background--light;
}
header {
  background-color: $color--white;
  border-bottom: 1px solid $border--light;
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}
.btn {
  margin: 0 0.5rem;
  border-radius: 5px;
  border: none;
  outline: none;
  font-size: 0.75rem;
  padding: 1rem;
  color: $color--white;
}
.btn__reset {
  background-color: $btn--teal;
}
.btn__save {
  background-color: $btn--green;
}
.btn__cancel {
  background-color: $btn--red;
}

.content__container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;

  .content__lane {
    margin: 0 1rem;
    padding: 1rem;
    background-color: $color--white;
    border: 1px solid $border--light;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 48%;

    &-title {
      text-align: left;
    }

    &__content__container {
      width: 100%;
      min-height: 100vh;
    }
  }
}
.modal__container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(#000000, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;

  .modal__body {
    padding: 1rem;
    border-radius: 5px;
  }
}
</style>


