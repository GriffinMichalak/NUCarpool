const PORT = 3000;
const express = require('express');
const User = require('./User');
const Position = require('./Position');
const Disruption = require('./Disruption');
const Time = require('./Time');

const app = express();

const users = [];
const disruptions = []; 
const userNames = [];

app.use(express.json());

/**
 * The default endpoint. It displays the welcome message for the URL of the app. 
 */
app.get("/", function (req, res) {
  res.send("Welcome to NUCarpool! [Northeastern Sandbox]");
});

/**
 * Creates a new user of the NUCarpool App and adds it to the list of users.
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

/**
 * Updates a user using the corresponding data entered in the server. 
 */
app.put("/update-user", function (req, res) {
  const name = req.body.name;

  // Find the user with the specified name
  const user = users.find((user) => user.getName() === name);

  // If user is not found, respond with an error
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Update the user fields with the provided data (if present)
  if (req.body.startLocation) {
    const startLocationData = req.body.startLocation;
    const startLocation = new Position(startLocationData.x, startLocationData.y);
    user.setStartLocation(startLocation);
  }
  if (req.body.endLocation) {
    const endLocationData = req.body.endLocation;
    const endLocation = new Position(endLocationData.x, endLocationData.y);
    user.setEndLocation(endLocation);
  }
  if (req.body.startHour) {
    const startHour = req.body.startHour;
    user.setStartHour(startHour);
  }
  if (req.body.startMinute) {
    const startMinute = req.body.startMinute;
    user.setStartMinute(startMinute);
  }
  if (req.body.endHour) {
    const endHour = req.body.endHour;
    user.setEndHour(endHour);
  }
  if (req.body.endMinute) {
    const endMinute = req.body.endMinute;
    user.setEndMinute(endMinute);
  }
  if (req.body.role) {
    const role = req.body.role;
    user.setRole(role);
  }

  // Check if the updated user is still valid
  if (!isValidUser(user)) {
    return res.status(400).json({ error: "Invalid user data" });
  }

  // Send the updated user as the response
  res.send(user.toString());
});

/**
 * Deletes a user from the list of users.
 */
app.delete("/delete-user", function (req, res) {
  const name = req.body.name;

  // Find the index of the user with the specified name
  const index = users.findIndex(user => user.getName() === name);

  // If user is not found, respond with an error
  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  // Remove the user from the array
  users.splice(index, 1);

  res.send("User deleted successfully");
  res.send(user.toString());
});


/**
 * Gets recommended users based on specified standards by NUCarpool.
 */
app.get("/recommendations/:name", function (req, res) {
  let recommendations = []; 
  const recFormats = []; 
  const name = req.params.name;
  const user = users.find((user) => user.getName() === name);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if(user.getRole() === Role.DRIVER) {

    const riders = getRiders(users); 

    for(let i = 0; i < riders.length; i++) {
      if(isValidRider(user, riders[i])) {
        recommendations.push(riders[i]);
      }
    }
  }

  if(user.getRole() === Role.RIDER) {
    /**
     * Driver recommendations created for Riders follow all the same rules mentioned above. However, you must be careful! As you’re now working on the reversed case, make sure your validation for start and end time bounds works as intended. This will heavily depend on how you choose to implement that validation.
     */
    const drivers = getDrivers(users); 

    for(let i = 0; i < drivers.length; i++) {
      if(isValidDriver(user, drivers[i])) {
        recommendations.push(drivers[i]);
      }
    }
  }

    recommendations = sort(user, recommendations);

  for(let i = 0; i < recommendations.length; i++) {
    recFormats.push(recommendations[i].toString());
  }

  res.send(recFormats); 

});

/**
 * Gets recommended users based on specified standards by NUCarpool, adding disruptions/delays into accout. 
 */
