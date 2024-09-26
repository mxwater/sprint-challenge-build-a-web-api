const Actions = require('./actions-model');

async function validateActionId(req, res, next) {
    const { id } = req.params;
    
    try {
        const project = await Projects.getProjectById(id); // Make sure this method checks for a project
        if (project) {
            req.project = project; // Save the project to the request object
            next();
        } else {
            res.status(404).json({ message: "Project not found" }); // Project doesn't exist
        }
    } catch (err) {
        res.status(500).json({ message: "Failed to process request" });
    }
}


function validateActionData(req, res, next) {
    const { project_id, description, notes } = req.body;

    if (!project_id || !description || !notes) {
        return res.status(400).json({ message: "Project ID, description, and notes are required" });
    }

    next(); 
}

module.exports = { validateActionData, validateActionId };
