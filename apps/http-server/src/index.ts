import express from 'express';

const app = express();

app.get("/signup", (req, res) => {
  res.send("Signup Page");
});

app.get("/login", (req, res) => {
  res.send("Login Page");
});

app.get("/chat", (req, res) => {
  res.send("Chat Page");
});

const PORT =3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

