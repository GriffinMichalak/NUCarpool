
/**
 * Represents a Disruption object.
 * A Disruption object has a location, a radius, a delayHours, and a delayMinutes. 
 * Disruptions are circles centered a particular (x,y) point. 
 */
class Disruption {
    #location
    #radius
    #delayHours
    #delayMinutes
  
    /**
     * The constructor for a Disruption object.
     * @param {Position} location the coordinates of the center of the Disruption.
     * @param {number} radius the radius of the circle spanning the Disruption's affected area.
     * @param {number} delayHours the hour portion of the Disruption's delay time.
     * @param {number} delayMinutes the minute portion of the Disruption's delay time.
     */
    constructor(location, radius, delayHours, delayMinutes) {
      this.#location = location;
      this.#radius = radius;
      this.#delayHours = delayHours;
      this.#delayMinutes = delayMinutes; 
    }
  
    /**
     * Gets the location of the Disruption. 
     * @returns {Position} the coordinates of the location representing the center point of this Disruption. 
     */
    getLocation() {
      return this.#location;
    }
  
    /**
     * Gets the radius spanning the Disruption. 
     * @returns {number} the radius of this Disruption. 
     */
    getRadius() {
      return this.#radius; 
    }
  
    /**
     * Gets the hour portion of the Disruption's duration. 
     * @returns {number} the delay hours of this Disruption. 
     */
    getDelayHours() {
      return this.#delayHours;
    }
  
    /**
     * Gets the minute portion of the Disruption's duration. 
     * @returns {number} the delay minutes of this Disruption. 
     */
    getDelayMinutes() {
      return this.#delayMinutes; 
    }
  
    /**
     * Gets the total time of of the Disruption's duration. 
     * @returns {number} the delay time of this Disruption in minutes. 
     */
    getDelayTimeInMinutes() {
      return (60 * this.#delayHours + this.#delayMinutes); 
    }
  
    /**
     * Formats and retunrs the information in this class. 
     * @returns {String} the formatted data for this Disruption. 
     */
    toString() {
      return ("Location: " + this.#location.toString() + " ~ " + 
      "Radius: " + this.#radius + " ~ " + 
      "Delay Time: " + this.#delayHours + " h " + this.#delayMinutes + " m"
      );
    }
  }

  module.exports = Disruption;