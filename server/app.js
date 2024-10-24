// AIzaSyDwAnkoH_Ko61UXRsEIJarrBl4-d8pCe8c
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
const app = express();
app.use(express.json());
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  const genAI = new GoogleGenerativeAI(
    process.env.API_KEY
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);

  res.send({ message: "success", result: result });
});
// test commit
