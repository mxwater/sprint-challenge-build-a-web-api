const express = require('express');
const Projects = require('./projects-model');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
      const projects = await Projects.get();
      res.json(projects);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get projects' });
    }
  });
  

  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const project = await Projects.get(id);
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to get project' });
    }
  });

  router.post('/', async (req, res) => {
    const projectData = req.body;
    if (!projectData.name || !projectData.description) {
      res.status(400).json({ message: "Required field missing" });
      return;
    }
    try {
      const newProject = await Projects.insert(projectData);
      res.status(201).json(newProject);
    } catch (err) {
      res.status(500).json({ message: 'Failed to create new project' });
    }
  });

  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;
  
    if (!changes.name || !changes.description) {
      res.status(400).json({ message: "Required field missing" });
      return;
    }
  
    try {
      const updated = await Projects.update(id, changes);
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
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

