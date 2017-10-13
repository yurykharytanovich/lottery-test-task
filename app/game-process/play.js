import _ from 'lodash'

export function getWinner (players) {
    return _.sample(players)
}
