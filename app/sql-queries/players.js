import squel from 'squel'
import { PLAYERS } from '../constants/tables'

const squelPostgres = squel.useFlavour('postgres')

export function getSelectAllPlayersQuery() {
    return squel.select()
        .from(PLAYERS.NAME)
        .toString()
}

export function getSelectPlayerByIdQuery(id) {
    return squel.select()
        .from(PLAYERS.NAME)
        .where(`id = '${id}'`)
        .toString()
}

export function getInsertPlayerQuery(player) {
    return squelPostgres.insert()
        .into(PLAYERS.NAME)
        .setFields(player)
        .returning('*')
        .toString()
}

export function getDeletePlayerByIdQuery(id) {
    return squelPostgres.delete()
        .from(PLAYERS.NAME)
        .where(`id = '${id}'`)
        .returning('*')
        .toString()
}

export function getUpdatePlayerByIdQuery(id, values) {
    return squelPostgres.update()
        .table(PLAYERS.NAME)
        .setFields(values)
        .where(`id = '${id}'`)
        .returning('*')
        .toString()
}

export function getSelectPlayersByIdsQuery(ids) {
    return squel.select()
        .from(PLAYERS.NAME)
        .where(`id in (${ids.map(id => `'${id}'`)})`)
        .toString()
}

export function getUpdatePlayersBalancesQuery(ids, diff) {
    return squelPostgres.update()
        .table(PLAYERS.NAME)
        .set(PLAYERS.COLUMNS.BALANCE, `${PLAYERS.COLUMNS.BALANCE + diff}`)
        .where(`id in (${ids.map(id => `'${id}'`)})`)
        .returning('*')
        .toString()
}
