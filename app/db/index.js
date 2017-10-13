import pgPromise from 'pg-promise'

const pgp = pgPromise()
const dbUrl = 'postgres://usr:usr@localhost:5432/lotterydb'

const db = pgp(dbUrl)

export function oneOrNone(query) {
    return db.oneOrNone(query)
}

export function manyOrNone(query) {
    return db.manyOrNone(query)
}

export function many(query) {
    return db.many(query)
}

export function one(query) {
    return db.many(query)
}
