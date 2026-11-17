import { Bullet } from './Bullet';
import { Constants } from './Constants';

// A red bullet fired by an invader that travels down the screen.
export class InvaderBullet extends Bullet {
  // Builds the bullet with the invader bullet settings (positive speed = down).
  constructor(x: number, y: number) {
    const { speed, width, height, color } = Constants.InvaderBullet;
    super(x, y, speed, width, height, color);
  }
}
