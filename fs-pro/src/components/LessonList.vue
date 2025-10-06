<template>
  <div>
    <div class="controls">
      <input v-model="searchLocal" class="search-bar" placeholder="Search lessons..." />
      <div class="sort-controls">
        <select v-model="sortAttributeLocal" class="sort-select">
          <option value="">Sort by</option>
          <option value="topic">Subject</option>
          <option value="location">Location</option>
          <option value="price">Price</option>
          <option value="spaces">Spaces</option>
        </select>
        <select v-model="sortOrderLocal" class="sort-select">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <div class="product-grid">
      <LessonCard
        v-for="lesson in lessons"
        :key="lesson.id"
        :lesson="lesson"
        @add-to-cart="$emit('add-to-cart', $event)"
      />
    </div>
  </div>
</template>

<script>
import LessonCard from "./LessonCard.vue";

export default {
  name: "LessonList",
  components: { LessonCard },
  props: {
    lessons: { type: Array, default: () => [] },
    search: { type: String, default: "" },
    sortAttribute: { type: String, default: "" },
    sortOrder: { type: String, default: "asc" },
  },
  emits: ["add-to-cart", "update:search", "update:sortAttribute", "update:sortOrder"],
  data() {
    return {
      searchLocal: this.search,
      sortAttributeLocal: this.sortAttribute,
      sortOrderLocal: this.sortOrder,
    };
  },
  watch: {
    searchLocal(v) { this.$emit("update:search", v); },
    sortAttributeLocal(v) { this.$emit("update:sortAttribute", v); },
    sortOrderLocal(v) { this.$emit("update:sortOrder", v); },
    search(v) { this.searchLocal = v; },
    sortAttribute(v) { this.sortAttributeLocal = v; },
    sortOrder(v) { this.sortOrderLocal = v; },
  },
};
</script>

<style src="../assets/style.css"></style>