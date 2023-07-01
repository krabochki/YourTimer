import { Injectable, Inject, EventEmitter } from '@angular/core';
import { COLORPRESETS, ACTIVE_COLORPRESET, ColorPreset } from '../color presets/symbols';

@Injectable()
export class ColorPresetService {

  colorpresetChange = new EventEmitter<ColorPreset>();

  constructor(
    @Inject(COLORPRESETS) public colorpresets: ColorPreset[],
    @Inject(ACTIVE_COLORPRESET) public colorpreset: string
  ) {
  }

  getActiveColorPreset() {
    const colorpreset = this.colorpresets.find(t => t.name === this.colorpreset);
    if (!colorpreset) {
      throw new Error(`Theme not found: '${this.colorpreset}'`);
    }
    return colorpreset;
  }

  setColorPreset(name: string) {
    this.colorpreset = name;
    this.colorpresetChange.emit( this.getActiveColorPreset());
  }

}
