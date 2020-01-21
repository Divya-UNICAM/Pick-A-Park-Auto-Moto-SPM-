router.put('/price', async (req,res) => {
    const toUpdate = req.body;
    try {
        const currentCost = Cost.find();
        const updated = await currentCost.set(toUpdate).save();
        res.send(updated);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;