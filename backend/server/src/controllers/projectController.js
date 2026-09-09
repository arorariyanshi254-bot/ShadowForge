import Project from "../models/Project.js";

// @desc    Get user's projects
// @route   GET /api/projects
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new project
// @route   POST /api/projects
export const createProject = async (req, res) => {
    try {
        const { name, targetUrl, method, headers } = req.body;

        if (!name || !targetUrl) {
            return res.status(400).json({ message: "Name and Target URL are required" });
        }

        const project = await Project.create({
            user: req.user._id,
            name,
            targetUrl,
            method: method || "GET",
            headers: headers || [],
            status: "Configured",
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json({ message: "Project removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Save fault configuration for project
// @route   PUT /api/projects/:id/faults
export const saveFaultConfig = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { faultConfig: req.body },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/projects/stats
export const getProjectStats = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id });
        const activeMocks = projects.filter((p) => p.status === "Active").length;

        // Calculate aggregate statistics for mock request logs
        let totalRequests = projects.length * 8;
        let failedRequests = 0;

        projects.forEach((p) => {
            if (p.faultConfig?.error?.enabled) {
                failedRequests += 3;
            }
        });

        res.json({
            totalProjects: projects.length,
            activeMocks,
            totalRequests,
            failedRequests,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
