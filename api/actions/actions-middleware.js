const Actions = require('./actions-model');


async function validateActionId(req, res, next) {
    const { id } = req.params;

    try {
        const action = await Actions.get(id); 
        if (action) {
            req.action = action; 
            next();
        } else {
            res.status(404).json({ message: "Action not found" }); 
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
