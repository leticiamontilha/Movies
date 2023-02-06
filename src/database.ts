import { Client } from "pg"

export const client: Client = new Client ({
    user: "Tiliz",
    password: "montilhas2",
    host: "localhost",
    database: "m4_entrega_movies",
    port: 5432
})

export const starDataBase = async(): Promise<void> => {
    await client.connect()
    console.log("DataBase conected!")
}