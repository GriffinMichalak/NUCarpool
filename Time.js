/**
 * Represents a time object for the NUCarpool app.
 * A time object has a number of hours and minutes. 
 */
class Time {
    #hour;
    #minute;
  
    constructor(hour, minute) {
      this.#hour = hour;
      this.#minute = minute;
    }
  
    getHour() {
      return this.#hour;
    }
  
    getMinute() {
      return this.#minute;
    }
  
    /**
     * Adds the specified number of minutes to the time object,
     * and reformats as needed.
     * @param {number} numMinutes
     */
    addTime(numMinutes) {
      const totalMinutes = this.#hour * 60 + this.#minute + numMinutes;
      this.#hour = Math.floor(totalMinutes / 60) % 24;
      this.#minute = totalMinutes % 60;
    }
  
    /**
     * Returns true if this time object is before another time object,
     * and false otherwise.
     * @param {Time} anotherTime
     * @returns {boolean}
     */
    isBefore(anotherTime) {
      if (this.#hour < anotherTime.getHour()) {
        return true;
      } else if (this.#hour === anotherTime.getHour()) {
        return this.#minute < anotherTime.getMinute();
      }
      return false;
    }
  
    /**
     * Returns true if this time object is after another time object,
     * and false otherwise.
     * @param {Time} anotherTime
     * @returns {boolean}
     */
    isAfter(anotherTime) {
      return !this.isBefore(anotherTime) && !this.isEqual(anotherTime);
    }
  
    /**
     * Calculates the time between this time and another time.
     * @param {Time} anotherTime
     * @returns {number} The time difference in minutes as a positive integer.
     */
    timeBetween(anotherTime) {
      const thisTotalMinutes = this.#hour * 60 + this.#minute;
      const anotherTotalMinutes = anotherTime.getHour() * 60 + anotherTime.getMinute();
      return Math.abs(thisTotalMinutes - anotherTotalMinutes);
    }
  
    /**
     * Returns a string representation of the time in the format "HH:MM".
     * @returns {string} the formatted time. 
     */
    toString() {
      const formattedHour = this.#hour.toString().padStart(2, '0');
      const formattedMinute = this.#minute.toString().padStart(2, '0');
      return `${formattedHour}:${formattedMinute}`;
    }
  }
  
  module.exports = Time; 