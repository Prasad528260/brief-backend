import app from "./src/app.js"
import dotenv from "dotenv"
import connectDB from "./src/config/db.js"
import authRouter from "./src/routes/authRouter.js"
import summaryRouter from "./src/routes/summaryRouter.js"
import profileRouter from "./src/routes/profileRouter.js"
dotenv.config()



// Routes
app.use("/auth",authRouter)
app.use('/summary',summaryRouter)
app.use('/profile',profileRouter)


app.get("/", (req, res) => {
  res.send("Welcome to BriefAi");
});



const PORT = process.env.PORT || 5000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`)
    })
}).catch((error) => {
    console.log("SERVER START FAILED",error)
    throw new Error("SERVER START FAILED",error)
})
