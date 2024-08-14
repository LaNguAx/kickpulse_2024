import AuthService from '../../services/auth_service.js';

// Get all users
export async function getUsers(req, res) {
  try {
    const users = await AuthService.getUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Create a new user
export async function createUser(req, res) {
  try {
    const user = { ...req.body };
    const newUser = await AuthService.register(user);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get a single user by email
export async function getUser(req, res) {
  const { email } = req.params;
  try {
    const user = await AuthService.getUser(email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Update a user by email
export async function updateUser(req, res) {
  const { email } = req.params;
  const newUserData = { ...req.body };
  try {

    console.log(newUserData)
    if (newUserData.newEmail) {
      const newEmailExists = await AuthService.getUser(newUserData.newEmail);
      if (newEmailExists) {
        return res.status(403).json({ success: false, message: 'New email is already in use!' })

      }
    }

    const updatedUser = await AuthService.update(newUserData);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Update a user by email
export async function updateUserRole(req, res) {
  const { email } = req.params;
  try {

    const updatedUser = await AuthService.updateUserRole(email);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}



// Delete a user by email
export async function deleteUser(req, res) {
  const { email } = req.params;
  try {
    const deletedUser = await AuthService.deleteUser(email);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
