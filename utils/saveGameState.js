


module.exports = async function (gameAdminName) {
    
    var initGame = require('./initGameState');
    var newCountry = await initGame(gameAdminName).newCountry

    return {
        newCountry
    }
}