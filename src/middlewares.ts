import { Request, Response, NextFunction, request } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { IMovieRequest, MoviesResult, Imovie } from "./interfaces";

export const movieNameExist = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {

    const movieDataRequest: IMovieRequest = request.body

    const queryString = `
        SELECT  
            *
        FROM
            movies
        WHERE
            name = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [movieDataRequest.name]
    }

    const queryResult: MoviesResult = await client.query(queryConfig)

    const nameExist = queryResult.rows.find(el => el.name === movieDataRequest.name)

    if(nameExist){
        return response.status(409).json({
         message: `O filme ${movieDataRequest.name} já existe`
        })
    }

    return next()
}

export const idMovieExist = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    
    const idMovie: number = +request.params.id

    const queryString = `
        SELECT  
            *
        FROM
            movies
        WHERE
            id = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [idMovie]
    }

    const queryResult: MoviesResult = await client.query(queryConfig)

    const idExist = queryResult.rows.find(el => el.id === idMovie)

    if(!idExist){
        return response.status(404).json({
         message: "O filme não existe"
        })
    }

    return next()  
}