import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ColorPresetService } from './colorpreset.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColorPreset } from './symbols';

@Directive({
  selector: '[app-colorpreset]'
})
export class ColorDirective implements OnInit {

  private unsubscribe = new Subject();
  constructor(
    private _elementRef: ElementRef,
    private _colorpresetService: ColorPresetService
  ) {}

  ngOnInit() {
    const active = this._colorpresetService.getActiveColorPreset();
    if (active) {
      this.updateColorPreset(active);
    }
    this._colorpresetService.colorpresetChange.pipe(takeUntil(this.unsubscribe))
      .subscribe((colorpreset: ColorPreset) => this.updateColorPreset(colorpreset));
  }

  updateColorPreset(colorpreset: ColorPreset) {
    for (const key in colorpreset.properties) {
      this._elementRef.nativeElement.style.setProperty(key, colorpreset.properties[key]);
    }
  }

}
