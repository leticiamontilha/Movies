import { QueryResult } from "pg"

export interface IMovieRequest {
    name: string,
    description: string,
    duration: number,
    price: number
}

export interface Imovie extends IMovieRequest {
    id: number
}

export type MoviesResult = QueryResult<Imovie>