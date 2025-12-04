<template>
  <div class="app-container" :style="appBackgroundStyle">
    <!-- Order Confirmation Popup -->
    <div v-if="showOrderConfirmation" class="confirmation-overlay" @click.self="closeConfirmation">
      <div class="confirmation-popup">
        <div class="confirmation-icon">
          <font-awesome-icon :icon="['fas', 'check-circle']" />
        </div>
        <h3>Order Confirmed!</h3>
        <p>Your order has been placed successfully.</p>
        <p>Thank you for your purchase!</p>
        <button @click="closeConfirmation" class="confirmation-close-btn">Close</button>
      </div>
    </div>
    
    <!-- Show login form by default if not authenticated -->
    <div v-if="!isAuthenticated" class="auth-container" style="width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center;">
      <LoginPopup 
        :show="true" 
        @close="closeAuth"
        @login="handleLogin"
        @switch-to-register="() => { showRegister = true; }"
      />
      <RegisterPopup
        :show="showRegister"
        @close="closeAuth"
        @registered="handleRegistration"
        @switch-to-login="() => { showRegister = false; }"
      />
    </div>

    <!-- Main app content (only shown when authenticated) -->
    <div v-else class="app-content">
      <div class="main-wrapper">
        <Navbar
          :cart-count="cartItemCount"
          :is-authenticated="isAuthenticated"
          :current-user="currentUser"
          @toggle-cart="toggleCart"
          @logout="handleLogout"
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
                @validate="onValidateCheckout"
              />
            </main>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  </div>
</template>

<script>
import { fetchLessons, createOrder, updateLessonSpaces } from './services/api.js';
import Navbar from "./components/Navbar.vue";
import LessonList from "./components/LessonList.vue";
import CartPage from "./components/CartPage.vue";
import FooterSection from "./components/FooterSection.vue";
import LoginPopup from "./components/LoginPopup.vue";
import RegisterPopup from "./components/RegisterPopup.vue";

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
  components: { 
    Navbar, 
    LessonList, 
    CartPage, 
    FooterSection, 
    LoginPopup, 
    RegisterPopup 
  },
  data() {
    return {
      // Authentication state
      isAuthenticated: false,
      currentUser: null,
      showLogin: true, // Show login by default
      showRegister: false,
      
      // App state
      searchQuery: "",
      sortAttribute: "",
      sortOrder: "asc",
      selectedCategory: "All",
      showCart: false,

      // background image 
      backgroundImage: bg1Image,

      // Order confirmation
      showOrderConfirmation: false,

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
    console.log('App created - checking auth state');
    // Clear any existing auth state for testing
    // localStorage.removeItem('currentUser');
    
    // Check if user is already logged in (e.g., from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    console.log('Stored user:', storedUser);
    
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        this.isAuthenticated = true;
        this.showLogin = false;
        console.log('User is authenticated:', this.currentUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('currentUser');
      }
    } else {
      console.log('No stored user, showing login form');
      this.isAuthenticated = false;
      this.showLogin = true;
    }
    
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
    // Authentication methods
    handleLogin(credentials) {
      console.log('Handling login with:', credentials);
      // In a real app, you would validate credentials against your backend
      this.currentUser = { email: credentials.email };
      this.isAuthenticated = true;
      this.showLogin = false;
      
      // Store user in localStorage to persist login
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      console.log('User logged in and stored in localStorage');
    },
    
    handleRegistration(userData) {
      // In a real app, you would register the user with your backend
      console.log('Register user:', userData);
      
      // Show success message
      alert('Registration successful! Please log in to continue.');
      
      // Switch to login form
      this.showRegister = false;
      this.showLogin = true;
    },
    
    handleLogout() {
      this.isAuthenticated = false;
      this.currentUser = null;
      this.showLogin = true;
      localStorage.removeItem('currentUser');
    },
    
    closeAuth() {
      this.showLogin = false;
      this.showRegister = false;
    },
    
    closeConfirmation() {
      this.showOrderConfirmation = false;
    },

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
      else this.cart.push({ id: String(lessonId), title: lesson.title || lesson.topic || '', price: lesson.price, img: lesson.img || '', count: 1 });
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
      // Only validate if we have the necessary data
      if (this.customerName !== undefined && this.customerPhone !== undefined) {
        const namePattern = /^[A-Za-z\s]+$/;
        this.isNameValid = namePattern.test(this.customerName.trim());
        const phonePattern = /^\d+$/;
        this.isPhoneValid = phonePattern.test(this.customerPhone.trim());
        this.isCheckoutFormValid = this.isNameValid && this.isPhoneValid && this.cart.length > 0;
      } else {
        // If we don't have the data yet, assume invalid
        this.isCheckoutFormValid = false;
      }
      console.log('Validation in App.vue:', {
        name: this.customerName,
        nameValid: this.isNameValid,
        phone: this.customerPhone,
        phoneValid: this.isPhoneValid,
        cartItems: this.cart.length,
        isCheckoutFormValid: this.isCheckoutFormValid
      });
    },
    
    onValidateCheckout() {
      // Re-validate with current form data
      this.validateCheckout();
    },
    
    async confirmCheckout(payload) {
      console.log('confirmCheckout called in App.vue with payload:', payload);
      
      // Use the data from the payload instead of component's data properties
      const { name, phone, items } = payload;
      
      // Update local state with the latest values
      this.customerName = name;
      this.customerPhone = phone;
      
      // Re-validate with the latest data
      this.validateCheckout();
      
      if (!this.isCheckoutFormValid) {
        console.log('Form is not valid, aborting checkout');
        return;
      }

      try {
        const orderData = {
          name: name,
          phone: phone,
          lessonIDs: items.map((item) => item.id),
          numberOfSpace: items.reduce((sum, item) => sum + item.count, 0),
        };
        
        console.log('Creating order with data:', orderData);
        await createOrder(orderData);
        console.log('Order created successfully');

        const updates = items.map((item) => {
          const lesson = this.getLessonById(item.id);
          const current = Number(lesson?.spaces ?? lesson?.space ?? 0) || 0;
          const newSpaces = Math.max(0, current - item.count);
          console.log(`Updating lesson ${item.id} spaces from ${current} to ${newSpaces}`);
          return updateLessonSpaces(item.id, newSpaces);
        });

        console.log('Updating lesson spaces...');
        await Promise.all(updates);
        console.log('Lesson spaces updated');

        // Clear cart and form
        this.cart = [];
        this.customerName = "";
        this.customerPhone = "";
        this.showCart = false;

        console.log('Refreshing lessons...');
        await this.fetchLessons();

        console.log('Showing order confirmation');
        this.showOrderConfirmation = true;
      } catch (error) {
        console.error("Checkout failed:", error);
        alert("Failed to place order. Please try again.");
      }
    },
  },
};
</script>

<style>
/* Confirmation Popup */
.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.confirmation-popup {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: popIn 0.3s ease-out;
}

.confirmation-icon {
  font-size: 4rem;
  color: #4CAF50;
  margin-bottom: 1rem;
}

.confirmation-popup h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
}

.confirmation-popup p {
  color: #666;
  margin: 0.5rem 0;
  line-height: 1.5;
}

.confirmation-close-btn {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirmation-close-btn:hover {
  background-color: #45a049;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Auth Container */
.auth-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/images/bg3.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1000;
}

/* Make sure the login popup is on top */
.login-box {
  position: relative;
  z-index: 1001;
}
</style>