app.get("/v2/recommendations/:name", function (req, res) {
  let recommendations = []; 
  const recFormats = []; 
  const disruptedUsers = getDisruptedUsers(users, disruptions);
  const name = req.params.name;
  const user = disruptedUsers.find((user) => user.getName() === name);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if(user.getRole() === Role.DRIVER) {

    const riders_original = getRiders(users);
    const riders = getRiders(disruptedUsers);

    for(let i = 0; i < riders.length; i++) {
      if(isValidRider(user, riders[i])) {
        recommendations.push(riders_original[i]);
      }
    }
  }

  if(user.getRole() === Role.RIDER) {
    const drivers_original = getDrivers(users); 
    const drivers = getDrivers(disruptedUsers); 

    for(let i = 0; i < drivers.length; i++) {
      if(isValidDriver(user, drivers[i])) {
        recommendations.push(drivers_original[i]);
      }
    }
  }

    recommendations = sort(user, recommendations);

  for(let i = 0; i < recommendations.length; i++) {
    recFormats.push(recommendations[i].toString());
  }

  res.send(recFormats); 

});

/**
 * Returns a list of all drivers.
 * Used in the debugging process.
 */
app.get("/get-drivers", function (req, res) {
  const drivers = [];

  for(let i = 0; i < users.length; i++) {
    if(users[i].getRole() === "Driver") {
      drivers.push(users[i].toString());
    }
  }

  res.send(drivers);
});

/**
 * Returns a list of all riders. 
 * Used in the debugging process.
 */
app.get("/get-riders", function (req, res) {
  const drivers = [];

  for(let i = 0; i < users.length; i++) {
    if(users[i].getRole() === "Rider") {
      drivers.push(users[i].toString());
    }
  }

  res.send(drivers);
});


/**
 * Creates a disruption object and addes it to the lists of disruptions.
 */
app.post("/disruption", function (req, res) {

  const locationData = req.body.location;
  const location = new Position(locationData.x, locationData.y);
  const radius = req.body.radius;
  const delayHours = req.body.delayHours;
  const delayMinutes = req.body.delayMinutes;

  const disruption = new Disruption(location, radius, delayHours, delayMinutes);

  if (!isValidDisruption(disruption)) {
    return res.status(400).json({ error: "Invalid user data"});
  }

  disruptions.push(disruption);

  res.send(disruption.toString());
});



app.listen(PORT, () => console.log(`Local server is listening on port http://localhost:${PORT}`));

// ----------------------------------------------------------------

/**
 * Verifies if a given user is valid.
 * @param {User} user the user to verify. 
 * @returns {boolean} true if the user is valid, and false otherwise.
 */
