import { manyOrNone, oneOrNone } from '../../db/index'
import { getDeletePlayerByIdQuery } from '../../sql-queries'
import { getDeleteGamesOfPlayerQuery } from '../../sql-queries/games_players'

export async function deletePlayerById(req, res) {
    try{
        const id = req.params.playerId

        await manyOrNone(getDeleteGamesOfPlayerQuery(id))

        const player = await oneOrNone(getDeletePlayerByIdQuery(id))
        if(!player) {
            return res.status(400).send({ message: 'Delete NOT OK.' })
        }

        return res.status(200).send({ player })
    } catch(error) {
        res.status(400).send({ error })
    }
}
