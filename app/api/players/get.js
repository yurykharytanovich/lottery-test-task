import { manyOrNone, oneOrNone } from '../../db/index'
import {
    getSelectAllPlayersQuery,
    getSelectPlayerByIdQuery,
    getSelectGamesOfPlayerByIdQuery
} from '../../sql-queries'

export async function getAllPlayers(req, res) {
    try{
    const players = await manyOrNone(getSelectAllPlayersQuery())

    return res.status(200).send({ players })
    } catch(error) {
        res.status(400).send({ error })
    }
}

export async function getPlayerById(req, res) {
    try{
    const id = req.params.playerId

    const player = await oneOrNone(getSelectPlayerByIdQuery(id))

    if(!player) {
        return res.status(400).send({ message: 'Player does not exist.'})
    }

    return res.status(200).send({ player })
    } catch(error) {
        res.status(400).send({ error })
    }
}

export async function getGamesOfPlayerById(req, res) {
    try{
    const id = req.params.playerId

    const player = await oneOrNone(getSelectPlayerByIdQuery(id))

    if (!player) {
        return res.status(400).send({message: 'Player does not exist.'})
    }

    const playersGames = await manyOrNone(getSelectGamesOfPlayerByIdQuery(id))

    return res.status(200).send({playersGames})
    } catch(error) {
        res.status(400).send({ error })
    }
}