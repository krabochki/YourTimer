import { Component, OnDestroy, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { AppComponent } from '../app.component';

const settingsOptions: string[][] = [
  ['Language', 'Choose timer language'],
  ['Sound', 'Tune timer sound'],
  ['Theme', 'Create own design'],
];
const isItOpen: boolean[] = [false, false, false];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate(
          '0.75s ease-out',
          style({ opacity: 1, height: '*'})
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*' }),
        animate(
          '0.75s ease',
          style({ opacity: 0, height: 0, 'padding-bottom': '0rem' })
        ),
      ]),
    ]),
  ],
})

export class SettingsComponent implements OnInit, OnDestroy {
  constructor(public appcomponent: AppComponent) { }
  ngOnDestroy(): void {
    if (!this.audio.paused) {
      for (let i = 0; i <= this.ringtones.length - 1; i++) {
        this.ringtones[i][2] = false;

        let audio = this.audio
        audio.volume = 1;

        let intId = setInterval(function () {
          try {
            audio.volume -= 0.01;
            audio.volume = Number(audio.volume.toFixed(2))
          }
          catch { }
          if (audio.volume <= 0.01) {
            audio.currentTime = 0;
            audio.pause()
            clearInterval(intId);
          }
        }, 400)
      }
    }
  }

  updateTranslatenInSettings(): void {
    this.appcomponent.updateTranslate();

  }


  ngOnInit(): void {
    let w = Number(localStorage.getItem('scrollSettings')!) / 100;

    let x= document.getElementsByClassName('img_wrap')[0].clientHeight; // Value of scroll Y in px


    let h=x*w;



    setTimeout(() => {
      document.getElementsByClassName('img_wrap')[0].scrollTop=h;

    }, 0);
    
 
 

     

    this.isItOpen[0] = localStorage.getItem('Language') === 'true';
    this.isItOpen[1] = localStorage.getItem('Sound') === 'true';
    this.isItOpen[2] = localStorage.getItem('Theme') === 'true';
    this.isItOpen[3] = localStorage.getItem('Ringtones') === 'true';
    this.isItOpen[4] = localStorage.getItem('Themes') === 'true';
    this.dsl[0] = false;
    this.dsl[1] = false;
    this.dsl[2] = false;
    if (localStorage.getItem('language') == 'Russian') {
      this.timeval = 'с';
    } else {
      this.timeval = 's';
    }
    this.val = this._duration + this.timeval;
  }

  protected dslthemes = false;
  protected dslringtones = false;
  protected title = 'Settings';
  protected settingsOptions: string[][] = settingsOptions;
  protected isItOpen: boolean[] = isItOpen;
  protected _song: string;
  protected _theme: string;
  protected _duration: number;
  protected _volume: number;
  protected _vibro: string;
  protected _preset: string;
  protected _language: string;
  protected _presetlist: any;
  protected ringtones = [
    ['Base', 20, false],
    ['Bomb', 12, false],
    ['Forest', 20, false],
    ['Future', 17, false],
    ['Bell', 20, false],
    ['Hi-Tech', 17, false],
    ['Midnight', 19, false],
    ['Oreo', 4, false],
    ['Wood', 17, false],
    ['Chill', 30, false],
    ['Techno', 19, false],
    ['Jump', 17, false],
    ['Morning', 18, false],
    ['Matrix', 14, false],
    ['Clarity', 19, false],
    ['Fairytale', 18, false],
  ];
  protected languages = [
    ['English', 'English'],
    ['Русский', 'Russian'],
  ];
  private timeval: string;
  protected dsl = new Array(3);
  private audio = new Audio();
  private now: any;
  private songstate: boolean;

  protected openSection(i: number) {
    this.updateTranslatenInSettings();

    isItOpen[i] = !isItOpen[i];
    this.dsl[i] = true;
    setTimeout(() => {
      this.dsl[i] = false;
    }, 850);

    localStorage.setItem(settingsOptions[i][0], String(isItOpen[i]));

    setTimeout(() => {

      this.updateTranslatenInSettings();
    }, 0);
  }
  protected openRingtones() {
    isItOpen[3] = !isItOpen[3];
    localStorage.setItem('Ringtones', String(isItOpen[3]));
    this.dslringtones = true;

    setTimeout(() => {
      this.dslringtones = false;
    }, 850);
    setTimeout(() => {
      this.updateTranslatenInSettings();
    }, 0);
  }
  protected openThemes() {
    isItOpen[4] = !isItOpen[4];
    localStorage.setItem('Themes', String(isItOpen[4]));
    this.dslthemes = true;
    setTimeout(() => {
      this.dslthemes = false;
    }, 850);

    setTimeout(() => {
      this.updateTranslatenInSettings();
    }, 0);
  }

