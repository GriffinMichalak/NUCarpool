/**
 * Represents a user object for NUCarpool.
 * A user has a name, start location, end location, start hour, start minute, end hour, end minute, and a role.
 */
class User {
    #name;
    #startLocation;
    #endLocation;
    #startHour;
    #startMinute;
    #endHour;
    #endMinute;
    #role;
  
    /**
     * The constructor for the User class. 
     * @param {String} name the name of this User. 
     * @param {Position} startLocation the start location of this User.
     * @param {Position} endLocation the end location of this User.
     * @param {number} startHour the start time's hour portion for this User.
     * @param {number} startMinute the start time's minute portion for this User.
     * @param {number} endHour the end times's time portion for this User. 
     * @param {number} endMinute the end time's minute portion for this User.
     * @param {Role} role the role for this User (either Rider or Driver).
     */
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
  
    /**
     * Gets the name of this User.
     * @returns {String} the name of this User. 
     */
    getName() {
      return this.#name;
    }
  
    /**
     * Gets the start location of this User.
     * @returns {Position} the start location of this User.
     */
    getStartLocation() {
      return this.#startLocation;
    }
  
    /**
     * Gets the end location of this User.
     * @returns {Position} the end location of this User.
     */
    getEndLocation() {
      return this.#endLocation;
    }
  
    /**
     * Gets the hour portion of this User's start time.
     * @returns {number} the start hour of this User.
     */
    getStartHour() {
      return this.#startHour; 
    }
  
    /**
     * Gets the minute portion of this User's start time.
     * @returns {number} the start minute of this User.
     */
    getStartMinute() {
      return this.#startMinute;
    }
  
    /**
     * Gets the hour portion of this User's end time.
     * @returns {number} the end hour of this User.
     */
    getEndHour() {
      return this.#endHour;
    }
  
    /**
     * Gets the minute portion of this User's end time.
     * @returns {number} the end minute of this User.
     */
    getEndMinute() {
      return this.#endMinute;
    }
  
    /**
     * Gets the role object of this User. 
     * @returns {Role} the role of this User. 
     */
    getRole() {
      return this.#role; 
    }
  
    /**
     * Sets the name of this User to the one specified. 
     * @param {String} name the name to assign to this User. 
     */
    setName(name) {
      this.#name = name;
    }
  
    /**
     * Sets the start location of this User to the one specified. 
     * @param {Position} startLocation  the start location to assign to this User.
     */
    setStartLocation(startLocation) {
      this.#startLocation = startLocation;
    }
  
    /**
     * Sets the end location of this User to the one specified. 
     * @param {Position} endLocation the end location to assign to this User.
     */
    setEndLocation(endLocation) {
      this.#endLocation = endLocation;
    }
  
    /**
     * Sets the start hour of this User to the one specified. 
     * @param {number} startHour the start hour to assign to this User.
     */
    setStartHour(startHour) {
      this.#startHour = startHour;
    }
  
    /**
     * Sets the end minute of this User to the one specified.
     * @param {number} startMinute the start minute to assign to this User.
     */
    setStartMinute(startMinute) {
      this.#startMinute = startMinute;
    }
  
    /**
     * Sets the end hour of this User to the one specified.
     * @param {number} endHour the end hour to assign to this User.
     */
    setEndHour(endHour) {
      this.#endHour = endHour;
    }
  
    /**
     * Sets the end minute of this User to the one specified.
     * @param {number} endMinute the end minute to assign to this User. 
     */
    setEndMinute(endMinute) {
      this.#endMinute = endMinute;
    }
  
    /**
     * Sets the role of this User to the one specified. 
     * @param {Role} role the Role to assign to this User. 
     */
    setRole(role) {
      this.#role = role;
    }
  
    /**
     * Displays all information in the User class as a formatted String. 
     * @returns {String} the formatted data of this class. 
     */
    toString() {
      let startHourFormat = "" + this.#startHour;
      let startMinuteFormat = "" + this.#startMinute;
      let endHourFormat = "" + this.#endHour;
      let endMinuteFormat = "" + this.#endMinute; 
  
      if(this.#startHour < 10) {
        startHourFormat = "0" + this.#startHour; 
      }
  
      if(this.#startMinute < 10) {
        startMinuteFormat = "0" + this.#startMinute; 
      }
  
      if(this.#endHour < 10) {
        endHourFormat = "0" + this.#endHour; 
      }
  
      if(this.#endMinute < 10) {
        endMinuteFormat = "0" + this.#endMinute; 
      }
  
      
      return ("Name: " + this.#name + " ~ " + 
      "Start Location: " + this.#startLocation.toString() + " ~ " + 
      "End Location: " + this.#endLocation.toString() + " ~ " + 
      "Start Time: " + startHourFormat + ":" + startMinuteFormat + " ~ " +
      "End Time: " + endHourFormat + ":" + endMinuteFormat + " ~ " +
      "Role: " + this.#role
      );
    }
  }

  module.exports = User;