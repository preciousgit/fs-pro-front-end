<template>
  <div class="product-card">
    <div class="image-wrap">
      <img :src="lesson.img" :alt="lesson.topic" class="lesson-img" loading="lazy" />
      <div class="card-overlay" aria-hidden="true">
        <h4 class="overlay-title">{{ lesson.topic }}</h4>
        <p class="overlay-line">{{ lesson.location }}</p>
        <p class="overlay-line">£{{ lesson.price.toFixed(2) }}</p>
        <p class="overlay-line">Spaces: {{ lesson.spaces }}</p>
        <button class="overlay-btn" :disabled="lesson.spaces === 0" @click="$emit('add-to-cart', lesson)">
          {{ lesson.spaces === 0 ? 'No Space' : 'Add to Cart' }}
        </button>
      </div>
    </div>

    <div class="card-footer">
      <h3 class="card-title">{{ lesson.topic }}</h3>
      <p class="card-sub">hover for more info or details</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LessonCard",
  props: { lesson: { type: Object, required: true } },
};
</script>

<style src="../assets/style.css"></style>