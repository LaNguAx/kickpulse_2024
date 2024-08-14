import BranchService from '../../services/dashboard/branch_service.js';

// Get all branches
export async function getBranches(req, res) {
  try {
    const branches = await BranchService.getBranches();
    res.status(200).json({ success: true, data: branches });
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Create a new branch
export async function createBranch(req, res) {
  try {
    const branch = { ...req.body };
    console.log(branch);
    const newBranch = await BranchService.createBranch(branch);
    res.status(201).json({ success: true, data: newBranch });
  } catch (error) {
    console.error('Error creating branch:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get a single branch by ID
export async function getBranch(req, res) {
  const { id } = req.params;
  try {
    const branch = await BranchService.getBranch(id);
    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: 'Branch not found' });
    }
    res.status(200).json({ success: true, data: branch });
  } catch (error) {
    console.error('Error fetching branch:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Update a branch by ID
export async function updateBranch(req, res) {
  const { id } = req.params;
  const newBranchData = { ...req.body };

  try {
    const updatedBranch = await BranchService.updateBranch(id, newBranchData);
    if (!updatedBranch) {
      return res
        .status(404)
        .json({ success: false, message: 'Branch not found' });
    }

    res.status(200).json({ success: true, data: updatedBranch });
  } catch (error) {
    console.error('Error updating branch:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Delete a branch by ID
export async function deleteBranch(req, res) {
  const { id } = req.params;
  try {
    const deletedBranch = await BranchService.deleteBranch(id);
    if (!deletedBranch) {
      return res
        .status(404)
        .json({ success: false, message: 'Branch not found' });
    }

    res.status(200).json({ success: true, data: deletedBranch });
  } catch (error) {
    console.error('Error deleting branch:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get a single branch by name
export async function getBranchByName(req, res) {
  const { name } = req.params;
  try {
    const branch = await BranchService.getBranchByName(name);
    res.status(200).json({ success: true, data: branch });
  } catch (error) {
    console.error(`Error fetching branch with name ${name}:`, error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
