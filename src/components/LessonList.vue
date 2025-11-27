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
        v-for="lesson in sortedLessons"
        :key="lesson.id ?? lesson._id"
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
  computed: {
    sortedLessons() {
      const q = (this.searchLocal || "").toLowerCase();
      const getField = (lesson, field) => {
        if (field === 'topic') return (lesson.topic || lesson.title || '').toString();
        if (field === 'location') return (lesson.location || '').toString();
        if (field === 'price') return String(lesson.price ?? '');
        if (field === 'spaces') return String(lesson.availableSpaces ?? lesson.spaces ?? lesson.space ?? '');
        return String(lesson[field] ?? '');
      };

      let filtered = this.lessons.filter(lesson => {
        const topic = getField(lesson, 'topic').toLowerCase();
        const location = getField(lesson, 'location').toLowerCase();
        const spacesStr = String(lesson.availableSpaces ?? lesson.spaces ?? lesson.space ?? '');
        return topic.includes(q) || location.includes(q) || (String(lesson.price ?? '').includes(q)) || spacesStr.includes(q);
      });

      if (!this.sortAttributeLocal) return filtered;

      return filtered.slice().sort((a, b) => {
        const attr = this.sortAttributeLocal;
        let valA = getField(a, attr);
        let valB = getField(b, attr);

        // numeric sort for price/spaces
        if (attr === 'price' || attr === 'spaces') {
          const na = Number(valA) || 0;
          const nb = Number(valB) || 0;
          if (na < nb) return this.sortOrderLocal === 'asc' ? -1 : 1;
          if (na > nb) return this.sortOrderLocal === 'asc' ? 1 : -1;
          return 0;
        }

        // string comparison
        valA = (valA || '').toLowerCase();
        valB = (valB || '').toLowerCase();
        if (valA < valB) return this.sortOrderLocal === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortOrderLocal === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }
};
</script>

<style src="../assets/style.css"></style>
