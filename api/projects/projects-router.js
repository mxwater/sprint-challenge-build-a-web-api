const express = require('express');
const Projects = require('./projects-model');
const Actions = require('../actions/actions-model')
const router = express.Router();

const { validateProjectId, validateProjectData } = require('./projects-middleware');


router.get('/', (req, res) => {
    Projects.get()
    .then(projects => res.status(200).json(projects.length ? projects : []))
    .catch(err => res.status(500).json({
        message: "Failed to retrieve projects",
        error: err.message,
        stack: err.stack,
    }));
});

router.get('/:id', validateProjectId, (req, res) => {
    res.json(req.project);
});

router.get('/:id/actions', validateProjectId, async (req, res) => {
    try {
        const actions = await Actions.get();
        const projectActions = actions.filter(action => action.project_id === parseInt(req.project.id));
        res.status(200).json(projectActions.length ? projectActions : []);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve project actions' });
    }
});

router.post('/', validateProjectData, async (req, res) => {
    Projects.insert(req.body)
    .then(newProject => res.status(201).json(newProject))
    .catch(err => res.status(500).json({ message: 'Failed to create project' }));
});


router.put('/:id', validateProjectId, validateProjectData, async (req, res) => {
    Projects.update(req.params.id, req.body)
    .then(updatedProject => res.json(updatedProject))
    .catch(err => res.status(500).json({ message: 'Failed to update project' }));
});

router.delete('/:id', async (req, res) => {
    Projects.remove(req.params.id)
    .then(count => count ? res.json(req.project) : res.status(404).json({ message: 'Project not found' }))
    .catch(err => res.status(500).json({ message: 'Failed to delete project', error: err }));
});

  

  
  module.exports = router;

