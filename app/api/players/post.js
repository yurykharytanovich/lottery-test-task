import { oneOrNone } from '../../db/index'
import {
    getInsertPlayerQuery,
    getSelectPlayerByIdQuery,
    getSelectGameByIdQuery
} from '../../sql-queries'
import { joinGame } from '../../game-process/index'
import * as TABLES from './../../constants/tables'
import { getSelectGamePlayerByIdsQuery } from '../../sql-queries/games_players'

export async function addPlayer(req, res) {
    try {
        const playerToAdd = req.body.player

        const player = await oneOrNone(getInsertPlayerQuery(playerToAdd))

        if (!player) {
            res.status(400).send({message: 'Insert NOT OK.'})
        }

        res.status(200).send({ player })
    } catch(error) {
        res.status(400).send({ error })
    }
}

export async function addPlayersGameById(req, res) {
    try {
        const playerId = req.params.playerId
        const gameId = req.body.gameId

        const player = await oneOrNone(getSelectPlayerByIdQuery(playerId))
        if (!player) {
            return res.status(400).send({message: 'Player does not exist.'})
        }

        const game = await oneOrNone(getSelectGameByIdQuery(gameId))
        if (!game) {
            return res.status(400).send({message: 'Game does not exist.'})
        }

        if(game[TABLES.GAMES.COLUMNS.IS_RESOLVED]) {
            return res.status(400).send({ message: 'This game has already finished.'})
        }

        if (parseFloat(player[TABLES.PLAYERS.COLUMNS.BALANCE]) < parseFloat(game[TABLES.GAMES.COLUMNS.SUM_TO_ENTER])) {
            return res.status(400).send({message: 'Not enough money.'})
        }

        const gamePlayerFromBase = await oneOrNone(getSelectGamePlayerByIdsQuery(playerId, gameId))
        if(gamePlayerFromBase) {
            return res.status(400).send({ message: 'This player had already joined the game.'})
        }

        const { gamePlayer, playerUpdated, gameUpdated } = await joinGame(player, game)

        if (!gamePlayer) {
            return res.status(400).send({message: 'Insert NOT OK.'})
        }

        return res.status(200).send({ gamePlayer, playerUpdated, gameUpdated })
    } catch(error) {
        res.status(400).send({ error })
    }
}
