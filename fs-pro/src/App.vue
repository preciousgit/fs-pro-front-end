<template>
  <div class="app-container" :style="appBackgroundStyle">
    <Navbar
      :cart-count="cartItemCount"
      @toggle-cart="toggleCart"
      @show-login="showLogin = true"
    />

    <div class="content">
      <div class="content-inner">
        <main class="main-section">
          <LessonList
            v-if="!showCart"
            :lessons="filteredAndSortedLessons"
            @add-to-cart="addToCart"
            :search.sync="searchQuery"
            :sort-attribute.sync="sortAttribute"
            :sort-order.sync="sortOrder"
          />

          <CartPage
            v-else
            :cart="cart"
            :cart-total="cartTotal"
            @decrement="decrementCartItem"
            @increment="incrementCartItem"
            @remove="removeCartItem"
            @confirm-checkout="confirmCheckout"
            @back="toggleCart"
            :customer-name.sync="customerName"
            :customer-phone.sync="customerPhone"
            :is-name-valid="isNameValid"
            :is-phone-valid="isPhoneValid"
            :is-valid="isCheckoutFormValid"
            @validate="validateCheckout"
          />
        </main>
      </div>
    </div>

    <LoginPopup :show="showLogin" @close="showLogin = false" />
    <FooterSection />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import LessonList from "./components/LessonList.vue";
import CartPage from "./components/CartPage.vue";
import FooterSection from "./components/FooterSection.vue";
import LoginPopup from "./components/LoginPopup.vue";

export default {
  name: "App",
  components: { Navbar, LessonList, CartPage, FooterSection, LoginPopup },
  data() {
    return {
      showLogin: false,
      searchQuery: "",
      sortAttribute: "",
      sortOrder: "asc",
      selectedCategory: "All",
      showCart: false,

      // background image used across whole app (navbar + body)
      backgroundImage: require("./assets/images/bg1.jpg"),

      lessons: [
        { id: 1, topic: "Mathematics", location: "Hendon", price: 100, spaces: 5, img: require('./assets/images/mths1.jpg'), category: "Math" },
        { id: 2, topic: "Science Lab", location: "Colindale", price: 95, spaces: 5, img: require('./assets/images/sci-lab1.jpg'), category: "Science" },
        { id: 3, topic: "Music", location: "Brent Cross", price: 80, spaces: 5, img: require('./assets/images/music1.jpg'), category: "Music" },
        { id: 4, topic: "Programming", location: "Online", price: 120, spaces: 5, img: require('./assets/images/pgm1.jpg'), category: "Coding" },
        { id: 5, topic: "Art & Design", location: "Golders Green", price: 70, spaces: 5, img: require('./assets/images/art-d.jpg'), category: "Arts" },
        { id: 6, topic: "Football", location: "Hendon", price: 50, spaces: 5, img: require('./assets/images/fball1.jpg'), category: "Sports" },
        { id: 7, topic: "English Literature", location: "Colindale", price: 85, spaces: 5, img: require('./assets/images/e-lit1.jpg'), category: "English" },
        { id: 8, topic: "Advanced Maths", location: "Brent Cross", price: 130, spaces: 5, img: require('./assets/images/adv-mths.jpg'), category: "Math" },
        { id: 9, topic: "Drama Club", location: "Golders Green", price: 60, spaces: 5, img: require('./assets/images/drama3.jpg'), category: "Arts" },
        { id: 10, topic: "Robotics and Tech", location: "Online", price: 140, spaces: 5, img: require('./assets/images/rob-tec2.jpg'), category: "Coding" },
      ],

      cart: [],
      customerName: "",
      customerPhone: "",
      isNameValid: false,
      isPhoneValid: false,
      isCheckoutFormValid: false,
    };
  },
  computed: {
    cartItemCount() {
      return this.cart.reduce((sum, it) => sum + it.count, 0);
    },
    cartTotal() {
      return this.cart.reduce((sum, it) => sum + it.price * it.count, 0);
    },
    filteredAndSortedLessons() {
      const q = this.searchQuery.trim().toLowerCase();
      let list = this.lessons.filter((p) => {
        const matchCategory = this.selectedCategory === "All" || p.category === this.selectedCategory;
        const inTopic = p.topic.toLowerCase().includes(q);
        const inLocation = p.location.toLowerCase().includes(q);
        const inPrice = String(p.price).includes(q);
        const inSpaces = String(p.spaces).includes(q);
        const matchSearch = q === "" || inTopic || inLocation || inPrice || inSpaces;
        return matchCategory && matchSearch;
      });

      if (this.sortAttribute) {
        list.sort((a, b) => {
          let av = a[this.sortAttribute];
          let bv = b[this.sortAttribute];
          if (typeof av === "string") av = av.toLowerCase();
          if (typeof bv === "string") bv = bv.toLowerCase();
          if (av < bv) return this.sortOrder === "asc" ? -1 : 1;
          if (av > bv) return this.sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }
      return list;
    },
    appBackgroundStyle() {
      return {
        background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${this.backgroundImage}) center/cover fixed no-repeat`
      };
    }
  },
  methods: {
    toggleCart() {
      this.showCart = !this.showCart;
      if (!this.showCart) {
        this.customerName = "";
        this.customerPhone = "";
        this.isNameValid = false;
        this.isPhoneValid = false;
        this.isCheckoutFormValid = false;
      }
    },
    getLessonById(id) {
      return this.lessons.find((p) => p.id === id);
    },
    addToCart(lesson) {
      if (lesson.spaces <= 0) return;
      lesson.spaces--;
      const existing = this.cart.find((c) => c.id === lesson.id);
      if (existing) existing.count++;
      else this.cart.push({ id: lesson.id, topic: lesson.topic, price: lesson.price, count: 1 });
    },
    decrementCartItem(cartItem) {
      const idx = this.cart.findIndex((c) => c.id === cartItem.id);
      if (idx === -1) return;
      this.cart[idx].count--;
      const lesson = this.getLessonById(cartItem.id);
      if (lesson) lesson.spaces++;
      if (this.cart[idx].count <= 0) this.cart.splice(idx, 1);
    },
    incrementCartItem(cartItem) {
      const lesson = this.getLessonById(cartItem.id);
      if (!lesson || lesson.spaces <= 0) return;
      lesson.spaces--;
      const c = this.cart.find((x) => x.id === cartItem.id);
      if (c) c.count++;
    },
    removeCartItem(cartItem) {
      const idx = this.cart.findIndex((c) => c.id === cartItem.id);
      if (idx === -1) return;
      const lesson = this.getLessonById(cartItem.id);
      if (lesson) lesson.spaces += this.cart[idx].count;
      this.cart.splice(idx, 1);
    },
    validateCheckout() {
      const namePattern = /^[A-Za-z\s]+$/;
      this.isNameValid = namePattern.test(this.customerName.trim());
      const phonePattern = /^\d+$/;
      this.isPhoneValid = phonePattern.test(this.customerPhone.trim());
      this.isCheckoutFormValid = this.isNameValid && this.isPhoneValid && this.cart.length > 0;
    },
    confirmCheckout(payload) {
      // payload optional; keep current behaviour
      this.validateCheckout();
      if (!this.isCheckoutFormValid) return;
      alert(`Thank you ${this.customerName}! Your order of £${this.cartTotal.toFixed(2)} has been submitted.`);
      this.cart = [];
      this.customerName = "";
      this.customerPhone = "";
      this.isNameValid = false;
      this.isPhoneValid = false;
      this.isCheckoutFormValid = false;
      this.showCart = false;
    },
  },
};
</script>

<style src="../src/assets/style.css"></style>