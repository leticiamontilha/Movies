import { Request, Response } from "express";
import { QueryConfig } from "pg";
import  format from "pg-format";
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
        values: [movieDataRequest.name, movieDataRequest.description, movieDataRequest.duration, movieDataRequest.price]
    }

    const queryResult: MoviesResult = await client.query(queryConfig)

    const newMovie: Imovie = queryResult.rows[0]

    return response.status(201).json(newMovie)
}

export const listMovies = async (request: Request, response: Response): Promise<Response> => {
    
    let perPage: number = Number(request.query.perPage) || 5
    let page: number = Number(request.query.page) || 1 

    if (page <= 0 || typeof page !== "number"){
        page = 1
    }

    if( perPage <= 0 || typeof perPage !== "number" || perPage > 5 ){
        perPage = 5
    }

    let queryString: string = `
        SELECT  
        *
        FROM  
            movies
        LIMIT $1 OFFSET $2;
        `
    let queryConfig: QueryConfig = {
        text: queryString,
        values: [perPage, perPage * (page -1)]
    }

    if(request.query.sort === "duration" || request.query.sort === "price"){
        let order = "asc"

        if(request.query.order === "desc"){
            order = "desc"
        }

        queryString = format(
            `
            SELECT  
            *
            FROM  
                movies
            ORDER BY %I %s
            LIMIT $1 OFFSET $2;
            `,
            request.query.sort, 
            order
        )

        queryConfig = {
        text: queryString,
        values: [perPage, perPage * (page -1)]
        }
    }

    const queryResult: MoviesResult = await client.query(queryConfig)

    const baseUrl = "http://localhost:3000/movies"

    const objPag = {
        previousPage: page -1 < 1 ? null : `${baseUrl}?page=${page -1}&perPage=${perPage}`,
        nextPage: `${baseUrl}?page=${page +1}&perPage=${perPage}`,
        count: queryResult.rowCount,
        data: queryResult.rows
    }
    
    return response.status(200).json(objPag)
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