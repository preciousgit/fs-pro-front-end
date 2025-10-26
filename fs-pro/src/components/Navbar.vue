<template>
  <nav class="navbar">
    <div class="brand" @click="$emit('go-home')">Knowfinity</div>
    <div class="nav-actions">
      <button class="action-btn login-btn" @click="$emit('show-login')">
        <font-awesome-icon :icon="['fas','arrow-right-to-bracket']" />
      </button>
      <button class="cart-btn" @click="$emit('toggle-cart')" :disabled="cartCount === 0">
        <font-awesome-icon :icon="['fas','shopping-cart']" />
        <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  props: { cartCount: { type: Number, default: 0 } },
};
</script>

<style src="../assets/style.css"></style>