import express from 'express'
import * as get from './get'
import * as post from './post'
import * as remove from './delete'

const router = new express.Router()

router.get('', get.getAllPlayers)
router.get('/:playerId', get.getPlayerById)
router.get('/:playerId/games', get.getGamesOfPlayerById)

router.post('', post.addPlayer)
router.post('/:playerId/games', post.addPlayersGameById)

router.delete('/:playerId', remove.deletePlayerById)

export default router
