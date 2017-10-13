import express from 'express'
import players from './players'
import games from './games'

const router = new express.Router()

router.use('/players', players)
router.use('/games', games)

export default router
