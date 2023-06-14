const PORT = 3000;
const express = require('express');
const app = express();

const users = [];
const userNames = [];

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello, world!");
});

/**
 * Creates a new user of the NUCarpool App.
 */
app.post("/create-user", function (req, res) {
  
  const name = req.body.name;
  const startLocationData = req.body.startLocation;
  const startLocation = new Position(startLocationData.x, startLocationData.y);
  const endLocationData = req.body.endLocation;
  const endLocation = new Position(endLocationData.x, endLocationData.y);
  const startHour = req.body.startHour;
  const startMinute = req.body.startMinute;
  const endHour = req.body.endHour;
  const endMinute = req.body.endMinute;
  const role = req.body.role;

  const user = new User(name, startLocation, endLocation, startHour, startMinute, endHour, endMinute, role);

  if (!isValidUser(user)) {
    return res.status(400).json({ error: "Invalid user data"});
  }

  users.push(user);
  userNames.push(user.getName());

  // Send the user names as the response
  res.send(user.toString());
});


app.listen(PORT, () => console.log(`Local server is listening on port http://localhost:${PORT}`));

// ----------------------------------------------------------------

/**
 * Verifies if a given user is valid.
 * @param {*} user the user to verify. 
 */
function isValidUser(user) {

  //Remove trailing spaces
  if(user.getName() !== user.getName().trim()) {
    return false;
  }

  //check if that username already exists
  if(userNames.includes(user.getName())) {
    return false; 
  }

  //Get all words in the name string
  const temp = user.getName().split(' ');
  const names = temp.filter((word) => word !== '');

  //make sure each letter is capitalized
  const cap = /^[A-Z]/; 

  for(let i = 0; i < names.length; i++) {
    
    if(!cap.test(names[i])) {
      return false; 
    }
  }

  //Verify that x and y are ints
  const startX = user.getStartLocation().getX();
  const startY = user.getStartLocation().getY();
  const endX = user.getEndLocation().getX();
  const endY = user.getEndLocation().getY();

  if(isNotAnInteger(startX) || isNotAnInteger(startY) || isNotAnInteger(endX) || isNotAnInteger(endY)) {
    return false
  }

  //check ranges for times

  const startHr = user.getStartHour();
  const startMin = user.getStartMinute(); 
  const endHr = user.getEndHour();
  const endMin = user.getEndMinute(); 

  if(isNotCorrectHour(startHr) || isNotCorrectHour(endHr) || isNotCorrectMinute(startMin) || isNotCorrectMinute(endMin)) {
    return false; 
  }

  //make sure role is either rider or driver

  const userRole = user.getRole();
  if(!isValidRole(userRole)) {
    return false; 
  }

  return true; 

}

function isNotAnInteger(num) {
  return !(num % 1 === 0);
}

function isNotCorrectHour(num) {
  return !(num <= 23 && num >= 0);
}

function isNotCorrectMinute(num) {
  return !(num <= 59 && num >= 0);
}

function isValidRole(role) {
  return (role === Role.DRIVER || role === Role.RIDER);
}

// ----------------------------------------------------------------


class User {
  #name;
  #startLocation;
  #endLocation;
  #startHour;
  #startMinute;
  #endHour;
  #endMinute;
  #role;

  constructor(name, startLocation, endLocation, startHour, startMinute, endHour, endMinute, role) {
    this.#name = name;
    this.#startLocation = startLocation;
    this.#endLocation = endLocation; 
    this.#startHour = startHour;
    this.#startMinute = startMinute;
    this.#endHour = endHour;
    this.#endMinute = endMinute;
    this.#role = role; 
  }

  getName() {
    return this.#name;
  }

  getStartLocation() {
    return this.#startLocation;
  }

  getEndLocation() {
    return this.#endLocation;
  }

  getStartHour() {
    return this.#startHour; 
  }

  getStartMinute() {
    return this.#startMinute;
  }

  getEndHour() {
    return this.#endHour;
  }

  getEndMinute() {
    return this.#endMinute;
  }

  getRole() {
    return this.#role; 
  }

  toString() {
    return ("Name: " + this.#name + " ----- " + 
    "Start Location: " + this.#startLocation.toString() + " ----- " + 
    "End Location: " + this.#endLocation.toString() + " ----- " + 
    "Start Time: " + this.#startHour + ":" + this.#startMinute + " ----- " +
    "End Time: " + this.#endHour + ":" + this.#endMinute + " ----- " +
    "Role: " + this.#role
    );
  }
}


// -------------------------------------------------------------------

class Position {
  #x
  #y

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }

  toString() {
    return `(${this.#x}, ${this.#y})`;
  }
}

// ----------------------------------------------------------------

const Role = {
  DRIVER: "Driver",
  RIDER: "Rider"
}