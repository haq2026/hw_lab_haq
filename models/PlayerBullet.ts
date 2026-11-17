import { Bullet } from './Bullet';
import { Constants } from './Constants';

// A green bullet fired by the player that travels up the screen.
export class PlayerBullet extends Bullet {
  // Builds the bullet with the player's bullet settings (negative speed = up).
  constructor(x: number, y: number) {
    const { speed, width, height, color } = Constants.Player.bullet;
    super(x, y, -speed, width, height, color);
  }
}
