const express = require('express');
const Projects = require('./projects-model');
const { validateProjectId, validateProjectData } = require('./projects-middleware');

const router = express.Router();


router.get('/', (req, res) => {
    Projects.get()
    .then(projects => {
        if (projects && projects.length) {
            res.status(200).json(projects);
        } else {
            res.status(200).json([]);
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "The projects information could not be retrieved",
            error: err.message,
            stack: err.stack,
        });
    });
});


router.get('/:id', validateProjectId, (req, res) => {
    const { id } = req.params; 

    Projects.get(id)
    .then(project => {
        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Failed to retrieve project',
            error: err.message,
            stack: err.stack,
        });
    });
});

router.post('/', validateProjectData, async (req, res) => {
    try {
        const newProject = await Projects.insert(req.body); 
        res.status(201).json(newProject); 
    } catch (err) {
        res.status(500).json({ message: 'Failed to create new project' });
    }
});

router.put('/:id', validateProjectId, validateProjectData, async (req, res) => {
    try {
        const updatedProject = await Projects.update(req.params.id, req.body);
        res.json(updatedProject);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update project' });
    }
});

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const project = await Projects.get(id);
      if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
      }
      const count = await Projects.remove(id);
      if (count > 0) {
        res.json(project);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete project', error: err });
    }
  });

  

  
  module.exports = router;

