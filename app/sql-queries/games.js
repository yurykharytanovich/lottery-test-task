import squel from 'squel'
import { GAMES } from '../constants/tables'

const squelPostgres = squel.useFlavour('postgres')

export function getSelectAllGamesQuery() {
    return squel.select()
        .from(GAMES.NAME)
        .toString()
}

export function getSelectGameByIdQuery(id) {
    return squel.select()
        .from(GAMES.NAME)
        .where(`id = '${id}'`)
        .toString()
}

export function getInsertGameQuery(game) {
    return squelPostgres.insert()
        .into(GAMES.NAME)
        .setFields(game)
        .returning('*')
        .toString()
}

export function getDeleteGameByIdQuery(id) {
    return squelPostgres.delete()
        .from(GAMES.NAME)
        .where(`id = '${id}'`)
        .returning('*')
        .toString()
}

export function getSelectUnresolvedGamesQuery() {
    return squel.select()
        .from(GAMES.NAME)
        .where(`${GAMES.COLUMNS.IS_RESOLVED} IS FALSE`)
        .toString()
}

export function getUpdateGameByIdQuery(id, values) {
    return squelPostgres.update()
        .table(GAMES.NAME)
        .setFields(values)
        .where(`id = '${id}'`)
        .returning('*')
        .toString()
}
