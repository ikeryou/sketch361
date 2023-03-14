import { MyDisplay } from "../core/myDisplay";
import { Func } from "../core/func";
import { Tween } from "../core/tween";
import { TextItem } from "./textItem";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _parentTxt: HTMLElement;
  private _blocksEl: HTMLElement;

  private _line: number = Func.val(5, 8);
  private _items: Array<TextItem> = [];
  private _order: Array<TextItem> = [];

  constructor(opt:any) {
    super(opt)

    this._parentTxt = this.qs('.js-text-org') as HTMLElement;
    this._blocksEl = this.qs('.js-text-blocks') as HTMLElement;

    const num = this._line * this._line;
    for(let i = 0; i < num; i++) {
      const b = document.createElement('div');
      b.classList.add('js-text-item');
      this._blocksEl.append(b);
      b.append(this._parentTxt.cloneNode(true));

      const item = new TextItem({
        el: b,
      });
      this._items.push(item);

      this._order.push(item);
    }

    this._updateItemSize();
  }


  private _updateItemSize(): void {
    const sw = Func.sw();
    const sh = Func.sh();

    const fontSize = Math.min(sw, sh) * Func.val(0.28, 0.35);
    Tween.set(this._parentTxt, {
      fontSize:  fontSize,
    });

    const txtSize = this.getRect(this._parentTxt);
    const txtWidth = txtSize.width;
    const txtHeight = txtSize.height;

    // console.log(txtWidth, txtHeight);

    const blockWidth = txtWidth / this._line;
    const blockHeight = txtHeight / this._line;

    Tween.set(this._parentTxt, {
      x: sw * 0.5 - txtWidth * 0.5,
      y: sh * 0.5 - txtHeight * 0.5,
    })

    this._items.forEach((val,i) => {
      const key = i;

      const ix = ~~(key / this._line);
      const iy = ~~(key % this._line);

      const x = ix * blockWidth + sw * 0.5 - txtWidth * 0.5;
      const y = iy * blockHeight + sh * 0.5 - txtHeight * 0.5

      Tween.set(val.el, {
        width: blockWidth,
        height: blockHeight,
        left: x,
        top: y,
        opacity: 1,
      })

      Tween.set(val.inner, {
        // x: -ix * blockWidth,
        // y: -iy * blockHeight,
        fontSize: fontSize,
      })

      val.pos.width = blockWidth;
      val.pos.x = x + blockWidth * 0.5;
      val.pos.y = y + blockHeight * 0.5;

      val.innerPos.x = -ix * blockWidth;
      val.innerPos.y = -iy * blockHeight;
    })
  }

  protected _update(): void {
    super._update();

    if(this._c % 30 == 0) {
      this._updateItemSize();
    }
  }

  protected _resize(): void {
    super._resize();
  }
}