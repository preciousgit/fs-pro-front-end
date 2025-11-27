<template>
  <div class="cart-page">
    <h2>Your Cart</h2>

    <div v-if="cart.length === 0" class="empty-cart">Your cart is empty</div>

    <ul v-else class="cart-items">
      <li v-for="item in cart" :key="item.id" class="cart-item">
        <div class="cart-item-image">
          <img :src="getImageUrl(item)" :alt="item.title" class="item-image" />
        </div>

        <div class="cart-item-info">
          <strong>{{ item.title }}</strong>
          <div>£{{ item.price.toFixed(2) }} × {{ item.count }}</div>
        </div>

        <div class="item-actions">
          <button @click="$emit('decrement', item)" class="btn-minus">
            <font-awesome-icon :icon="['fas','minus']" />
          </button>

          <button @click="$emit('increment', item)" class="btn-plus">
            <font-awesome-icon :icon="['fas','plus']" />
          </button>

          <button @click="$emit('remove', item)" class="btn-remove">
            <font-awesome-icon :icon="['fas','trash']" />
          </button>
        </div>
      </li>
    </ul>

    <div class="cart-summary" v-if="cart.length > 0">
      <p><strong>Total:</strong> £{{ cartTotal.toFixed(2) }}</p>

      <slot name="checkout">
        <div class="checkout-default">
          <div class="form-group">
            <label>Full name</label>
            <input
              v-model="localName"
              @input="validateCheckout"
              placeholder="Letters only"
              :class="{ 'invalid': nameError && localName }"
            />
            <span class="error-message" v-if="nameError && localName">
              Name must contain only letters
            </span>
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input
              v-model="localPhone"
              @input="validateCheckout"
              placeholder="Digits only"
              :class="{ 'invalid': phoneError && localPhone }"
            />
            <span class="error-message" v-if="phoneError && localPhone">
              Phone must contain only numbers
            </span>
          </div>

          <button
            class="checkout-btn"
            :disabled="!isCheckoutFormValid"
            @click="handleConfirmCheckout"
          >
            Checkout
          </button>
        </div>
      </slot>
    </div>

    <button class="back-btn" @click="$emit('back')">
      <font-awesome-icon :icon="['fas','arrow-left']" /> Back to Lessons
    </button>
  </div>
</template>

<script>
import { API_BASE_URL } from '../services/api.js';

export default {
  name: "CartPage",
  props: {
    cart: { type: Array, default: () => [] },
    cartTotal: { type: Number, default: 0 },
    customerName: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
  },
  emits: [
    "decrement",
    "increment",
    "remove",
    "confirm-checkout",
    "back",
    "validate",
    "update:customerName",
    "update:customerPhone",
  ],
  data() {
    return {
      localName: this.customerName,
      localPhone: this.customerPhone,
      nameError: false,
      phoneError: false,
      isCheckoutFormValid: false,
    };
  },
  watch: {
    localName(v) {
      this.$emit("update:customerName", v);
      this.$emit("validate");
    },
    localPhone(v) {
      this.$emit("update:customerPhone", v);
      this.$emit("validate");
    },
    customerName(v) {
      this.localName = v;
    },
    customerPhone(v) {
      this.localPhone = v;
    },
  },
  methods: {
    getImageUrl(item) {
      const img = item.img || '';
      if (!img) return null;
      console.log('CartPage - Item img:', img, 'API_BASE_URL:', API_BASE_URL);
      // If it's already a full URL, return as-is
      if (/^https?:/.test(img)) {
        return img;
      }
      //  construct from API_BASE_URL + img path for relative paths     
      const trimmed = img.replace(/^\//, '');
      const url = `${API_BASE_URL}/${trimmed}`;
      console.log('Constructed URL:', url);
      return url;
    },

    validateCheckout() {      
      const namePattern = /^[A-Za-z\s]+$/;
      const phonePattern = /^\d+$/;

      this.nameError = !namePattern.test(this.localName.trim());
      this.phoneError = !phonePattern.test(this.localPhone.trim());

      this.isCheckoutFormValid =
        !this.nameError &&
        !this.phoneError &&
        this.localName.trim() !== "" &&
        this.localPhone.trim() !== "" &&
        this.cart.length > 0;

      this.$emit("update:customerName", this.localName);
      this.$emit("update:customerPhone", this.localPhone);
      this.$emit("validate");
    },

    handleConfirmCheckout() {
      if (!this.isCheckoutFormValid) return;

      this.$emit("confirm-checkout", {
        name: this.localName,
        phone: this.localPhone,
        items: this.cart,
      });
    },
  },
};
</script>

<style src="../assets/style.css"></style>

