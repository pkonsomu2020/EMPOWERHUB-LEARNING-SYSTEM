# EmpowerHub E-Learning Website

![E-Learning Website](preview-image.png)

## Project Overview

EmpowerHub is a comprehensive e-learning platform designed to offer a wide range of courses in web development, data science, cloud computing, and much more. This project includes both frontend and backend components to manage user authentication, course enrollment, and content delivery. It is built using HTML, CSS, JavaScript, and Node.js, with MySQL as the database for data storage.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [License](#license)

## Features

- **User Authentication**: Users can sign up, log in, and log out securely.
- **Course Management**: View course details and access specific course content.
- **Responsive Design**: The website is fully responsive and works on all devices.
- **Interactive Learning**: Users can explore different courses, including HTML, CSS, JavaScript, Python, Data Science, and more.
- **Admin Features**: Admins can add or manage courses (future feature).

## Technologies Used

- **Frontend**: 
  - HTML5, CSS3 (Bootstrap), JavaScript (ES6)
  - Libraries: Animate.css, Owl Carousel, Wow.js
- **Backend**:
  - Node.js (Express.js)
  - MySQL (Database)
- **Additional Tools**:
  - SCSS for styling
  - Easing and Waypoints for animations

## Installation

Follow the steps below to set up the project locally.

### Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v16.x or higher)
- MySQL Server

### Steps to Run the Project

1. **Clone the repository**:
    ```bash
    git clone https://github.com/pkonsomu2020/empowerhub-elearning.git
    cd empowerhub-elearning/user_auth
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Create the MySQL database**:
    - Create a database named `elearning_db` in MySQL.
    - Update the `config/dbConfig.js` file with your MySQL credentials.

4. **Set up environment variables**:
    - Create a `.env` file in the `user_auth/` directory and add the following:
    ```bash
    DB_HOST=localhost
    DB_USER=yourusername
    DB_PASSWORD=yourpassword
    DB_NAME=user_auth
    ```

5. **Run database migrations** (optional, based on your database setup).

6. **Run the server**:
    ```bash
    node index.js
    ```

7. **View the project in your browser**:
    - Visit `http://localhost:5000` to view the homepage.

## Usage

- **Homepage**: Displays an overview of the platform.
- **Courses Page**: View available courses and explore individual course details.
- **Authentication**: Log in and sign up using the available authentication forms.

### API Endpoints

- `/api/auth/login`: Login user
- `/api/auth/signup`: Signup user
- `/api/courses`: View list of courses


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.