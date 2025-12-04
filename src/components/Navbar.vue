<template>
  <nav class="navbar">
    <div class="brand" @click="$emit('go-home')">Knowfinity</div>
    <div class="nav-actions">
      <template v-if="isAuthenticated">
        <span class="user-email">
          <font-awesome-icon :icon="['fas','user']" class="user-icon" />
          {{ currentUser?.email }}
        </span>
        <button class="action-btn logout-btn" @click="handleLogout">
          <font-awesome-icon :icon="['fas','right-from-bracket']" />
        </button>
      </template>
      <button v-else class="action-btn login-btn" @click="$emit('show-login')">
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
  props: { 
    cartCount: { 
      type: Number, 
      default: 0 
    },
    isAuthenticated: {
      type: Boolean,
      default: false
    },
    currentUser: {
      type: Object,
      default: null
    }
  },
  methods: {
    handleLogout() {
      this.$emit('logout');
    }
  }
};
</script>

<style scoped>
.user-email {
  margin-right: 15px;
  color: #333;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-icon {
  color: grey;
  font-size: 1rem;
}

.logout-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 5px 10px;
  transition: color 0.2s;
}

.logout-btn:hover {
  color: #c82333;
}
</style>

<style src="../assets/style.css"></style>