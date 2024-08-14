import AuthService from '../../services/auth_service.js';
export async function usersIndex(req, res) {
  const allUsers = await AuthService.getUsers();
  res.render('../views/dashboard/users', {
    users: allUsers,
  });
}
