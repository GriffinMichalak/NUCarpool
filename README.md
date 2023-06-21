# NUCarpool 🙋🏻‍♂️🚗
This project aims to model a design for a carpooling app between Northeastern Students so that they can travel to their co-ops more quickly and affordably. It was written for a coding challenge for a software engineering position at Northeastern Sandbox. 

## Features

- Create user profiles with name, start location, end location, start and end times, and role (Driver/Rider).
- Update user profiles with new information.
- Delete user profiles.
- Get recommendations for drivers or riders based on their preferences and availability.
- Handle disruptions in the transportation system and provide alternative recommendations.
- Retrieve lists of drivers and riders for debugging purposes.

## Installation

1. Clone the repository: `git clone <https://github.com/sandbox-recruiting/f2023-chrysalis-challenge-GriffinMichalak/tree/GriffinMichalak-patch-1>` or do so via SSH. 
2. Navigate to the project directory: `cd NUCarpool`
3. Install the dependencies: `npm install`
4. To start the server, type `npm start`

## Usage

1. Start the local server: `node index.js` or `npm start`
2. Access the application in your browser at `http://localhost:3000`

### Design Decisions
I made several design decisions while creating this, some of which were very inspired by Java and OOD, others from my own work.

- **Encapsulation**: I thought it was a good idea to keep variables private whenever possible and limit user access to variables in the future. Besides your specific requests to limit the `users` Array access, I made the following design decisions:
  - Making all variables private in the `User`, `Position`, `Disruption`, and `Time` classes and creating `get` methods. I recognize the fact that I created `set` methods in some of my classes, and I don't like that my code ended up turning out that way. My rationale for that choice was that at the moment, I don't see a way for the user of the app to directly access User data, so hopefully that potential security issue is taken care of while making a UI in the future.
- **Helper methods**: I tried to make my code as readable as possible, and I did so using helper methods. I also used a slightly unconventional approach with methods such as `isNotAnInteger()` and others.
- **Readability**: More on making my code look nice, I also cared about the output. Instead of using the JSON-like output, I decided to make my own `toString()` method to make the output look easier to read, including formatting times in the "HH:MM" format.
- **Running and Testing**: I conducted all of my tests in Postman because I liked the UI best and it was easy to use, but I'm sure other API Platforms work just fine. 
- **Other**
  - I didn't quite know how to make an "enum" since JavaScript doesn't support that datatype, so I sort of created my own, which you can see in the code. 
 
## API Endpoints

### `GET /`

Displays a welcome message to the NUCarpool application.

### `POST /create-user`

Creates a new user profile. Requires a JSON object with the following properties:
- `name` (string): The name of the user.
- `startLocation` (Position): The starting location of the user with `x` and `y` coordinates.
- `endLocation` (Position): The destination location of the user with `x` and `y` coordinates.
- `startHour` (number): The starting hour of the user's availability.
- `startMinute` (number): The starting minute of the user's availability.
- `endHour` (number): The ending hour of the user's availability.
- `endMinute` (number): The ending minute of the user's availability.
- `role` (Role): The role of the user (driver/rider).

### `PUT /update-user`

Updates an existing user profile. Requires the `name` parameter in the request body and one or more of the following properties to update:
- `startLocation` (Position): The new starting location of the user.
- `endLocation` (Position): The new destination location of the user.
- `startHour` (number): The new starting hour of the user's availability.
- `startMinute` (number): The new starting minute of the user's availability.
- `endHour` (number): The new ending hour of the user's availability.
- `endMinute` (number): The new ending minute of the user's availability.
- `role` (Role): The new role of the user.

### `DELETE /delete-user`

Deletes a user profile. Requires the `name` parameter in the request body.

### `GET /recommendations/:name`

Gets recommendations for drivers or riders based on their preferences and availability. Requires the `name` parameter in the URL.

### `GET /v2/recommendations/:name`

Gets recommendations for drivers or riders based on their preferences and availability, taking into account disruptions in the transportation system.

### `GET /get-drivers`

Retrieves a list of all drivers for debugging purposes.

### `GET /get-riders`

Retrieves a list of all riders for debugging purposes.

### `POST /disruption`

Creates a disruption in the transportation system. Requires a JSON object with the following properties:
- `location` (Position): The location of the disruption with `x` and `y` coordinates.
- `radius` (number): The radius of the disruption area.
- `delayHours` (number): The delay in hours caused by the disruption.
- `delayMinutes` (number): The delay in minutes caused by the disruption.

### Future Works
* Adding a User Interface would be a great idea, similar to what your current model of the NUCarpool App looks like.
   * A map to see your location and locate users around you.
   * An interface with boxes to add your information into and have the user interface prevent invalid information from coming in.
   * This could be done using HTML or Pug and integrating the JavaScript logic accordingly. 
* Fully implementing the Time object: I think it would have been much more useful to create and finish the implementation for the time object instead of using `startHour`, `startMinute`, `endHour`, and `endMinute`. It would have been easier to create a Time object that takes in this information and then have built-in methods into the class to do what many of my JavaScript functions did, such as `timeBetween()` and `isBefore()`. You can see my beginning ideas for the Time class in my submission. Obviously, we would have to modify the User and Disruption objects to take in a Time object instead of the four default parameters listed above.
* Improving encapsulation: I am not terribly happy with the fact that I had to make setters in classes such as `User`. I would be happy to work with my team to find a way to make it more tightly shut.
* Expansion: One thing that I could definetly work on is making it so my code could be a little easier to be expanded upon. For example, instead of iterating directly through the values of the enum explicitly (401: `return (role === "Driver" || role === "Rider");`), I could potentially make an array of sorts to see if a particular variable contains any value in that enum, so I could use a loop to iterate through each enum value.
* The v2 Recommendations Method still isn't 100% properly for some inputs, so that would be a great thing to fix as well. 


## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
