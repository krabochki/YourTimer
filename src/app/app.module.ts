import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ThemeModule } from './theme/theme.module';
import { ColorPresetModule } from './color presets/colorpresets.module';
import { lightTheme } from './theme/light-theme';
import { darkTheme } from './theme/dark-theme';
import { TimeComponent } from './time/time.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FoxyPreset } from './color presets/Foxy';
import { HippoPreset } from './color presets/Hippo';
import { PegasusPreset } from './color presets/Pegas';
import { PiggyPreset } from './color presets/Piggy';
import { UnicornPreset } from './color presets/Uniqe';
import { ParrotPreset } from './color presets/Parrot';
import { DragonPreset } from './color presets/Drago';
import { OctopusPreset } from './color presets/Octy';
import { DuckyPreset } from './color presets/Chick';
import { OwlPreset } from './color presets/Owl';
import { TigraPreset } from './color presets/Tigra';
import { CrocoPreset } from './color presets/Croco';
import { RaffPreset } from './color presets/Raff';
import { CherryPreset } from './color presets/Cherry';
import { ElliePreset } from './color presets/Ellie';
import { MichaelPreset } from './color presets/Michael';
import { LolitaPreset } from './color presets/Lolita';
import { CapyPreset } from './color presets/Capy';
@NgModule({
  
  imports:[ 
    BrowserModule,
    FormsModule,
    [BrowserModule, BrowserAnimationsModule],

    ReactiveFormsModule,
    ThemeModule.forRoot({
      themes: [lightTheme, darkTheme],
      active: 'light'
    }),
    ColorPresetModule.forRoot({
      colorpreset: [FoxyPreset, HippoPreset,PegasusPreset, PiggyPreset, UnicornPreset, OwlPreset, ElliePreset, OctopusPreset, DuckyPreset, ParrotPreset, TigraPreset, CapyPreset,RaffPreset, CherryPreset, DragonPreset,MichaelPreset,LolitaPreset,CrocoPreset],
      active: 'Parrot'
    })
  ],
  declarations: [ AppComponent, TimeComponent, SettingsComponent ],  
  providers: [],
  bootstrap:    [ AppComponent ],
})
export class AppModule { }


