<template>
  <div class="product-card">
    <div class="image-wrap">
      <!-- If lesson.img exists use it (from backend), otherwise show placeholder -->
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="lesson.title || lesson.topic || 'Lesson image'"
        class="lesson-img"
        loading="lazy"
      />
      <img
        v-else
        src="https://via.placeholder.com/300x200?text=Lesson+Image"
        alt="placeholder"
        class="lesson-img"
        loading="lazy"
      />

      <div class="card-overlay" aria-hidden="true">
        <h4 class="overlay-title">{{ lesson.title || lesson.topic }}</h4>
        <p class="overlay-line">{{ lesson.location || '' }}</p>
        <p class="overlay-line">£{{ (lesson.price ?? 0).toFixed(2) }}</p>

        <!-- Prefer derived availableSpaces if present, otherwise fallback to spaces/space -->
        <p class="overlay-line">Spaces left: {{ lesson.availableSpaces ?? lesson.spaces ?? lesson.space ?? 0 }}</p>

        <button 
          class="overlay-btn" 
          :disabled="(lesson.availableSpaces ?? lesson.spaces ?? lesson.space ?? 0) === 0" 
          @click="$emit('add-to-cart', lesson)"
        >
          {{ (lesson.availableSpaces ?? lesson.spaces ?? lesson.space ?? 0) === 0 ? 'No Space' : 'Add to Cart' }}
        </button>
      </div>
    </div>

    <div class="card-footer">
      <h3 class="card-title">{{ lesson.title }}</h3>
      <p class="card-sub">Hover for more info or details</p>
    </div>
  </div>
</template>

<script>
import { API_BASE_URL } from '../services/api.js';
export default {
  name: "LessonCard",
  props: {
    lesson: {
      type: Object,
      required: true,
    },
  },
  computed: {
    imageUrl() {
      const img = this.lesson?.img || this.lesson?.image || this.lesson?.imgUrl;
      if (!img) return null;
      // If image is already an absolute URL, return it.
      if (/^https?:\/\//i.test(img)) return img;
      // Ensure no leading slash duplication
      const trimmed = img.replace(/^\//, '');
      return `${API_BASE_URL}/${trimmed}`;
    }
  }
};
</script>

<style src="../assets/style.css"></style>
