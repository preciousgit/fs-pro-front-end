<template>
  <div class="app-container" :style="appBackgroundStyle">
    <Navbar
      :cart-count="cartItemCount"
      @toggle-cart="toggleCart"
      @show-login="showLogin = true"
      @go-home="goToIndex" 
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
import { fetchLessons, createOrder, updateLessonSpaces } from './services/api.js';
import Navbar from "./components/Navbar.vue";
import LessonList from "./components/LessonList.vue";
import CartPage from "./components/CartPage.vue";
import FooterSection from "./components/FooterSection.vue";
import LoginPopup from "./components/LoginPopup.vue";

// import Imgs
import bg1Image from "../src/assets/images/bg3.jpg";
import mths1Image from "../src/assets/images/mths1.jpg";
import sciLab2Image from "../src/assets/images/sci-lab2.jpg";
import music3Image from "../src/assets/images/music3.jpg";
import pgm1Image from "../src/assets/images/pgm1.jpg";
import artDImage from "../src/assets/images/art-d.jpg";
import fball1Image from "../src/assets/images/fball1.jpg";
import eLit1Image from "../src/assets/images/e-lit1.jpg";
import advMthsImage from "../src/assets/images/adv-mths.jpg";
import drama4Image from "../src/assets/images/drama4.jpg";
import robTec3Image from "../src/assets/images/rob-tec3.jpg";

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

      // background image 
      backgroundImage: bg1Image,

      lessons: [],

      cart: [],
      customerName: "",
      customerPhone: "",
      isNameValid: false,
      isPhoneValid: false,
      isCheckoutFormValid: false,
    };
  },

  async created() {
    await this.fetchLessons();
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
      // Build a derived list that does not mutate original lesson objects.
      // Each item will include `availableSpaces` = original spaces - reserved in cart.
      const list = this.lessons
        .map((p) => {
          const baseSpaces = Number(p.spaces ?? p.space ?? 0) || 0;
          const pid = p.id ?? p._id ?? (p._id?._id ?? p._id?.$oid);
          const reserved = (this.cart.find((c) => String(c.id) === String(pid))?.count) ?? 0;
          const availableSpaces = Math.max(0, baseSpaces - reserved);
          return Object.assign({}, p, { availableSpaces });
        })
        .filter((p) => {
          const matchCategory = this.selectedCategory === "All" || p.category === this.selectedCategory;
          const inTopic = (p.title || p.topic || "").toLowerCase().includes(q);
          const inLocation = (p.location || "").toLowerCase().includes(q);
          const inPrice = String(p.price ?? "").includes(q);
          const inSpaces = String(p.availableSpaces ?? p.spaces ?? p.space ?? "").includes(q);

          const matchSearch = q === "" || inTopic || inLocation || inPrice || inSpaces;
          return matchCategory && matchSearch;
        });

      if (this.sortAttribute) {
        list.sort((a, b) => {
          let av = a[this.sortAttribute];
          let bv = b[this.sortAttribute];
          // When sorting by spaces, prefer availableSpaces if present
          if (this.sortAttribute === 'spaces') {
            av = a.availableSpaces ?? a.spaces ?? a.space;
            bv = b.availableSpaces ?? b.spaces ?? b.space;
          }
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
        background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${this.backgroundImage}) center/cover no-repeat`
      };
    }
  },
  methods: {

    async fetchLessons() {
      try {
        const response = await fetchLessons();
        this.lessons = response;
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    },
    goToIndex() {
      this.searchQuery = "";
      this.sortAttribute = "";
      this.sortOrder = "asc";
      this.selectedCategory = "All";
      this.showCart = false;
    },
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
    // cart methods
    getLessonById(id) {
      const sid = id == null ? id : String(id);
      return this.lessons.find((p) => {
        const pid = p.id ?? p._id ?? p._id?._id ?? p._id?.$oid;
        return pid != null && String(pid) === sid;
      });
    },
    addToCart(lesson) {
      const lessonId = lesson.id ?? lesson._id ?? (lesson._id?._id ?? lesson._id?.$oid);
      const base = Number(lesson.spaces ?? lesson.space ?? 0) || 0;
      const reserved = (this.cart.find((c) => String(c.id) === String(lessonId))?.count) ?? 0;
      const available = Math.max(0, base - reserved);
      if (available <= 0) return;
      const existing = this.cart.find((c) => String(c.id) === String(lessonId));
      if (existing) existing.count += 1;
      else this.cart.push({ id: String(lessonId), title: lesson.title || lesson.topic || '', price: lesson.price, count: 1 });
    },
    decrementCartItem(cartItem) {
      const idx = this.cart.findIndex((c) => String(c.id) === String(cartItem.id));
      if (idx === -1) return;
      this.cart[idx].count--;
      if (this.cart[idx].count <= 0) this.cart.splice(idx, 1);
    },
    incrementCartItem(cartItem) {
      const lesson = this.getLessonById(cartItem.id);
      if (!lesson) return;
      const base = Number(lesson.spaces ?? lesson.space ?? 0) || 0;
      const reserved = (this.cart.find((c) => String(c.id) === String(lesson.id ?? lesson._id))?.count) ?? 0;
      const available = Math.max(0, base - reserved);
      if (available <= 0) return;
      const c = this.cart.find((x) => String(x.id) === String(cartItem.id));
      if (c) c.count++;
    },
    removeCartItem(cartItem) {
      const idx = this.cart.findIndex((c) => String(c.id) === String(cartItem.id));
      if (idx === -1) return;
      this.cart.splice(idx, 1);
    },
    // checkout methods
    validateCheckout() {
      const namePattern = /^[A-Za-z\s]+$/;
      this.isNameValid = namePattern.test(this.customerName.trim());
      const phonePattern = /^\d+$/;
      this.isPhoneValid = phonePattern.test(this.customerPhone.trim());
      this.isCheckoutFormValid = this.isNameValid && this.isPhoneValid && this.cart.length > 0;
    },

    async confirmCheckout() {
      this.validateCheckout();
      if (!this.isCheckoutFormValid) return;

      try {

        const orderData = {
          name: this.customerName,
          phone: this.customerPhone,
          lessonIDs: this.cart.map((item) => item.id),
          numberOfSpace: this.cart.reduce((sum, item) => sum + item.count, 0),
        };

        await createOrder(orderData);

      const updates = this.cart.map((item) => {
        const lesson = this.getLessonById(item.id);
        const current = Number(lesson?.spaces ?? lesson?.space ?? 0) || 0;
        const newSpaces = Math.max(0, current - item.count);
        return updateLessonSpaces(item.id, newSpaces);
      });


        await Promise.all(updates);

        this.cart = [];
        this.customerName = "";
        this.customerPhone = "";
        this.showCart = false;

        await this.fetchLessons();

        alert("Order placed successfully!");
      } catch (error) {
        console.error("Checkout failed:", error);
        alert("Failed to place order. Please try again.");
      }
    },
  },
};
</script>

<style src="../src/assets/style.css"></style>