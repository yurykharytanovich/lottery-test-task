import { manyOrNone } from './db/index'
import { getSelectUnresolvedGamesQuery } from './sql-queries/games'
import { CronJob } from 'cron'
import { executeGame } from './game-process/index'
import * as TABLES from './constants/tables'

export async function restartJobs() {
    const gamesUnresolved = await manyOrNone(getSelectUnresolvedGamesQuery())

    gamesUnresolved.forEach(async game => {
        if(new Date() < new Date(game[TABLES.GAMES.COLUMNS.FINISH_DATE].toISOString())) {
            global.gamesCronJobs[game.id] = createGameCronJob(game)
        } else {
            await executeGame(game.id)
        }
    })
}

export function createGameCronJob(game) {
    return new CronJob({
        cronTime: new Date(game[TABLES.GAMES.COLUMNS.FINISH_DATE].toISOString()),
        onTick: async function() {
            await executeGame(game.id)
        },
        start: true
    })
}
