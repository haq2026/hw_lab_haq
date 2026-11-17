// Axis-aligned box used for collision checks.
export type Bounds = { left: number; right: number; top: number; bottom: number };

// Base class for every bullet. Speed is positive going down, negative going up.
export class Bullet {
  id: string;
  x: number;
  y: number;
  speed: number;
  width: number;
  height: number;
  color: string;
  shouldRemove = false;

  // Creates a bullet centered horizontally on x.
  constructor(x: number, y: number, speed: number, width: number, height: number, color: string) {
    this.id = `bullet_${Date.now()}_${Math.random()}`;
    this.x = x - width / 2;
    this.y = y;
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  // Moves the bullet one frame.
  update() { this.y += this.speed; }

  // True once the bullet has fully left the top or bottom of the screen.
  isOffScreen(screenHeight: number): boolean {
    return this.y < -this.height || this.y > screenHeight + this.height;
  }

  // Returns the bullet's box for collision checks.
  getBounds(): Bounds {
    return { left: this.x, right: this.x + this.width, top: this.y, bottom: this.y + this.height };
  }
}
