<template>
  <div class="chatbot" :class="{ open: isOpen }">
    <!-- Chat Header -->
    <div class="chat-header" @click="toggleChat">
        <span class="title">
            <font-awesome-icon :icon="['fas','comment']" /> 
            AI Agent
        </span>
      <button
        v-if="isOpen"
        class="close-btn"
        @click.stop="toggleChat"
      >
        &times;
      </button>
    </div>

    <!-- Chat Body -->
    <div v-if="isOpen" class="chat-body">
      <div class="messages">
        <div v-for="(msg, i) in messages" :key="i" :class="msg.role">
          {{ msg.text }}
        </div>
      </div>
      <div class="chat-input">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Ask me anything..."
        />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatBot",
  data() {
    return {
      isOpen: false,
      userInput: "",
      messages: [],
    };
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
    },
    async sendMessage() {
      if (!this.userInput.trim()) return;
      const question = this.userInput;
      this.messages.push({ role: "user", text: question });
      this.userInput = "";

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      this.messages.push({ role: "bot", text: data.answer });
    },
  },
};
</script>

<style>
.chatbot {
  position: fixed;
  bottom: 70px;
  right: 20px;
  font-family: sans-serif;
  z-index: 10000;
}

/* Header */
.chat-header {
  background: #0177ff;
  color: white;
  padding: 10px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.chat-header .title {
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 23px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: red;
}

/* Chat Window */
.chat-body {
  width: 320px;
  height: 400px;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  display: flex;
  flex-direction: column;
  border-radius: 0 0 8px 8px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.user {
  text-align: right;
  margin: 5px;
  color: #0177ff;
}

.bot {
  text-align: left;
  margin: 5px;
  color: #333;
}

.chat-input {
  display: flex;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex: 1;
  border: none;
  padding: 8px;
  outline: none;
}

.chat-input button {
  background: #0177ff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-bottom-right-radius: 8px;
  cursor: pointer;
}

.chat-input button:hover {
  background: #005fcc;
}
</style>
