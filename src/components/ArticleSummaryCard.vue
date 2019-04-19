<template>
  <main class="summary__container">
    <div class="img__container">
      <img
        class="summary__img"
        v-bind:src="img"
      />
    </div>
    <div class="info__container">
      <h3 class="info__container-title">{{title}}</h3>
      <p class="info__container-text">{{author}}</p>
      <p class="info__container-datetext">{{publishedAt}}</p>
    </div>
    <span
      class="card__status"
      v-bind:class="{
          'card__status-live': status !== 'Not Placed',
          'card__status-draft': status === 'Not Placed'
      }"
    >
      {{status}}
    </span>
  </main>
</template>

<script>
export default {
  name: "ArticleSummaryCard",
  props: {
    id: Number,
    title: String,
    author: String,
    publishedAt: String,
    img: String,
    status: String
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

.summary__container {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  background-color: $color--white;
  border: 1px solid $border--light;
  width: 100%;
  position: relative;
  margin: 1rem 0;
  pointer-events: none;
}
.img__container {
  height: 120px;
  width: 120px;
}
.summary__img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.info__container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 1rem;

  &-title {
    font-size: 1rem;
  }
  &-text {
    font-size: 0.95rem;
  }
  &-datetext {
    font-size: 0.8rem;
  }
}
.card__status {
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 5px;
  padding: 0.45rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: $color--white;
  &-draft {
    background-color: $btn--red;
  }
  &-live {
    background-color: $btn--green;
  }
}
</style>


