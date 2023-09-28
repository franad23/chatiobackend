import httpServer from "./app";
import connectDB from "./db";

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

connectDB();