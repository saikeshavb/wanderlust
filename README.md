# Wanderlust - A Vacation Rental Platform

Wanderlust is a full-stack web application that allows users to discover, book, and review vacation rentals. It's a simplified clone of Airbnb, built with Node.js, Express, and MongoDB.

## Features

*   **User Authentication:** Users can sign up, log in, and log out. Authentication is implemented using Passport.js.
*   **Listings:**
    *   Create, read, update, and delete listings.
    *   Image uploads for listings are handled by Multer and Cloudinary.
    *   Listings are geocoded using the Mapbox API to display their location on a map.
*   **Reviews:** Users can leave reviews and ratings for listings.
*   **Flash Messages:** The application provides feedback to users through flash messages for actions like successful login or new listing creation.
*   **Responsive Design:** The application is designed to be responsive and work on different screen sizes.

## Technologies Used

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (with Mongoose)
*   **Templating Engine:** EJS, EJS-Mate
*   **Authentication:** Passport.js (passport-local, passport-local-mongoose)
*   **File Uploads:** Multer, Cloudinary
*   **Geocoding & Maps:** Mapbox API
*   **Middleware:** express-session, connect-mongo, connect-flash, method-override
*   **Validation:** Joi
*   **Development:** nodemon

## Setup and Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm installed.
*   A MongoDB database (local or a cloud service like MongoDB Atlas).
*   A Cloudinary account for image storage.
*   A Mapbox account for geocoding and maps.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your_username/wanderlust.git
    cd wanderlust
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the root of the project and add the following environment variables:
    ```
    ATLASDB_URL=<your_mongodb_connection_string>
    SECRET=<a_strong_secret_for_sessions>
    MAP_TOKEN=<your_mapbox_api_token>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    ```

4.  **Run the application:**
    ```sh
    node app.js
    ```
    Or, for development with automatic server restarts on file changes:
    ```sh
    nodemon app.js
    ```
    The server will start on `http://localhost:8080`.

## Project Structure

```
.
├── app.js              # Main application file
├── package.json        # Project dependencies and scripts
├── .env                # Environment variables (needs to be created)
├── cloudConfig.js      # Cloudinary configuration
├── middleware.js       # Custom middleware
├── schema.js           # Joi validation schemas
├── public/             # Static files (CSS, JS)
├── views/              # EJS templates
│   ├── includes/       # Partials (navbar, footer, flash)
│   ├── layouts/        # Layout files (boilerplate)
│   ├── listings/       # Views for listings (index, show, new, edit)
│   └── users/          # Views for user authentication (login, signup)
├── models/             # Mongoose models (listing, review, user)
├── routes/             # Express routers (listing, review, user)
├── init/               # Database initialization scripts
└── util/               # Utility functions (ExpressError, wrapAsync)
```
