import { manyOrNone, oneOrNone } from '../../db/index'
import { getSelectAllGamesQuery, getSelectGameByIdQuery } from '../../sql-queries'
import { getSelectPlayersOfGameQuery } from '../../sql-queries/games_players'

export async function getAllGames(req, res) {
    try{
    const games = await manyOrNone(getSelectAllGamesQuery())

    res.status(200).send({ games })
    } catch(error) {
        res.status(400).send({ error })
    }
}

export async function getGameById(req, res) {
    try{
    const id = req.params.gameId

    const game = await oneOrNone(getSelectGameByIdQuery(id))

    if(!game) {
        return res.status(400).send({ message: 'Game does not exist.'})
    }

    return res.status(200).send({ game })
    } catch(error) {
        res.status(400).send({ error })
    }
}

export async function getAllPlayersOfGame(req, res) {
    try{
        const gameId = req.params.gameId

        const game = await oneOrNone(getSelectGameByIdQuery(gameId))
        if(!game) {
            return res.status(400).send({ message: 'This game does not exist.' })
        }

        const gamePlayers = await manyOrNone(getSelectPlayersOfGameQuery(gameId))

        return res.status(200).send({ gamePlayers })
    } catch(error) {
        return res.status(400).send({ error })
    }
}
