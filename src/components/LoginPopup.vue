<template>
  <div v-if="show" class="overlay" @click.self="closePopup">
    <div class="login-box">
      <h2>Welcome Back</h2>
      <p v-if="error" class="error-message">{{ error }}</p>

      <form @submit.prevent="handleLogin">
        <label>Email</label>
        <input 
          type="email" 
          v-model="email" 
          placeholder="Enter your email" 
          required 
        />

        <label>Password</label>
        <input 
          type="password" 
          v-model="password" 
          placeholder="Enter your password" 
          required
        />

        <button type="submit" class="btn-login">Log In</button>
        
        <p class="switch-form">
          Don't have an account? 
          <a href="#" @click.prevent="switchToRegister">Register here</a>
        </p>
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
      error: ""
    };
  },
  methods: {
    handleLogin() {
      // Basic validation
      if (!this.email || !this.password) {
        this.error = "Please fill in all fields";
        return;
      }
      
      // Here you would typically make an API call to authenticate
      console.log("Login attempt with:", {
        email: this.email,
        password: this.password
      });
      
      // For demo, we'll just emit a login event
      this.$emit('login', { email: this.email });
      this.closePopup();
    },
    closePopup() {
      this.error = "";
      this.$emit("close");
    },
    switchToRegister() {
      this.$emit("switch-to-register");
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        // Reset form when shown
        this.email = "";
        this.password = "";
        this.error = "";
      }
    }
  }
};
</script>

<style>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: rgba(0, 0, 0, 0.7); */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.942);
  backdrop-filter: blur(5px);
}

.login-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.8rem;
  font-size: 1.8rem;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.3rem;
  font-size: 0.95rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-login {
  background: #0078ff;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.8rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 6px rgba(0, 120, 255, 0.2);
}

.btn-login:hover {
  background: #0066e0;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(0, 120, 255, 0.25);
}

.btn-login:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 120, 255, 0.2);
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
  margin-top: 1.5rem;
  color: #555;
  font-size: 0.95rem;
}

.switch-form a {
  color: black;
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
