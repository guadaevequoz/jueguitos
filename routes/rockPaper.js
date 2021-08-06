const {
    RSA_NO_PADDING
} = require('constants');
const {
    Router
} = require('express');
const router = Router();
const prefix = "/rockPaper";
const game = require('./rockPaperModulo')

router.get(prefix + '/:boardID/startGame', (req, res) => {
    let show = game.startGame(req.params.boardID);
    res.json(show);
})

router.patch(prefix + '/:boardID/player:id', (req, res) => {
    let show = game.connect(req.params.boardID, req.params.id);
    res.json(
        show
    );
})

router.patch(prefix + '/:boardId/player:id/Choice:choice', (req, res) => {
    let show = game.choice(req.params.boardId, req.params.id, req.params.choice);
    res.json(show);
})

router.patch(prefix + '/:boardID/player:id/compareChoices', (req, res) => {
    let show = game.compareChoices(req.params.boardID, req.params.id);
    res.json(show);

})

router.get(prefix + '/:boardID/player:id/update', (req, res) => {
    let show = game.update(req.params.boardID, req.params.id);
    res.json(show);
})

router.patch(prefix + '/:boardID/clean', (req, res) => {
    let show = game.clean(req.params.boardID);
    res.json(show);
})


module.exports = router;