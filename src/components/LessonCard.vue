<template>
  <div class="product-card">
    <div class="image-wrap">
      <!-- If lesson.img exists use it, otherwise show placeholder -->
      <!-- <img 
        :src="lesson.img || 'https://via.placeholder.com/300x200?text=Lesson+Image'" 
        :alt="lesson.title" 
        class="lesson-img" 
        loading="lazy" 
      /> -->

      <div class="card-overlay" aria-hidden="true">
        <h4 class="overlay-title">{{ lesson.title }}</h4>
        <p class="overlay-line">{{ lesson.location }}</p>
        <p class="overlay-line">£{{ lesson.price?.toFixed(2) }}</p>

        <!-- Updated to match backend field: lesson.space -->
        <p class="overlay-line">Spaces left: {{ lesson.space }}</p>

        <button 
          class="overlay-btn" 
          :disabled="lesson.space === 0" 
          @click="$emit('add-to-cart', lesson)"
        >
          {{ lesson.space === 0 ? 'No Space' : 'Add to Cart' }}
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
export default {
  name: "LessonCard",
  props: {
    lesson: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style src="../assets/style.css"></style>
