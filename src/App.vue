<template>
  <div id="app">
    <ArticlePublisher />
  </div>
</template>

<script>
import ArticlePublisher from "./components/ArticlePublisher";

export default {
  name: "app",
  components: {
    ArticlePublisher
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
