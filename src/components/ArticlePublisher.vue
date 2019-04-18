<template>
  <main>
    <header>
      <button class="btn__reset">Reset</button>
      <button class="btn__save">Save Changes</button>
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
  </main>
</template>

<script>
import ArticleSummaryCard from "./ArticleSummaryCard";
import * as data from "../assets/stories.json";

export default {
  name: "ArticlePublisher",
  components: {
    ArticleSummaryCard
  },
  data: function() {
    return {
      draftStories: [],
      liveStories: [],
      draggedEl: null,
      draggedStoryRef: null,
      originLane: null
    };
  },
  created: function() {
    let stories = data.stories;
    this.draftStories = stories;
  },
  methods: {
    onDragStart: function(e) {
      // keep track of parent lane
      console.log("drag started", e);
      e.dataTransfer.effectAllowed = "move";
      this.draggedEl = e.target.id;
      this.draggedStoryRef = e.target.dataset.story;
      this.originLane = e.target.parentNode.id;
      console.log(this.originLane, this.draggedStoryRef);
    },
    onDragOver: function(e) {
      e.preventDefault();
    },
    onDragEnter: function(e) {
      e.preventDefault();
    },
    onDrop: function(e) {
      // Cases to handle:
      // 1.) Move a story from draft to live - done
      // 2.) Move a story from draft to a specific spot in live
      // 3.) Move stories up and down in live - done
      // 4.) Move stories from live back to draft - done
      console.log("entered drop zone", e);
      // Move a story from draft to live
      if (e.target.id === "liveLane" && this.originLane === "draftLane") {
        let story = this.draftStories.find(draft => {
          return draft.id == this.draggedStoryRef;
        });
        this.liveStories.push(story);
        let startIndex = this.draggedEl;
        this.draftStories.splice(startIndex, 1);
      }
      // Move a story from live to draft
      if (e.target.id === "draftLane" && this.originLane === "liveLane") {
        let story = this.liveStories.find(story => {
          return story.id == this.draggedStoryRef;
        });
        let startIndex = this.draggedEl;
        this.liveStories.splice(startIndex, 1);
        this.draftStories.push(story);
      }
      // Move a story up and down in live
      if (
        this.originLane === "liveLane" &&
        e.target.parentNode.id === "liveLane"
      ) {
        console.log("moving in live list");
        let indexToInsertAt = e.target.id;
        let story = this.liveStories.find(story => {
          return story.id == this.draggedStoryRef;
        });
        let startIndex = this.draggedEl;
        this.liveStories.splice(startIndex, 1);
        this.liveStories.splice(indexToInsertAt, 0, story);
      }
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

  button {
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
</style>


