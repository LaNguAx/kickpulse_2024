
# KICK_PULSE_2024

KICK_PULSE_2024 is a comprehensive e-commerce platform designed to manage and streamline various aspects of an online store. This project includes functionalities for managing products, suppliers, brands, orders, users, and more. It integrates third-party APIs like Google Maps for location-based services and Facebook API for social media management.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [APIs and Services](#apis-and-services)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Product Management**: Add, update, delete, and view products.
- **Supplier Management**: Manage suppliers and their associated brands.
- **Order Management**: View and manage customer orders.
- **User Management**: Admin can manage users, update roles, and delete accounts.
- **Branch Management**: Add and manage store branches with Google Maps integration.
- **Social Media Integration**: Post updates directly to Facebook.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/LaNguAx/KICK_PULSE_2024.git
   cd KICK_PULSE_2024
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables:**
   - Create a \`.env\` file in the root directory.
   - Add the required environment variables (see below).

4. **Run the application:**
   \`\`\`bash
   npm start
   \`\`\`

## Usage

Once the application is up and running, you can access the following functionalities:

- **Dashboard**: Admins can manage products, orders, suppliers, brands, and branches.
- **Storefront**: Users can browse products, place orders, and view their order history.

## Environment Variables

Make sure to set up the following environment variables in your \`.env\` file:

\`\`\`plaintext
MONGO_URI=<your-mongo-db-connection-string>
FACEBOOK_API_KEY=<your-facebook-api-key>
GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
JWT_SECRET=<your-jwt-secret>
\`\`\`

## APIs and Services

### Google Maps API

This project integrates with the Google Maps API to provide location-based services, such as displaying store branches on a map.

### Facebook API

The project includes functionality to post updates to a connected Facebook page.

## Folder Structure

\`\`\`plaintext
KICK_PULSE_2024/
├── backend/                    # Backend-related files and folders
│   ├── controllers/            # Controllers for handling API logic
│   ├── models/                 # Mongoose models
│   ├── routes/                 # Express routes
│   └── services/               # Business logic and API service files
├── frontend/                   # Frontend-related files and folders
│   ├── js/                     # JavaScript files
│   ├── css/                    # CSS files
│   └── views/                  # EJS templates
├── public/                     # Public assets like images and fonts
├── .env                        # Environment variables
├── server.js                   # Entry point for the Node.js application
└── README.md                   # Project documentation
\`\`\`

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.
