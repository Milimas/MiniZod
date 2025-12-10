import express from "express";
import cors from "cors";

export const app = express();
app.use(
  cors({
    origin: ["http://localhost:8080"],
  })
);
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello, World!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
