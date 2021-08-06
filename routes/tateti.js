const {
    Router
} = require('express');
const router = Router();
const game = require('./tatetiModulo.js');

router.get('/tateti/:boardID/startGame', (req, res) => {
    let show = game.startGame(req.params.boardID);
    res.json(
        show
    );
})

router.get('/tateti/:boardID/update', (req, res) => {
    let show = game.update(req.params.boardID);
    res.json(
        show
    );
})

router.patch('/tateti/:boardID/player:id', (req, res) => {
    let show = game.connect(req.params.boardID, req.params.id);
    res.json(
        show
    );
})


router.patch('/tateti/:boardID/player:id/:pos', (req, res) => {
    let show = game.play(req.params.boardID, req.params.id, req.params.pos);
    res.json(
        show
    );
})

router.post('/tateti/:boardID/reset', (req, res) => {
    let show = game.back(req.params.boardID);
    res.json(
        show
    );
})

module.exports = router;