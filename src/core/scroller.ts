import { Point } from '../libs/point'
import { Update } from '../libs/update'
import { Val } from '../libs/val'
import { Tween } from './tween'

export class Scroller {
  private static _instance: Scroller

  public old: Point = new Point()
  public val: Point = new Point()
  public easeVal: Point = new Point()
  public rate: Point = new Point()
  public power: Point = new Point()
  public dist: Point = new Point()
  public moveRate: Val = new Val()

  private _cnt: number = 0
  private _updateHandler: any

  public static get instance(): Scroller {
    if (!this._instance) {
      this._instance = new Scroller()
    }
    return this._instance
  }

  constructor() {
    this._updateHandler = this._update.bind(this)
    Update.instance.add(this._updateHandler)
  }

  public set(val: number): void {
    window.scrollTo(0, val)
  }

  public move(val: number): void {
    Tween.a(
      this.moveRate,
      {
        val: [this.val.y, val],
      },
      0.5,
      0,
      Tween.Power2EaseInOut,
      null,
      () => {
        window.scrollTo(0, this.moveRate.val)
      },
    )
  }

  private _update(): void {
    this.old.copy(this.val)
    this.val.y = Math.max(0, window.pageYOffset || document.documentElement.scrollTop)
    this.easeVal.y += (this.val.y - this.easeVal.y) * 0.1

    if (this._cnt == 0) {
      this.old.copy(this.val)
    }

    const ease = 0.1
    const powerTg = this.old.y - this.val.y
    this.power.y += (powerTg - this.power.y) * ease

    this.dist.y += (this.old.y - this.val.y - this.dist.y) * ease

    this._cnt++
  }
}
