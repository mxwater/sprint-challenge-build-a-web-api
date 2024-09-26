const Projects = require('./projects-model');

async function validateProjectId(req, res, next) {
    try {
        const { id } = req.params;
        const project = await Projects.get(id);
        if (project) {
            req.project = project;  // Attach the project to req object
            next();  // Move to the next middleware or route handler
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve project', error: err.message });
    }
}


function validateProjectData(req, res, next) {
    const { name, description, completed } = req.body;

    if (!name || !description || completed === undefined) {
        return res.status(400).json({ 
            message: 'Missing required fields: name, description, and completed' 
        });
    } else {
        next(); 
    }
}

module.exports = {
    validateProjectId,
    validateProjectData
};