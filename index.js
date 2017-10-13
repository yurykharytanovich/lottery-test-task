import express from 'express'
import bodyParser from 'body-parser'
import api from './app/api'
import { restartJobs } from './app/app'
import { CronJob } from 'cron'

global.gamesCronJobs = {}

const port = 8080
const app = express()

app.use(bodyParser.json())
app.use('/', api)

app.use((err, req, res, next) => {
    if (err) {
        console.error(`${err.name}: ${err.message}`)
        res.status(500).send(err.message)
    } else {
        next(req, res)
    }
})

const server = app.listen(port, async function () {
    console.log(`Application server running on port ${server.address().port}`)

    await restartJobs()
})