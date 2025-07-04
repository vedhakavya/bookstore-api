const app = require("./app");
const PORT = 3000;

app.listen(PORT, () => {
  console.log(process.env.JWT_SECRET);
  console.log(`Server running on http://localhost:${PORT}`);
});
