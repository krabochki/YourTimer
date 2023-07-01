import { InjectionToken } from '@angular/core';

export const COLORPRESETS = new InjectionToken('COLORPRESETS');
export const ACTIVE_COLORPRESET = new InjectionToken('ACTIVE_COLORPRESET');

export interface ColorPreset {
  name: string;
  properties: any;
}

export interface ColorPresetOptions {
  colorpreset: ColorPreset[];
  active: string;
}
