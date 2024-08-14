import AuthService from '../services/auth_service.js';

export async function mustLogin(req, res, next) {
  if (req.session.userId) {
    if (!await AuthService.getUser(req.session.email)) {
      return req.session.destroy((err) => {
        if (err) {
          console.error('Error during logout:', err);
          return res.status(500).json({ error: 'Error during logout' });
        } else {
          return res.redirect('/login');
        }
      });
    }
    return next();
  }
  res.redirect('/login');
}

export function alreadyLoggedIn(req, res, next) {
  if (req.session.userId) {
    return res.redirect('/');
  }
  next();
}

export function isAdmin(req, res, next) {
  if (!req.session.role) {
    return res.redirect('/dashboard/login');
  }
  console.log('An admin made this call');
  next();
}

export function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ error: 'Error during logout' });
    } else {
      return res.redirect('/');
    }
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const result = await AuthService.login(email, password);
    if (result) {
      req.session.userId = result._id; // Store user ID from the result
      req.session.email = result.email; // Store email from the result
      req.session.name = `${result.firstName} ${result.lastName}`; // Store name from the result
      if (result.role == true) req.session.role = true;

      return res.status(200).json({ message: 'Login successful', user: result });
    } else {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
}

export async function register(req, res) {
  const { firstName, lastName, email, password } = req.body;
  const user = { firstName, lastName, email, password };

  try {
    const registeredUser = await AuthService.register(user);
    if (!registeredUser)
      return res.status(401).json({ error: 'User already exists with this email..' });

    req.session.userId = registeredUser._id;
    req.session.name = `${registeredUser.firstName} ${registeredUser.lastName}`;
    req.session.email = registeredUser.email;
    return res.status(201).json({ message: 'Registration successful', user: registeredUser });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error });
  }
}

export async function updateUser(req, res) {
  const { firstName, lastName, email, newEmail, currentPassword, newPassword, role } = req.body;
  const user = { firstName, lastName, email, newEmail, currentPassword, newPassword, role };
  try {

    if (user.newEmail) {
      const newEmailExists = await AuthService.getUser(user.newEmail);
      if (newEmailExists) {
        return res.status(403).json({ success: false, message: 'New email is already in use!' })

      }
    }


    const updatedUser = await AuthService.update(user);
    if (!updatedUser)
      return res.status(404).json({ error: 'User not found with this email.' });

    req.session.userId = updatedUser._id;
    req.session.name = `${updatedUser.firstName} ${updatedUser.lastName}`;
    req.session.email = updatedUser.email;

    return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error during update:', error);
    return res.status(500).json({ error: `${error.message}` });
  }
}
