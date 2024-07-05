# Game Managing App Backend
This repository contains the backend API for the Game Managing MERN application. 

## Features

- **CRUD Operations**: Create, read, Uupdate, and delete games entries.
- **Game Exploration**: Search and filter games based on various criteria.
- **Personal Game Lists**: Each user has their own personal list of games. Users can add games from the existing database to their personal list and update the status (e.g., played, plan to play dropped, playing, finished) and rating for each game.
- **Authentication and Authorization**: Secure endpoints with JSON Web Token to ensure only authorized users can access specific resources.
- **Validation**: Ensure data integrity with robust validation.
- **Pagination**: Efficiently handle large data sets with built-in pagination support.
- **Chart Data Generation**: Visualizing various statistics about the games in the database, such as the number of games per genre.
- **Performance Testing**: Use the Faker library to generate large amounts of dummy data to test the API's performance under load.

## Architecture
![src_diagram](https://github.com/AlisaUrsu/Game-Managing-App-Backend/assets/115451781/1198a6d0-2791-43c8-983c-a36eccb054c0)

The backend follows a layered architecture pattern, which organizes the code into distinct layers to improve maintainability and readability. The main components are:
- **Models**: Define the structure of the data stored in the database. Each model corresponds to a collection in MongoDB.
- **Repository**: Contains the data access logic, interacting directly with the MongoDB database.
- **Service**: Implements the business logic of the application.
- **Controller**: Manages HTTP requests and responses, calling service methods to perform operations.
- **Routes**: Define API endpoints, mapping them to controller methods for various resources (e.g., games, users, personal lists).

## Technologies Used

- **Node.js**
- **Express**
- **TypeScript**
- **MongoDB**
- **Mongoose**
- **JWT**