function isValidUser(user) {

  //Remove trailing spaces
  if(user.getName() !== user.getName().trim()) {
    return false;
  }

  //check if that username already exists
  // if(userNames.includes(user.getName())) {
  //   return false; 
  // }

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
/**
 * Determines if a given disruption is valid.
 * A user s valid if all of the following criteria are met:
 * 1. The disruption must have a location object with x and y fields, both of which are integers.
 * 2. The disruption must have a radius object that is a positive integer.
 * 3. The disruption must have a delayHours object that is an integer between 0 and 23 (inclusive).
 * 4. The disruption must have a delayMinutes object that is an integer between 0 and 59 (inclusive).
 * @param {Disruption} disruption the disruption to check.
 * @returns {boolean} true if the disruption is valid, and false otherwise. 
 */
function isValidDisruption(disruption) {
  const cond1 = !isNotAnInteger(disruption.getLocation().getX() || disruption.getLocation().getY());
  const cond2 = (!isNotAnInteger(disruption.getRadius()) && disruption.getRadius() > 0);
  const cond3 = (!isNotAnInteger(disruption.getDelayHours()) && disruption.getDelayHours() >= 0 && disruption.getDelayHours() <= 23);
  const cond4 = (!isNotAnInteger(disruption.getDelayMinutes()) && disruption.getDelayMinutes() >= 0 && disruption.getDelayMinutes() <= 59);

  return (cond1 && cond2 && cond3 && cond4); 
}

/**
 * Determines if a given number is an integer or not.
 * @param {number} num the number to verify. 
 * @returns {boolean} true if the number is an integer, and false otherwise. 
 */
function isNotAnInteger(num) {
  return !(num % 1 === 0);
}

/**
 * Determines if a given number represents a valid hour.
 * Valid hours for NUCarpool are between 0 and 23 (inclusive).
 * @param {number} num the number representing an hour.
 * @returns {boolean} true if the number is a valid hour, and false otherwise.
 */
function isNotCorrectHour(num) {
  return !(num <= 23 && num >= 0);
}

/**
 * Determines if a given number represents a valid minute.
 * Valid minutes for NUCarpool are between 0 and 59 (inclusive).
 * @param {number} num the number representing an minute.
 * @returns {boolean} true if the number is a valid minute, and false otherwise.
 */
function isNotCorrectMinute(num) {
  return !(num <= 59 && num >= 0);
}

/**
 * Verifies if a given role is valid.
 * A valid role for NUCarpool is either a Rider or a Driver.
 * @param {Role} role the role "enum" to verify. 
 * @returns {boolean} true if the role is a valid role, and false otherwise.
 */
function isValidRole(role) {
  return (role === "Driver" || role === "Rider");
}

/**
 * Returns a list of all users that are Riders.
 * @param {Array} all_users an array of User objects.
 * @returns {Array} an array of Users that are Riders.
 */
function getRiders(all_users) {
  const riders = []; 
  for(let i = 0; i < all_users.length; i++) {
    if(all_users[i].getRole() === "Rider") {
      riders.push(all_users[i]);
    }
  }

  return riders; 
}

/**
 * Returns a list of all users that are Drivers.
 * @param {Array} all_users an array of User objects.
 * @returns {Array} an array of Users that are Drivers.
 */
function getDrivers(users) {
  const drivers = [];
  for(let i = 0; i < users.length; i++) {
    if(users[i].getRole() === "DRIVER") {
      drivers.push(users[i]);
    }
  }

  return drivers; 
}

/**
 * Determines if a rider (a User) is a valid recommendation for a driver.
 * A rider is valid if it meets the following criteria:
 * 1. The Rider's start location is within 25 miles (inclusive) of their Driver's start location.
 * 2. The Rider's end location is within 50 miles (inclusive) of the Driver's end location.
 * 3. The Rider's start time must be no earlier than 30 minutes before, and no later than 1 hour later than the Driver's start time.
 * 4. The Rider's end time must be no earlier than 1 hour before, and no later than 30 minutes later than the Driver's end time. 
 * @param {User} user the driver to recommend for.
 * @param {User} rider the rider to check against user.
 * @returns {boolean} true if rider is a valid rider recommedation for user, and false otherwise.
 */
  function isValidRider(user, rider) {
    const cond1 = user.getStartLocation().distanceBetween(rider.getStartLocation()) <= 25;
    const cond2 = user.getEndLocation().distanceBetween(rider.getEndLocation()) <= 50;

    const cond3 = (isBefore(rider.getStartHour(), rider.getStartMinute(), user.getStartHour(), user.getStartMinute()) 
                  && timeBetween(rider.getStartHour(), rider.getStartMinute(), user.getStartHour(), user.getStartMinute()) <= 30)
                  ||
                  (!isBefore(rider.getStartHour(), rider.getStartMinute(), user.getStartHour(), user.getStartMinute()) 
                  && timeBetween(user.getStartHour(), user.getStartMinute(), rider.getStartHour(), rider.getStartMinute()) <= 60);
                  
    const cond4 = (isBefore(rider.getEndHour(), rider.getEndMinute(), user.getEndHour(), user.getEndMinute()) 
                  && timeBetween(rider.getEndHour(), rider.getEndMinute(), user.getEndHour(), user.getEndMinute()) <= 60)
                  ||
                  (!isBefore(rider.getEndHour(), rider.getEndMinute(), user.getEndHour(), user.getEndMinute()) 
                  && timeBetween(user.getEndHour(), user.getEndMinute(), rider.getEndHour(), rider.getEndMinute()) <= 30);
  
    return cond1 && cond2 && cond3 && cond4;
  }

  /**
   * Determines if a driver (a User) is a valid recommendation for a user.
   * A driver is valid if it meets the following criteria:
   * 1. The Rider's start location is within 25 miles (inclusive) of their Driver's start location.
   * 2. The Rider's end location is within 50 miles (inclusive) of the Driver's end location.
   * 3. The Rider's start time must be no earlier than 30 minutes before, and no later than 1 hour later than the Driver's start time.
   * 4. The Rider's end time must be no earlier than 1 hour before, and no later than 30 minutes later than the Driver's end time. 
   * @param {User} user the rider to recommend for.
   * @param {User} driver the driver to check against user.
   * @returns {boolean} true if driver is a valid recommedation for user, and false otherwise.
   */
  function isValidDriver(user, driver) {
    const cond1 = driver.getStartLocation().distanceBetween(user.getStartLocation()) <= 25;
    const cond2 = driver.getEndLocation().distanceBetween(user.getEndLocation()) <= 50;

    const cond3 = (isBefore(driver.getStartHour(), driver.getStartMinute(), user.getStartHour(), user.getStartMinute()) 
                  && timeBetween(driver.getStartHour(), driver.getStartMinute(), user.getStartHour(), user.getStartMinute()) <= 60)
                  ||
                  (!isBefore(driver.getStartHour(), driver.getStartMinute(), user.getStartHour(), user.getStartMinute()) 
                  && timeBetween(user.getStartHour(), user.getStartMinute(), driver.getStartHour(), driver.getStartMinute()) <= 30);
                  
    const cond4 = (isBefore(driver.getEndHour(), driver.getEndMinute(), user.getEndHour(), user.getEndMinute()) 
                  && timeBetween(driver.getEndHour(), driver.getEndMinute(), user.getEndHour(), user.getEndMinute()) <= 30)
                  ||
                  (!isBefore(driver.getEndHour(), driver.getEndMinute(), user.getEndHour(), user.getEndMinute()) 
                  && timeBetween(user.getEndHour(), user.getEndMinute(), driver.getEndHour(), driver.getEndMinute()) <= 60);
  
    return cond1 && cond2 && cond3 && cond4;
  }

  /**
   * Returns the time between the start and end time in minutes.
   * @param {number} startHour the hour part of the start time. 
   * @param {number} startMinute the minute part of the start time. 
   * @param {number} endHour the hour part of the end time.
   * @param {number} endMinute the minute part of the end time.
   * @returns {number} the time between the start time and end time. 
   */
  
  function timeBetween(startHour, startMinute, endHour, endMinute) {
    const minutesPerHour = 60;
    const startTotalMinutes = startHour * minutesPerHour + startMinute;
    const endTotalMinutes = endHour * minutesPerHour + endMinute;
    
    if (startTotalMinutes > endTotalMinutes) {
      return (endTotalMinutes + (24 * minutesPerHour)) - startTotalMinutes;
    } else {
      return endTotalMinutes - startTotalMinutes;
    }
  }

  /**
   * Returns if a given start time is before or after a given end time.
   * @param {number} startHour the hour part of the start time. 
   * @param {number} startMinute the minute part of the start time. 
   * @param {number} endHour the hour part of the end time.
   * @param {number} endMinute the minute part of the end time.
   * @returns {boolean} true if the start time is before the end time, false otherwise.
   */

  function isBefore(startHour, startMinute, endHour, endMinute) {
    if (startHour < endHour) {
      return true;
    } else if (startHour === endHour && startMinute < endMinute) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Sorts a list of Users based on the following criteria:
   * 1. First, sort by sum of: distance from start locations plus distance from end locations. 
   * 2. Next, sort by sum of the difference between driver and rider start times plus the difference between driver and rider end times
   * 3. If any users remain with matching data, sort alphabetically.
   * @param {User} user the user to sort based off of. 
   * @param {Array} recs the Array of Users representing recommendations for that user. 
   * @returns 
   */
  function sort(user, recs) {
    recs.forEach(rec => {
      const startDiff = user.getStartLocation().distanceBetween(rec.getStartLocation());
      const endDiff = user.getEndLocation().distanceBetween(rec.getEndLocation());
      const timeDiff = timeBetween(user.getStartHour(), user.getStartMinute(), rec.getStartHour(), rec.getStartMinute()) +
                       timeBetween(user.getEndHour(), user.getEndMinute(), rec.getEndHour(), rec.getEndMinute());
  
      rec.distance = startDiff + endDiff;
      rec.timeDiff = timeDiff;
    });
  
    recs.sort((a, b) => {
      if (a.distance === b.distance) {
        if (a.timeDiff === b.timeDiff) {
          return a.getName().localeCompare(b.getName());
        }
        return a.timeDiff - b.timeDiff;
      }
      return a.distance - b.distance;
    });
  
    recs.forEach(rec => {
      delete rec.distance;
      delete rec.timeDiff;
    });
  
    return recs;
  }

  /**
   * Determines of a location is disrupted or not. 
   * @returns {boolean} true if a location is inside a disruption region (circle), and false otherwise.
   */
  function isDisrupted(location, disruption) {
    return location.distanceBetween(disruption.getLocation()) <= disruption.getRadius(); 
  }

  /**
   * Gets all users that are disrupted (i.e. fall in the areas of disruption circles).
   * @param {Array} users a list of all Users to filter by 
   * @param {Array} disruptions a list of all Disruptions to filter with.  
   * @returns Returns a list of all users after disruptions have been taken into account.
   */
  function getDisruptedUsers(users, disruptions) {
    // Create a new array to store disrupted users
    let disruptedUsers = [];
  
    // Iterate over each user
    for (let user of users) {
      let isStartLocationDisrupted = false;
      let isEndLocationDisrupted = false;

      let startDisruption = 0;
      let endDisruption = 0;
  
      // Check if user's start or end location is disrupted
      for (let disruption of disruptions) {
        if (isDisrupted(user.getStartLocation(), disruption)) {
          isStartLocationDisrupted = true;
          startDisruption = disruption.getDelayTimeInMinutes(); 
        }
        if (isDisrupted(user.getEndLocation(), disruption)) {
          isEndLocationDisrupted = true;
          endDisruption = disruption.getDelayTimeInMinutes(); 
        }
      }
  
      // Create a new User object with the same properties as the original user
      let disruptedUser = new User(
        user.getName(),
        user.getStartLocation(),
        user.getEndLocation(),
        user.getStartHour(),
        user.getStartMinute(),
        user.getEndHour(),
        user.getEndMinute(),
        user.getRole()
      );
      // Adjust the user's start and end time if their location is disrupted
      if (isStartLocationDisrupted) {
        let adjustedStartTime = addTime(user.getStartHour(), user.getStartMinute(), -1 * startDisruption);
        disruptedUser.setStartHour(adjustedStartTime[0]);
        disruptedUser.setStartMinute(adjustedStartTime[1]);
      }
  
      if (isEndLocationDisrupted) {
        let adjustedEndTime = addTime(user.getEndHour(), user.getEndMinute(), endDisruption);
        disruptedUser.setEndHour(adjustedEndTime[0]);
        disruptedUser.setEndMinute(adjustedEndTime[1]);
      }
  
      // Add the disrupted user to the array
      disruptedUsers.push(disruptedUser);
    }
  
    // Return the array of disrupted users
    return disruptedUsers;
  }
  
  /**
   * Adds a given amount of time (in minutes) to the given time, and formats accordingly. 
   * @param {number} startHour the starting time hour portion. 
   * @param {number} startMinute the starting time minute portion. 
   * @param {number} minutes the amount of minutes to add to the starting time. 
   * @returns {Array} a list with two elements: the resulting hour, and the resulting minute. 
   */
  function addTime(startHour, startMinute, minutes) {
    var totalMinutes = startHour * 60 + startMinute;
    
    if (minutes >= 0) {
      totalMinutes += minutes;
    } else {
      totalMinutes -= Math.abs(minutes);
    }
    
    var newHour = (totalMinutes / 60) % 24;
    if (newHour < 0) {
      newHour += 24;
    }
    
    var newMinute = totalMinutes % 60;
    
    return [Math.floor(newHour), newMinute];
  }
  
/**
 * Represents an "enum" representing a Role.
 * At this time, a User's role in NUCarpool can either be a Driver or a Rider.
 */
const Role = {
  DRIVER: "Driver",
  RIDER: "Rider"
}