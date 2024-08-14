import BranchService from "../../services/dashboard/branch_service.js";
export async function branchesIndex(req, res) {

  const branches = await BranchService.getBranches();
  res.render('../views/dashboard/branches', {
    key: process.env.GOOGLE_MAPS_API_KEY, branches
  });
}
