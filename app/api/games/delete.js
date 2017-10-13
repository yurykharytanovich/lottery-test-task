import { manyOrNone, oneOrNone } from '../../db/index'
import {
    getDeleteGameByIdQuery,
    getDeletePlayersOfGameQuery,
    getSelectGameByIdQuery,
    getUpdatePlayersBalancesQuery
} from '../../sql-queries'
import { GAMES, GAMES_PLAYERS } from '../../constants/tables'
import _ from 'lodash'

export async function deleteGameById(req, res) {
    try{
        const gameId = req.params.gameId

        const game = await oneOrNone(getSelectGameByIdQuery(gameId))
        if(!game) {
            return res.status(400).send({ message: 'Game does not exist.' })
        }

        const gamePlayers = await manyOrNone(getDeletePlayersOfGameQuery(gameId))

        console.log(gamePlayers)

        console.log(getUpdatePlayersBalancesQuery(gamePlayers.map(gamePlayer => gamePlayer[GAMES_PLAYERS.COLUMNS.PLAYER_ID]),
            parseFloat(game[GAMES.COLUMNS.SUM_TO_ENTER])
        ))

        if(!game[GAMES.COLUMNS.IS_RESOLVED] && !_.isEmpty(gamePlayers)) {
            await manyOrNone(getUpdatePlayersBalancesQuery(gamePlayers.map(gamePlayer => gamePlayer[GAMES_PLAYERS.COLUMNS.PLAYER_ID]),
                parseFloat(game[GAMES.COLUMNS.SUM_TO_ENTER])
            ))
        }

        const gameRemoved = await oneOrNone(getDeleteGameByIdQuery(gameId))
        if(!gameRemoved) {
            return res.status(400).send({ message: 'Delete NOT OK.' })
        }

        return res.status(200).send({ game: gameRemoved })
    } catch(error) {
        res.status(400).send({ error })
    }
}
