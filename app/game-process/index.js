import { manyOrNone, oneOrNone, one } from '../db/index'
import {
    getInsertGamePlayerQuery,
    getSelectPlayersOfGameQuery,
    getUpdatePlayerByIdQuery,
    getUpdateGameByIdQuery,
    getSelectPlayersByIdsQuery
} from '../sql-queries'
import { getWinner } from './play'
import _ from 'lodash'
import * as TABLES from './../constants/tables'

export async function executeGame(gameId) {
    const gamePlayers = await manyOrNone(getSelectPlayersOfGameQuery(gameId))

    let gameFinished = {}

    if(_.isEmpty(gamePlayers)) {
        gameFinished = await oneOrNone(getUpdateGameByIdQuery(gameId, {
            [TABLES.GAMES.COLUMNS.IS_RESOLVED]: true,
            [TABLES.GAMES.COLUMNS.WINNER_ID]: null
        }))
    } else {
        const playersFromBase = await manyOrNone(getSelectPlayersByIdsQuery(gamePlayers.map(gamePlayer =>
            gamePlayer[TABLES.GAMES_PLAYERS.COLUMNS.PLAYER_ID]
        )))
        const winner = getWinner(playersFromBase)

        gameFinished = await oneOrNone(getUpdateGameByIdQuery(gameId, {
            [TABLES.GAMES.COLUMNS.IS_RESOLVED]: true,
            [TABLES.GAMES.COLUMNS.WINNER_ID]: winner.id
        }))

        await oneOrNone(getUpdatePlayerByIdQuery(winner.id, {
            [TABLES.PLAYERS.COLUMNS.BALANCE]: parseFloat(winner[TABLES.PLAYERS.COLUMNS.BALANCE]) +
                parseFloat(gameFinished[TABLES.GAMES.COLUMNS.SUM_COLLECTED])
        }))
    }

    console.log(`Game resolved: ${gameId}`)
    return { gameFinished }
}

export async function joinGame(player, game) {
    const gamePlayer = await one(getInsertGamePlayerQuery(player.id, game.id))

    const playerUpdated = await one(getUpdatePlayerByIdQuery(player.id, {
        [TABLES.PLAYERS.COLUMNS.BALANCE]: player[TABLES.PLAYERS.COLUMNS.BALANCE] - game[TABLES.GAMES.COLUMNS.SUM_TO_ENTER]
    }))

    const gameUpdated = await one(getUpdateGameByIdQuery(game.id, {
        [TABLES.GAMES.COLUMNS.SUM_COLLECTED]: parseFloat(game[TABLES.GAMES.COLUMNS.SUM_COLLECTED]) +
            parseFloat(game[TABLES.GAMES.COLUMNS.SUM_TO_ENTER])
    }))

    return { gamePlayer, playerUpdated, gameUpdated }
}
