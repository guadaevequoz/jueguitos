const {
    Router
} = require('express');


const router = Router();
const game = require('./ahorcadoModulo.js');

router.get('/ahorcado/startGame/:id', (req, res) => {
    let show = game.startGame(req.params.id);
    res.json(show);
});

router.post('/ahorcado/checkLetter/:id/:letter', (req, res) => {
    let show = game.checkLetter(req.params.id, req.params.letter);
    res.json(
        show
    );
});

router.post('/ahorcado/endGame/:id/:attemps', (req, res) => {
    let show = game.endGame(req.params.id, req.params.attemps);
    res.json(show);
});


module.exports = router;