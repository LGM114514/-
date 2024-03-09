<template>
  <div class="welcome-page">
    <div class="content">
      <h1>Welcome</h1>
      <p>Explore the amazing features of our website.</p>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.welcome-page {
  background-image: url('/imgs/background/JX.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.content {
  text-align: center;
  color: #fff;
}

h1 {
  font-size: 5em;
  margin-bottom: 10px;
}

p {
  font-size: 2em;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
