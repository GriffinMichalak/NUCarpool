/**
 * Represents a Position object. A Position has an x-coordinate and a y-coordinate.
 */
class Position {
    #x
    #y
  
    /**
     * 
     * @param {number} x the x-coordinate of this Position.
     * @param {number} y the y-coordinate of this Position.
     */
    constructor(x, y) {
      this.#x = x;
      this.#y = y;
    }
  
    /**
     * Calculates the distance between this position and another position. 
     * @param {Position} anotherPosition 
     * @returns {number} distance between this position the other position. 
     */
    distanceBetween(anotherPosition) {
      return Math.sqrt(
        Math.pow(this.#x - anotherPosition.getX(), 2) +
        Math.pow(this.#y - anotherPosition.getY(), 2)
      );
    }
  
    /**
     * Gets the x-value of this Position. 
     * @returns {number} the x-coordinate of this Position. 
     */
    getX() {
      return this.#x;
    }
  
    /**
     * Gets the y-value of this Position.
     * @returns {number} the y-coordinate of this Position. 
     */
    getY() {
      return this.#y;
    }
  
    /**
     * Formats and returns the information of this class.
     * @returns {String} the data of this Position of the form '(x, y)'. 
     */
    toString() {
      return `(${this.#x}, ${this.#y})`;
    }

    /**
     * Determins if two Postions are equal.
     * Equality is determined by if the x- and y-coordinates are the same. 
     * @param {Position} otherPostion 
     * @returns true if the positions are equal, false otherwise. 
     */
    equals(otherPostion) {
      return (this.#x === otherPostion.getX() && this.#y === otherPostion.getY()); 
    }
  }

  module.exports = Position; 