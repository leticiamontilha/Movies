import { Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { Imovie, IMovieRequest, MoviesResult } from "./interfaces";

export const createMovie = async (request: Request, response: Response): Promise<Response> => {
    
    const movieDataRequest: IMovieRequest = request.body

    const queryString = `
    INSERT INTO 
	    movies(name, description, duration, price)
    VALUES
        ($1, $2, $3, $4)
        RETURNING *;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: Object.values(movieDataRequest)
    }

    const queryResult: MoviesResult = await client.query(queryConfig)

    const newMovie: Imovie = queryResult.rows[0]

    return response.status(201).json(newMovie)
}

export const listMovies = async (request: Request, response: Response): Promise<Response> => {
    
    let perPage: any = request.query.per_page === undefined ? 5 : request.query.per_page
    let page: any = request.query.page === undefined ? 1 : request.query.page
    
    if (page <= 0 || perPage <= 0){
        page = 1
        perPage = 5
    }

    if (perPage > 5) {
        perPage = 5
    }

   
    const queryString: string = `
        SELECT  
        *
        FROM  
            movies
        LIMIT $1 OFFSET $2;
        `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [perPage, page]
    }

    const queryResult: MoviesResult = await client.query(queryConfig)
    
    return response.status(200).json(queryResult.rows)
}

export const updateMovie = async (request: Request, response:Response): Promise<Response> => {

    const movieData: Imovie = request.body
    const idMovie: number = +request.params.id

    const valuesMovie = Object.values(movieData)

    const queryString: string = `
        UPDATE movies SET
            name = $1,
            description = $2,
            duration = $3,
            price = $4
        WHERE 
            id = $5
        RETURNING *;
        `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [...valuesMovie, idMovie]
    }

    const queryResult: MoviesResult = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows[0])

}

export const deleteMovie = async (request: Request, response : Response,): Promise<Response> => {
    
    const idMovie: number = +request.params.id
    
    const queryString = `
        DELETE 
        FROM 
            movies 
        WHERE 
            id = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [idMovie]
    }

    await client.query(queryConfig)
   
    return response.status(204).send()
}