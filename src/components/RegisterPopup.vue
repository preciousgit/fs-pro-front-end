<template>
  <div v-if="show" class="overlay" @click.self="closePopup">
    <div class="login-box">
      <h2>Register</h2>
      <p v-if="error" class="error-message">{{ error }}</p>
      
      <form @submit.prevent="handleRegister">
        <label>Full Name</label>
        <input type="text" v-model="name" placeholder="Enter your full name" required />

        <label>Email</label>
        <input type="email" v-model="email" placeholder="Enter your email" required />

        <label>Password</label>
        <input type="password" v-model="password" placeholder="Create a password" required />

        <label>Confirm Password</label>
        <input type="password" v-model="confirmPassword" placeholder="Confirm your password" required />

        <button type="submit" class="btn-login">Register</button>
        <button type="button" class="btn-cancel" @click="closePopup">Cancel</button>
        
        <p class="switch-form">
          Already have an account? <a href="#" @click.prevent="switchToLogin">Log in here</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterPopup",
  props: ["show"],
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: ""
    };
  },
  methods: {
    handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match";
        return;
      }
      
      // Here you would typically make an API call to register the user
      console.log("Registration data:", {
        name: this.name,
        email: this.email,
        password: this.password
      });
      
      // For demo, we'll just close the popup and show login
      this.$emit('registered', { email: this.email });
      this.closePopup();
    },
    closePopup() {
      this.$emit("close");
    },
    switchToLogin() {
      this.$emit("switch-to-login");
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        // Reset form when shown
        this.name = "";
        this.email = "";
        this.password = "";
        this.confirmPassword = "";
        this.error = "";
      }
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: 500;
  color: #444;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-login, .btn-cancel {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-login {
  background-color: #4CAF50;
  color: white;
}

.btn-login:hover {
  background-color: #45a049;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}

.btn-cancel:hover {
  background-color: #d32f2f;
}

.switch-form {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.switch-form a {
  color: #4CAF50;
  text-decoration: none;
}

.switch-form a:hover {
  text-decoration: underline;
}

.error-message {
  color: #f44336;
  text-align: center;
  margin-bottom: 1rem;
}
</style>