  protected changeTheme(): void {
    if (this._theme == 'dark') {
      this.newTheme.emit('light');
      this._theme = 'light';
      this.theme = 'light';
    } else {
      this.newTheme.emit('dark');
      this._theme = 'dark';
      this.theme = 'dark';
    }
  }
  protected changeDuration(changeDuration: any) {
    this.newDuration.emit(changeDuration.target.value);
    this.duration = changeDuration.target.value;
    this._duration = changeDuration.target.value;
    this.val = String(this._duration) + this.timeval;
  }
  protected changeVolume(changeVolume: any) {
    this.newVolume.emit(changeVolume.target.value);
    this.volume = changeVolume.target.value;
    this._volume = changeVolume.target.value;
  }
  protected changeVibro() {
    if (this._vibro == 'on') {
      this.newVibro.emit('off');
      this.vibro = 'off';
      this._vibro = 'off';
    } else {
      this.newVibro.emit('on');
      this.vibro = 'on';
      this._vibro = 'on';
    }
  }
  protected changePreset(changePreset: string) {
    this.newPreset.emit(changePreset);
    this._preset = changePreset;
    this.preset = changePreset;
  }
  protected changeSong(changeSong: any) {
    if (changeSong == 'off') {
      if (this._song == 'none') {
        this.newSong.emit('Base');
        this._song = 'Base';
        this.song = 'Base';
      } else {
        this.newSong.emit('none');
        this._song = 'none';
        this.song = 'none';
      }
    } else {
      this.newSong.emit(changeSong);
      changeSong == 'on';
      this._song = changeSong;
      this.songstate = true;
      this.song = changeSong;
    }
  }
  protected volumechanged(e: any) {
    this.newVolume.emit(e.target.value);
    this._volume = e.target.value;
    this.volume = e.target.value;
  }
  protected durationchanged(e: any) {
    this.newDuration.emit(e.target.value);
    this._duration = e.target.value;
    this.duration = e.target.value;
  }
  protected changeLanguage(language: string) {
    this.newLanguage.emit(language);
    this._language = language;
    this.language = language;
    if (this.language == 'Russian') {
      this.timeval = 'с';
    } else {
      this.timeval = 's';
    }
    this.val = String(this._duration) + this.timeval;
  }
  val: string;

  protected playmusic(k: any) {
    for (let j = 0; j <= this.ringtones.length - 1; j++) {
      if (this.ringtones[j][2] == true)
        this.ringtones[j][2] = !this.ringtones[j][2];
    }
    this.ringtones[k][2] = !this.ringtones[k][2];
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio = new Audio('assets/ringtones/' + this.ringtones[k][0] + '.mp3');

    if (this.now == this.ringtones[k][0]) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.now = '';
      this.ringtones[k][2] = !this.ringtones[k][2];
    } else {
      this.audio.play();
      this.now = this.ringtones[k][0];
    }
    setTimeout(() => {
      this.stop(k);
    }, Number(this.ringtones[k][1]) * 1000);
  }

  private stop(m: number) {
    this.ringtones[m][2] = !this.ringtones[m][2];
  }

  @Input()
  get preset(): string {
    return this._preset;
  }
  set preset(preset: string) {
    this._preset = (preset && preset.trim()) || '<no  preset set>';
  }
  @Input()
  get song(): string {
    return this._song;
  }
  set song(song: string) {
    this._song = (song && song.trim()) || 'none';
  }
  @Input()
  get vibro(): string {
    return this._vibro;
  }
  set vibro(vibro: string) {
    this._vibro = (vibro && vibro.trim()) || '<no vibro state set>';
  }
  @Input()
  get duration(): any {
    return this._duration;
  }
  set duration(duration: any) {
    this._duration = duration;
  }
  @Input()
  get volume(): any {
    return this._volume;
  }
  set volume(volume: any) {
    this._volume = volume;
  }
  @Input()
  get theme(): string {
    return this._theme;
  }
  set theme(theme: string) {
    this._theme = (theme && theme.trim()) || '<no theme set>';
  }
  @Input()
  get presetslist(): Array<any> {
    return this._presetlist;
  }
  set presetslist(presetslist: Array<any>) {
    this._presetlist = presetslist;
  }
  @Input()
  get language(): string {
    return this._language;
  }
  set language(language: string) {
    this._language = (language && language.trim()) || 'none';
  }
  @Output() newTheme = new EventEmitter<string>();
  @Output() newSong = new EventEmitter<string>();
  @Output() newPreset = new EventEmitter<string>();
  @Output() newVibro = new EventEmitter<string>();
  @Output() newDuration = new EventEmitter<number>();
  @Output() newVolume = new EventEmitter<number>();
  @Output() newLanguage = new EventEmitter<string>();

  scrolling(){
   let x= document.getElementsByClassName('img_wrap')[0].clientHeight; // Value of scroll Y in px

   let y =document.getElementsByClassName('img_wrap')[0].scrollTop; // Value of scroll Y in px


    localStorage.setItem('scrollSettings',String(Math.round((y/x)*100)))


  }
}
