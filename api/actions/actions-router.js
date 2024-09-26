const express = require('express');
const Actions = require('./actions-model'); 
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const actions = await Actions.get();
        res.json(actions); 
    } catch (err) {
        res.status(500).json({ message: 'Failed to get actions' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const action = await Actions.get(id);  
        if (action) {
            res.json(action);
        } else {
            res.status(404).json({ message: 'Action not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to get action' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    if (!changes.description || !changes.notes) {
        res.status(400).json({ message: "Required fields: 'description' and 'notes'" });
        return;
    }

    try {
        const updatedAction = await Actions.update(id, changes);
        if (updatedAction) {
            res.json(updatedAction);
        } else {
            res.status(404).json({ message: 'Action not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to update action' });
    }
});



router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const action = await Actions.get(id);
        if (!action) {
            res.status(404).json({ message: 'Action not found' });
            return;
        }
        const count = await Actions.remove(id);
        if (count > 0) {
            res.json(action); 
        } else {
            res.status(404).json({ message: 'Action not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete action' });
    }
});

module.exports = router;
