import { oneOrNone } from '../../db/index'
import { getInsertGameQuery } from '../../sql-queries'
import { createGameCronJob } from '../../app'
import { GAMES } from '../../constants/tables'

export async function addGame(req, res) {
    try {
        const gameToAdd = req.body.game

        if (!req.body.game) {
            return res.status(400).send({ message: 'Game object is not passed.' })
        }

        if(new Date() >= new Date(gameToAdd[GAMES.COLUMNS.FINISH_DATE])) {
            return res.status(400).send({ message: 'Game finish date is expired.' })
        }

        delete gameToAdd[GAMES.COLUMNS.IS_RESOLVED]
        delete gameToAdd[GAMES.COLUMNS.WINNER_ID]

        const game = await oneOrNone(getInsertGameQuery(gameToAdd))
        if (!game) {
            return res.status(400).send({ message: 'Insert NOT OK.' })
        }

        global.gamesCronJobs[game.id] = createGameCronJob(game)

        return res.status(200).send({game})
    } catch(error) {
        res.status(400).send({ error })
    }
}
