import { BranchesModel } from '../../models/dashboard/branch.js';

const getBranches = async () => {
  try {
    return await BranchesModel.find();
  } catch (err) {
    console.error('Error retrieving branches:', err);
    throw new Error('Failed to retrieve branches');
  }
};

const getBranch = async (id) => {
  try {
    const branch = await BranchesModel.findById(id);
    if (!branch) throw new Error('Branch not found');
    return branch;
  } catch (err) {
    console.error(`Error finding branch with ID ${id}:`, err);
    throw new Error('Failed to retrieve branch');
  }
};

const createBranch = async (branch) => {
  try {
    const newBranch = new BranchesModel({
      name: branch.name,
      location: branch.location,
    });

    return await newBranch.save();
  } catch (err) {
    console.error('Error saving branch:', err);
    throw new Error('Failed to save branch');
  }
};

const deleteBranch = async (id) => {
  try {
    const deletedBranch = await BranchesModel.findByIdAndDelete(id);
    if (!deletedBranch) throw new Error('Branch not found');
    return deletedBranch;
  } catch (err) {
    console.error(`Error deleting branch with ID ${id}:`, err);
    throw new Error('Failed to delete branch');
  }
};

const updateBranch = async (id, options) => {
  try {
    const updatedBranch = await BranchesModel.findByIdAndUpdate(id, options, {
      new: true,
      runValidators: true,
    });
    if (!updatedBranch) throw new Error('Branch not found');
    return updatedBranch;
  } catch (err) {
    console.error(`Error editing branch with ID ${id}:`, err);
    throw new Error('Failed to edit branch');
  }
};

const getBranchByName = async (name) => {
  try {
    const allBranches = await BranchesModel.find(); // Retrieve all distinct branches

    // Find a specific branch by name
    const specificBranch = allBranches.find(branch => branch.name.toLowerCase() === name.toLowerCase());

    if (!specificBranch) throw new Error('Branch not found');
    return specificBranch;
  } catch (err) {
    console.error(`Error finding branch with name ${name}:`, err);
    throw new Error('Failed to retrieve branch');
  }
};

export default {
  getBranches,
  getBranch,
  createBranch,
  deleteBranch,
  updateBranch,
  getBranchByName
};
