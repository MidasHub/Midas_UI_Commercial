/**
 * Calculate a Luhn (Mod10) checksum
 *   -or-
 * Verify the Luhn checksum of a credit card or IMEI number
 *
 * This implementation was adapted from the following sources:
 *   - https://en.wikipedia.org/w/index.php?title=Luhn_algorithm&oldid=688221366
 *   - https://gist.github.com/ShirtlessKirk/2134376
 */

import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LuhnService {
  private computed = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];

  constructor() { }

  /* Calculates the Luhn checksum */
  private calculate(digits: any) {
    const sum = this.sum(digits, false);
    return (sum * 9) % 10;
  }

  /* Sum each digit from right to left, and double
     every second digit. If the double exceeds 9,
     then sum its digits (i.e., 654321 -> 358341
     -> 24) */
  private sum(digits: any, even: boolean) {
    let sum = 0;
    let digit = 0;
    let i = digits.length;

    while (i--) {
      digit = Number(digits[i]);
      sum += (even = !even) ? this.computed[digit] : digit;
    }
    return sum;
  }

  /* Verifies if a number is a valid Luhn checksum */
  private verify(digits: any) {
    const sum = this.sum(digits, true);
    return sum > 0 && sum % 10 === 0;
  }

  /* Appends a Luhn checksum to the end of a number */
  public createLuhnId(number: any) {
    const digits = String(number);
    return digits + this.calculate(digits);
  }

  /* Checks if a credit card or IMEI number is valid */
  public isLuhnId(number: any): boolean {
    return this.verify(String(number));
  }


}
