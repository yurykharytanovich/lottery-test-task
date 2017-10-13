import squel from 'squel'
import { GAMES_PLAYERS } from '../constants/tables'

const squelPostgres = squel.useFlavour('postgres')

export function getSelectGamesOfPlayerByIdQuery(playerId) {
    return squel.select()
        .from(GAMES_PLAYERS.NAME)
        .where(`${GAMES_PLAYERS.COLUMNS.PLAYER_ID} = '${playerId}'`)
        .toString()
}

export function getInsertGamePlayerQuery(playerId, gameId) {
    return squelPostgres.insert()
        .into(GAMES_PLAYERS.NAME)
        .setFields({
            [GAMES_PLAYERS.COLUMNS.PLAYER_ID]: playerId,
            [GAMES_PLAYERS.COLUMNS.GAME_ID]: gameId
        })
        .returning('*')
        .toString()
}

export function getSelectPlayersOfGameQuery(gameId) {
    return squel.select()
        .from(GAMES_PLAYERS.NAME)
        .where(`${GAMES_PLAYERS.COLUMNS.GAME_ID} = '${gameId}'`)
        .toString()
}

export function getSelectGamePlayerByIdsQuery(playerId, gameId) {
    return squel.select()
        .from(GAMES_PLAYERS.NAME)
        .where(`${GAMES_PLAYERS.COLUMNS.PLAYER_ID} = '${playerId}'`)
        .where(`${GAMES_PLAYERS.COLUMNS.GAME_ID} = '${gameId}'`)
        .toString()
}

export function getDeletePlayersOfGameQuery(gameId) {
    return squelPostgres.delete()
        .from(GAMES_PLAYERS.NAME)
        .where(`${GAMES_PLAYERS.COLUMNS.GAME_ID} = '${gameId}'`)
        .toString()
}

export function getDeleteGamesOfPlayerQuery(playerId) {
    return squelPostgres.delete()
        .from(GAMES_PLAYERS.NAME)
        .where(`${GAMES_PLAYERS.COLUMNS.PLAYER_ID} = '${playerId}'`)
        .toString()
}
