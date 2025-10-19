<template>
  <div v-if="show" class="overlay" @click.self="closePopup">
    <div class="login-box">
      <h2>Log In</h2>

      <form @submit.prevent="handleLogin">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="Enter your email" required />

        <label>Password</label>
        <input type="password" v-model="password" placeholder="Enter your password" required />

        <button type="submit" class="btn-login">Log In</button>
        <button type="button" class="btn-cancel" @click="closePopup">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPopup",
  props: ["show"],
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      console.log("Email:", this.email);
      console.log("Password:", this.password);
      alert("Login successful (frontend only)");
      this.closePopup();
    },
    closePopup() {
      this.$emit("close");
    },
  },
};
</script>

<style src="../assets/style.css"></style>
