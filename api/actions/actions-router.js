const express = require('express');
const Actions = require('./actions-model'); 
const router = express.Router();

const { validateActionId, validateActionData } = require('./actions-middleware');


router.get('/', async (req, res) => {
    try {
        const actions = await Actions.get();
        res.json(actions); 
    } catch (err) {
        res.status(500).json({ message: 'Failed to get actions' });
    }
});

router.get('/:id', validateActionId, (req, res) => {
    res.json(req.action);
});


router.get('/projects/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const actions = await Actions.get(); 
        const projectActions = actions.filter(action => action.project_id === parseInt(projectId)); 
        res.json(projectActions);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get actions for the project' });
    }
});


router.post('/', validateActionData, async (req, res) => {
    const actionData = req.body;
    try {
        const newAction = await Actions.insert(actionData); 
        res.status(201).json(newAction); 
    } catch (err) {
        res.status(500).json({ message: 'Failed to create new action' });
    }
});


router.put('/:id', validateActionId, validateActionData, async (req, res) => {
    const { id } = req.params;
    const changes = req.body;

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
