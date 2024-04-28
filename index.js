import { app } from "./app.js";

app.get("/", (req, res) => {
  res.send("Haan bhai chal rha hai");
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
