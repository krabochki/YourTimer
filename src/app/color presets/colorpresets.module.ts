import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorPresetService } from './colorpreset.service';
import { ColorDirective } from './colorpresets.directive';
import { COLORPRESETS, ACTIVE_COLORPRESET, ColorPresetOptions } from './symbols';

@NgModule({
  imports: [CommonModule],
  providers: [ColorPresetService],
  declarations: [ColorDirective],
  exports: [ColorDirective]
})
export class ColorPresetModule {
  static forRoot(options: ColorPresetOptions): ModuleWithProviders<ColorPresetModule> {
    return {
      ngModule: ColorPresetModule,
      providers: [
        {
          provide: COLORPRESETS,
          useValue: options.colorpreset
        },
        {
          provide: ACTIVE_COLORPRESET,
          useValue: options.active
        }
      ]
    };
  }
}
