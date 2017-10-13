import express from 'express'
import * as get from './get'
import * as post from './post'
import * as remove from './delete'

const router = new express.Router()

router.get('', get.getAllGames)
router.get('/:gameId', get.getGameById)
router.get('/:gameId/players', get.getAllPlayersOfGame)

router.post('', post.addGame)

router.delete('/:gameId', remove.deleteGameById)

export default router
