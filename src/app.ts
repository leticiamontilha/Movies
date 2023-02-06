import express, { Application } from "express";
import { starDataBase } from "./database";
import { createMovie, deleteMovie, listMovies, updateMovie } from "./functions";
import { idMovieExist, movieNameExist } from "./middlewares";

const app: Application = express()
app.use(express.json())

app.post("/movies", movieNameExist, createMovie)
app.get("/movies", listMovies)
app.patch("/movies/:id", idMovieExist, movieNameExist, updateMovie)
app.delete("/movies/:id", idMovieExist, deleteMovie)

app.listen(3000, async () => {
    await starDataBase()
    console.log("server is running!")
})