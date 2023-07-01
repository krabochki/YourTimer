import {
  AfterContentInit,
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { AppComponent } from '../app.component';
import { ThemeDirective } from '../theme/theme.directive';
@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
        }),
        animate(
          '0.7s ease-out',
          style({
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        style({
          opacity: 1,
        }),
        animate(
          '0.3s ease-in',
          style({
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class TimeComponent implements AfterContentInit, AfterViewInit, OnInit {
  constructor(public appcomponent: AppComponent) {}
  ngAfterViewInit(): void {
    this.setcoords();
  }
  ngAfterContentInit(): void {
    this.setcoords();
    this.screenWidth = window.innerWidth;

  }

  private mobiletime: String = '';
  private mobilehours = '00';
  private mobileminutes = '00';
  private mobileseconds = '00';
  private timerTime = [0, 0, 0];
  private buferTimerTime = [0, 0, 0];
  private MainTimeOut: any;
  protected stoptim: any;
  private bufer: String = '';
  protected time = ['.', '.', '.', '.', '.', '.'];
  protected values = ['', 'h', '', 'm', '', 's'];
  private ideal: any;
  private startX: number = 0;
  protected animateSec: number = 0;
  protected screenWidth: number;
  private currentsec: any;
  private currenthour: any;
  private currentmin: any;
  protected inputnum: String;
  protected props = [false, false, false, false, true, false, false, false];
  protected alert: boolean = false;
  protected notify: boolean = false;
  protected buttons = ['restart', 'stop'];
  private vibroSound = new Audio('assets/ringtones/Vibro.mp3');
  private ringtoneSound = new Audio();
  private _nameofcurrenttimer: any;
  private _language: string;
  private _vibro: any;
  private _duration: any;
  private _volume: any;
  private _song: string;
  private _theme: string;
  private _input: boolean = false;
  private datereal = new Date();
  private milli: any;
  protected fastpanel: boolean;
  protected timemore = false;
  protected secondsago = 0;
  protected minutesago = 0;
  protected hoursago = 0;
  protected fake = false;
  protected delay = 0;
  protected ifclass = [[false], [false], [false]];
  private coords = [
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  ngOnInit(): void {
    if (!localStorage.getItem('fastpanel')) {
      localStorage.setItem('fastpanel', 'false');
    }
    this.fastpanel = localStorage.getItem('fastpanel') === 'true';

    if (localStorage.getItem('inputnum')) {
      this.inputnum = localStorage.getItem('inputnum')!;
      this.checkbufer();
    }

    this.ifclass[0][0] = true;
    this.ifclass[1][0] = true;
    this.ifclass[2][0] = true;
    this.requestPermission();

    let bufer_time_has_passed_while_session =
      sessionStorage.time_has_passed_while_session;
    let timerstate = sessionStorage.getItem('timer_state');
    let sessionhour = sessionStorage.session_hour;
    let sessionmin = sessionStorage.session_minute;
    let sessionsec = sessionStorage.session_second;
    let sessiontime = new Date();
    sessiontime.setHours(sessionhour);
    sessiontime.setMinutes(sessionmin);
    sessiontime.setSeconds(sessionsec);
    sessiontime.setMilliseconds(0);
    let today = new Date();
    today.setSeconds(0);
    today.setMinutes(0);
    today.setHours(0);
    today.setMilliseconds(0);

    let daytime = 24 * 3600 * 1000;
    let last_active: Date = new Date(sessionStorage.time_when_timer_active);
    last_active.setMilliseconds(sessionStorage.time_when_timer_active_ms);

    if (timerstate == 'play') {
      let last_active: Date = new Date(sessionStorage.time_when_timer_active);
      last_active.setMilliseconds(sessionStorage.time_when_timer_active_ms);
      let has_passed_from_close: number;
      has_passed_from_close = new Date().getTime() - last_active.getTime();
      sessionStorage.time_has_passed_while_session =
        Number(sessionStorage.time_has_passed_while_session) +
        has_passed_from_close;
      if (new Date().getTime() - last_active.getTime() > daytime) {
        timerstate = 'stop';
        sessionStorage.setItem('timer_state', 'stop');
        sessionStorage.removeItem('time_when_timer_active');
        sessionStorage.removeItem('time_when_timer_active_ms');
        sessionStorage.removeItem('session_timer_name');
        sessionStorage.removeItem('session_hour');
        sessionStorage.removeItem('session_second');
        sessionStorage.removeItem('session_minute');
        sessionStorage.removeItem('time_has_passed');
        sessionStorage.removeItem('time_has_passed_while_session');
      }
    }

    if (timerstate == 'play' || timerstate == 'pause') {
      if (
        sessionStorage.time_has_passed_while_session <
        sessiontime.getTime() - today.getTime()
      ) {
        let current_time: Date;

        this.changeTimerName(sessionStorage.getItem('session_timer_name')!);

        if (timerstate == 'play') {
          current_time = new Date(
            sessiontime.getTime() - sessionStorage.time_has_passed_while_session
          );
        } else {
          current_time = new Date(
            sessiontime.getTime() - sessionStorage.time_has_passed_while_session
          );
        }
        this.delay =
          -1 *
          Number(
            (sessionStorage.time_has_passed_while_session / 1000).toFixed(3)
          );

        this.timerTime[0] = current_time.getHours();
        this.timerTime[1] = current_time.getMinutes();
        this.timerTime[2] = current_time.getSeconds();
        this.buferTimerTime[0] = Number(sessionhour);
        this.buferTimerTime[1] = Number(sessionmin);
        this.buferTimerTime[2] = Number(sessionsec);

        this.props[5] == false;
        this.input == true;

        this.datereal.setMilliseconds(current_time.getMilliseconds());

        this.start();
        this.changeInput(true);

        if (timerstate == 'pause') {
          this.pause();
          this.milli = Number(current_time.getMilliseconds());
          sessionStorage.time_has_passed_while_session = Number(
            bufer_time_has_passed_while_session
          );
          this.props[4] = true;
          this.props[0] = true;
          this.props[1] = true;
          this.props[5] = true;
          this.props[3] = true;
          setTimeout(() => {
            this.updateTranslatenInSettings();
          });
        }
      } else {
        let x =
          sessionStorage.time_has_passed_while_session -
          (sessiontime.getTime() - today.getTime());
        this.secondsago = Math.round(x / 1000);
        if (this.secondsago >= 60) {
          this.minutesago = Math.trunc(this.secondsago / 60);
          this.secondsago = this.secondsago - this.minutesago * 60;
        }
        if (this.minutesago >= 60) {
          this.hoursago = Math.trunc(this.minutesago / 60);
          this.minutesago = this.minutesago - this.hoursago * 60;
        }
        this.timemore = true;
        this.props[3] = true;
        this.props[6] = true;
        this.delay = -10000;
        this.props[7] = true;
        this.fakeEnd();
      }
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    if (sessionStorage.getItem('timer_state') == 'play') {
      sessionStorage.time_has_passed_while_session =
        Number(sessionStorage.time_has_passed_while_session) +
        Number(sessionStorage.time_has_passed);
    }

    sessionStorage.time_when_timer_active = new Date();
    sessionStorage.time_when_timer_active_ms = new Date().getMilliseconds();
  }

  private fakeEnd() {
    if (this._song != '') {
      this.ringtoneSound.pause();
      this.ringtoneSound.currentTime = 0;
      this.ringtoneSound = new Audio('assets/ringtones/' + this._song + '.mp3');
      this.ringtoneSound.volume = this._volume / 100;
      this.ringtoneSound.addEventListener(
        'ended',
        function () {
          this.currentTime = 0;
          this.play();
        },
        false
      );
      this.ringtoneSound.play();
    }

    this.fake = true;
    this.input = false;
    this.props[2] = true;
    this.timerNotify();
    this.props[4] = false;
    setTimeout(() => {
      this.props[2] = false;
      this.props[4] = true;
      this.props[7] = false;
      this.timemore = false;
      this.stop();
    }, this._duration * 1000);
    sessionStorage.setItem('timer_state', 'stop');
  }

  protected play() {
    if (this.props[5] == false) {
      if (this.input) {
        if (this.screenWidth > 1160) {
          let check = this.bufer.replaceAll('.', '');
          check = check.replaceAll('0', '');
          if (
            this.inputnum != '' &&
            Number(this.inputnum) <= 235959 &&
            Number(this.inputnum) > 0
          ) {
            this.init();
            this.changeInput(true);
          } else {
            this.alert = true;
            setTimeout(() => {
              this.updateTranslatenInSettings();
            });
          }
        } else {
          this.mobiletime =
            (this.mobilehours + this.mobileminutes + this.mobileseconds).replaceAll(' ','');

            if (this.screenWidth < 1160) {
            if (this.mobiletime != '000000') {
              for (let i = 0; i <= this.mobiletime.length - 1; i++) {
                this.time[i] = this.mobiletime[i];
              }
            } else {
              for (let i = 0; i <= this.mobiletime.length - 1; i++) {
                this.time[i] = '.';
              }
            }
          }
          let mobilecheck = this.mobiletime.replaceAll('.', '');
          mobilecheck = mobilecheck.replaceAll('0', '');
          if (
            mobilecheck &&
            this.mobilehours + this.mobileminutes + this.mobileseconds !=
              '000000'
          ) {
            this.init();
            this.changeInput(true);
          } else {
            this.alert = true;
            setTimeout(() => {
              this.updateTranslatenInSettings();
            });
          }
        }
      } else {
        this.pause();
      }
    } else {
      this.playagain();
    }
  }

  private init() {
    localStorage.removeItem('inputnum');

    let justtime = ['', '', ''];
    this.datereal.setMilliseconds(0);
    for (let i = 0; i <= justtime.length - 1; i++) {
      justtime[i] = this.time[i * 2] + this.time[i * 2 + 1];
    }
    for (let i = 0; i <= justtime.length - 1; i++) {
      for (let j = 0; j <= justtime.length - 1; j++) {
        if (justtime[i][j] == '.') {
          justtime[i] = justtime[i].replace('.', '0');
        }
      }
    }
    for (let i = 1; i <= justtime.length - 1; i++) {
      if (Number(justtime[i]) >= 60) {
        justtime[i] = String(Number(justtime[i]) - 60);
        justtime[i - 1] = String(Number(justtime[i - 1]) + 1);
      }
    }
    this.timerTime[0] = Number(justtime[0]);
    this.timerTime[1] = Number(justtime[1]);
    this.timerTime[2] = Number(justtime[2]) + 1;

    sessionStorage.time_has_passed_while_session = Number(0);

    sessionStorage.setItem('session_timer_name', this._nameofcurrenttimer);

    this.buferTimerTime[0] = this.timerTime[0];
    this.buferTimerTime[1] = this.timerTime[1];
    this.buferTimerTime[2] = this.timerTime[2];
    sessionStorage.session_hour = this.timerTime[0];
    sessionStorage.session_minute = this.timerTime[1];
    sessionStorage.session_second = this.timerTime[2];


    let hours = String(this.timerTime[0]);
    let minutes = String(this.timerTime[1]);
    let seconds = String(this.timerTime[2]);

    if (hours.length == 1 && hours != '0') {
      hours = '.' + hours;
    } else if (hours == '0') {
      hours = '..';
    }
    if (minutes.length == 1 && minutes != '0') {
      minutes = '.' + minutes;
    } else if (minutes == '0') {
      minutes = '..';
    }
    if (seconds.length == 1 && seconds != '0') {
      seconds = '.' + seconds;
    } else if (seconds == '0') {
      seconds = '..';
    }

    let timertime = hours + minutes + seconds;


    for (let i = 0; i <= timertime.length - 1; i++) {
      if (timertime[i] != '0' && timertime[i] != '.') {
        for (let j = i; j <= timertime.length - 1; j++) {
          if (timertime[j] == '.') {
            timertime =
              timertime.substring(0, j) +
              '0' +
              timertime.substring(j + '0'.length);
          }
        }
      }
      for (let i = 0; i <= this.time.length - 1; i++) {
        this.time[i] = timertime[i];
      }
    }



  
    for (let i = 0; i <= this.time.length - 1; i++) {
      this.buftime[i] = this.time[i];
    }


    if(this.buftime[5]=='0'){
      this.buftime[5] = '9';
      this.buftime[4] = String(Number(this.buftime[4]) - 1);
    }
    else {
    this.buftime[5] = String(Number(this.buftime[5]) - 1);
    }

    this.start();
  }

  buftime = ['.', '.', '.', '.', '.', '.'];
  private start() {
    let y = true;
    let today = new Date();
    today.setSeconds(0);
    today.setMinutes(0);
    today.setHours(0);
    this.datereal.setHours(this.timerTime[0]);
    this.datereal.setMinutes(this.timerTime[1]);
    this.datereal.setSeconds(this.timerTime[2]);

    const instance = () => {
      this.ideal = new Date().getTime() - this.startX;
      sessionStorage.time_has_passed = this.ideal;
      let today = new Date();
      today.setSeconds(0);
      today.setMilliseconds(0);
      today.setHours(0);
      today.setMinutes(0);
      this.milli = String(
        this.datereal.getTime() - today.getTime() - this.ideal
      );
      let x = new Date();
      sessionStorage.setItem('timer_state', 'play');
      x.setTime(this.datereal.getTime() - this.ideal);
      this.timerTime[0] = x.getHours();
      this.timerTime[1] = x.getMinutes();
      this.timerTime[2] = x.getSeconds();
      let hours = String(this.timerTime[0]);
      let minutes = String(this.timerTime[1]);
      let seconds = String(this.timerTime[2]);
      if (hours.length == 1 && hours != '0') {
        hours = '.' + hours;
      } else if (hours == '0') {
        hours = '..';
      }
      if (minutes.length == 1 && minutes != '0') {
        minutes = '.' + minutes;
      } else if (minutes == '0') {
        minutes = '..';
      }
      if (seconds.length == 1 && seconds != '0') {
        seconds = '.' + seconds;
      } else if (seconds == '0') {
        seconds = '..';
      }

      let timertime = hours + minutes + seconds;

      for (let i = 0; i <= timertime.length - 1; i++) {
        if (timertime[i] != '0' && timertime[i] != '.') {
          for (let j = i; j <= timertime.length - 1; j++) {
            if (timertime[j] == '.') {
              timertime =
                timertime.substring(0, j) +
                '0' +
                timertime.substring(j + '0'.length);
            }
          }
        }
        for (let i = 0; i <= this.time.length - 1; i++) {
          this.time[i] = timertime[i];
        }
      }

      if (this.buftime.toString() != '.,.,.,.,.,.') {
        if (this.time > this.buftime) {
          for (let i = 0; i <= this.time.length - 1; i++) {
            this.time[i] = this.buftime[i];
          }
        }
      }

      this.MainTimeOut = setTimeout(instance, 5);
      if (
        this.timerTime[0] == 0 &&
        this.timerTime[1] == 0 &&
        this.timerTime[2] < 1
      ) {
        playstop();
        if (document.visibilityState == 'hidden') {
          this.timerNotify();
        }
        y = true;
      }
      if (
        this.buferTimerTime[0] * 3600 * 1000 +
          this.buferTimerTime[1] * 60 * 1000 +
          this.buferTimerTime[2] * 1000 -
          1000 <
        this.ideal - 1000
      ) {
        y = false;
        let x = String(
          this.ideal -
            (this.buferTimerTime[0] * 3600 * 1000 +
              this.buferTimerTime[1] * 60 * 1000 +
              this.buferTimerTime[2] * 1000 -
              1000)
        );
        for (let i = 0; i <= 2; i++) {
          x = x.substring(0, x.length - 1);
        }
        this.secondsago = Number(x);
        if (this.secondsago >= 60) {
          this.minutesago = Math.trunc(this.secondsago / 60);
          this.secondsago = this.secondsago - this.minutesago * 60;
        }
        if (this.minutesago >= 60) {
          this.hoursago = Math.trunc(this.minutesago / 60);
          this.minutesago = this.minutesago - this.hoursago * 24;
        }
        this.timerNotify();
        playstop();
      }
    };

    const playstop = () => {
      sessionStorage.setItem('timer_state', 'stop');
      this.props[2] = true;
      for (let i = 0; i <= this.time.length - 1; i++) {
        this.time[i] = '.';
      }
      this.props[7] = true;
      clearTimeout(this.MainTimeOut);
      clearTimeout(this.stoptim);
      if (this._song != '') {
        this.ringtoneSound.pause();
        this.ringtoneSound.currentTime = 0;
        this.ringtoneSound = new Audio(
          'assets/ringtones/' + this._song + '.mp3'
        );
        this.ringtoneSound.volume = this._volume / 100;
        this.ringtoneSound.addEventListener(
          'ended',
          function () {
            this.currentTime = 0;
            this.play();
          },
          false
        );
        this.ringtoneSound.play();
      }
      this.props[1] = false;
      if (y == true) {
        this.notify = true;
      } else {
        this.timemore = true;
      }
      setTimeout(() => {
        this.updateTranslatenInSettings();
      });
      setTimeout(() => {
        var highestTimeoutId = setTimeout(';');
        for (var i = 0; i < highestTimeoutId; i++) {
          clearTimeout(i);
        }
        clearTimeout(this.stoptim);
        this.props[7] = false;
        this.notify = false;
        this.timemore = false;
        this.stop();
        if (this._song != 'none') {
          this.ringtoneSound.load();
        }
      }, this._duration * 1000);
    };

    setTimeout(() => {
      this.updateTranslatenInSettings();
    });
    this.props[1] = true;
    this.animateSec =
      this.buferTimerTime[0] * 60 * 60 +
      this.buferTimerTime[1] * 60 +
      this.buferTimerTime[2] -
      1;
    //создаем скорость таймера, счетчик итераций и задаем временной штамп для начала отсчета
    this.startX = new Date().getTime();
    if (
      this.timerTime[0] > 0 ||
      this.timerTime[1] > 0 ||
      this.timerTime[2] > 0
    ) {
      this.props[0] = true;
      instance();
    }
    this.stoptim = setTimeout(() => {
      sessionStorage.setItem('timer_state', 'stop');
      playstop();
      y = true;
      this.timerNotify();
    }, this.timerTime[0] * 3600 * 1000 + this.timerTime[1] * 60 * 1000 + this.timerTime[2] * 1000);
    setTimeout(() => {
      this.props[3] = true;
    });
    this.props[6] = true;
  }

  protected stop() {
    for (let i = 0; i <= this.buftime.length - 1; i++) {
      this.buftime[i] = '.';
    }

    sessionStorage.removeItem('time_when_timer_active');
    sessionStorage.removeItem('time_when_timer_active_ms');
    sessionStorage.removeItem('session_timer_name');
    sessionStorage.removeItem('session_hour');
    sessionStorage.removeItem('session_second');
    sessionStorage.removeItem('session_minute');
    sessionStorage.removeItem('time_has_passed');
    sessionStorage.removeItem('time_has_passed_while_session');
    sessionStorage.setItem('timer_state', 'stop');

    this.delay = 0;

    this.fake = false;

    if (this.props[5] == true) {
      this.props[4] = false;
      this.props[0] = true;
      this.props[1] = false;
      this.props[5] = false;
    }

    this.ideal = 0;
    this.props[0] = false;
    this.props[2] = false;

    clearTimeout(this.MainTimeOut);
    clearTimeout(this.stoptim);

    var highestTimeoutId = setTimeout(';');
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }

    this.ringtoneSound.load();

    for (let i = 0; i <= this.time.length - 1; i++) {
      this.time[i] = '.';
    }
    this.timerTime[0] = 0;
    this.timerTime[1] = 0;
    this.timerTime[2] = 0;
    this.props[1] = false;
    this.props[3] = false;
    this.inputnum = '';
    this.input = true;
    this.props[4] = false;
    this.datereal = new Date();
    this.changeInput(false);
    this.mobilehours = '00';
    this.mobileminutes = '00';
    this.mobileseconds = '00';

    for (let i = 0; i <= 99; i++) {
      this.ifclass[0][i] = false;
      this.ifclass[1][i] = false;
      this.ifclass[2][i] = false;
    }

    this.ifclass[0][0] = true;
    this.ifclass[1][0] = true;
    this.ifclass[2][0] = true;
    this.changeTimerName('');
    this.minutesago = 0;
    this.hoursago = 0;
    this.secondsago = 0;
    setTimeout(() => {
      this.updateTranslatenInSettings();
    });
    setTimeout(() => {
      this.setcoords();
    }, 100);
  }

  protected reset() {
    if (this.props[5] == true) {
      this.props[4] = false;
      this.props[0] = true;
      this.props[1] = false;
      this.start();
      this.props[5] = false;
    }
    this.props[3] = false;
    this.delay = 0;
    this.timerTime[0] = this.buferTimerTime[0];
    this.timerTime[1] = this.buferTimerTime[1];
    this.timerTime[2] = this.buferTimerTime[2];
    sessionStorage.session_hour = this.timerTime[0];
    sessionStorage.session_minute = this.timerTime[1];
    sessionStorage.session_second = this.timerTime[2];
    clearTimeout(this.MainTimeOut);
    clearTimeout(this.stoptim);
    this.props[0] = false;
    this.props[1] = false;
    this.props[6] = false;
    this.datereal.setMilliseconds(0);
    sessionStorage.time_has_passed_while_session = 0;

    this.start();
  }

  private pause() {
    sessionStorage.time_has_passed_while_session =
      Number(sessionStorage.time_has_passed_while_session) +
      Number(sessionStorage.time_has_passed);

    sessionStorage.time_has_passed = 0;
    sessionStorage.setItem('timer_state', 'pause');
    this.props[5] = true;
    this.props[4] = true;
    this.props[0] = false;
    var highestTimeoutId = setTimeout(';');
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
    clearTimeout(this.MainTimeOut);
    clearTimeout(this.stoptim);
    this.props[6] = false;
  }

  private playagain() {
    this.props[4] = false;
    this.props[0] = true;
    this.props[1] = false;
    this.ideal = 0;
    this.datereal = new Date();
    this.datereal.setMilliseconds(this.milli);

    this.start();
    this.props[5] = false;
  }

  protected showfastpanel() {
    this.fastpanel = !this.fastpanel;
    setTimeout(() => {
      this.updateTranslatenInSettings();
    });

    localStorage.setItem('fastpanel', String(this.fastpanel));
  }

  protected addTime(time: number) {
    if (!this.inputnum) {
      this.inputnum = String(time);
    } else {
      this.inputnum = String(Number(this.inputnum) + time);
    }
    this.checkbufer();
  }

  protected changetime(time: number) {
    if (this.screenWidth > 1160) {
      if (time == 0) {
        this.inputnum = '';
      } else {
        this.inputnum = String(time);
      }
      this.checkbufer();
    } else {
      if (time == 15) {
        this.mobilehours = '00';
        this.mobileminutes = '00';
        this.mobileseconds = '15';
      }
      if (time == 30) {
        this.mobilehours = '00';
        this.mobileminutes = '00';
        this.mobileseconds = '30';
      }
      if (time == 100) {
        this.mobilehours = '00';
        this.mobileminutes = '01';
        this.mobileseconds = '00';
      }
      if (time == 500) {
        this.mobilehours = '00';
        this.mobileminutes = '05';
        this.mobileseconds = '00';
      }
      if (time == 1000) {
        this.mobilehours = '00';
        this.mobileminutes = '10';
        this.mobileseconds = '00';
      }
      if (time == 1500) {
        this.mobilehours = '00';
        this.mobileminutes = '15';
        this.mobileseconds = '00';
      }
      if (time == 2000) {
        this.mobilehours = '00';
        this.mobileminutes = '20';
        this.mobileseconds = '00';
      }
      if (time == 3000) {
        this.mobilehours = '00';
        this.mobileminutes = '30';
        this.mobileseconds = '00';
      }
      if (time == 4500) {
        this.mobilehours = '00';
        this.mobileminutes = '45';
        this.mobileseconds = '00';
      }
      if (time == 10000) {
        this.mobilehours = '01';
        this.mobileminutes = '00';
        this.mobileseconds = '00';
      }
      if (time == 20000) {
        this.mobilehours = '02';
        this.mobileminutes = '00';
        this.mobileseconds = '00';
      }

      this.play();
    }
  }

  protected numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  private checkbufer() {
    this.bufer = this.inputnum;
    if (this.bufer != '') {
      for (let i = 0; i < 6; i++) {
        if (this.bufer.length == i) {
          this.bufer = '.'.repeat(6 - i) + this.bufer;
        }
      }
      for (let i = 0; i <= this.time.length - 1; i++) {
        this.time[i] = this.bufer[i];
      }
    } else {
      for (let i = 0; i <= this.time.length - 1; i++) {
        this.time[i] = '.';
      }
    }
    localStorage.setItem('inputnum', String(this.inputnum));
  }

  protected typeTime(): void {
    this.bufer = this.inputnum;
    this.checkbufer();
  }

  protected changeInput(new_input: boolean): void {
    this.newInput.emit(!new_input);
    this._input = !new_input;
    this.input = !new_input;
    this.props[4] = !new_input;
  }

  protected changeTimerName(new_name: string) {
    this.newName.emit(new_name);
    this._nameofcurrenttimer = new_name;
    this.nameofcurrenttimer = new_name;
  }

  protected close() {
    var highestTimeoutId = setTimeout(';');
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
    clearTimeout(this.MainTimeOut);
    clearTimeout(this.stoptim);
    this.props[7] = false;
    this.notify = false;
    this.stop();
  }

  protected closetimemore() {
    var highestTimeoutId = setTimeout(';');
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
    clearTimeout(this.MainTimeOut);
    clearTimeout(this.stoptim);
    this.props[7] = false;
    this.timemore = false;
    this.stop();
  }

  private updateTranslatenInSettings(): void {
    this.appcomponent.updateTranslate();
  }

  private setcoords() {
    try {
      let xCoord = [];
      let yCoord =
        document.getElementById('ul1')!.offsetHeight / 2 +
        document.getElementById('ul1')!.getBoundingClientRect().top;
      for (let i = 0; i <= 2; i++) {
        xCoord[i] =
          document.getElementById('ul' + (i + 1))!.offsetWidth / 2 +
          document.getElementById('ul' + (i + 1))!.getBoundingClientRect().left;
      }
      for (let i = 0; i <= 2; i++) {
        this.coords[i][0] = xCoord[i];
        this.coords[i][1] = yCoord;
      }
    } catch {}
  }

  protected scroll(column: number) {
    for (let i = 0; i <= 99; i++) {
      this.ifclass[column][i] = false;
    }

    let el = document.elementFromPoint(
      this.coords[column][0],
      this.coords[column][1]
    )?.innerHTML;

    this.ifclass[column][
      Number(
        document.elementFromPoint(
          this.coords[column][0],
          this.coords[column][1]
        )?.innerHTML
      )
    ] = true;

    
    if (column == 0) {
      this.mobilehours = String(el);

      if (this.currenthour != String(el)) {
        this.vibrate();
      }
      this.currenthour = String(el);
    } else if (column == 1) {
      this.mobileminutes = String(el);
      if (this.currentmin != String(el)) {
        this.vibrate();
      }
      this.currentmin = String(el);
    } else {
      this.mobileseconds = String(el);
      if (this.currentsec != String(el)) {
        this.vibrate();
      }
      this.currentsec = String(el);
    }

  }

  private vibrate() {
    if (this._vibro == 'on') {
      this.vibroSound.volume = 0.3;
      this.vibroSound.pause();
      this.vibroSound.currentTime = 0;
      var nopromise = {
        catch: new Function(),
      };
      (this.vibroSound.play() || nopromise).catch(function () {});
      try {
        window.navigator.vibrate(100);
      } catch {

      }
    }
  }

  private requestPermission() {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        // Поддержка устаревшей версии с функцией обратного вызова.
        resolve(result);
      });
      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then(function (permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error('Permission not granted.');
      }
    });
  }

  private sendNotification(title: any, options: any) {
    if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if (permission === 'granted') {
          var notification = new Notification(title, options);
        }
      });
    }
  }

  private timerNotify() {
    let x =
      'assets/pictures/favicons/' +
      localStorage.getItem('preset')?.toLowerCase() +
      '.png';
    let y, w;
    if (this.language == 'Russian') {
      y = 'Твой таймер';
      if (
        localStorage.getItem('session_timer_name') != '' &&
        localStorage.getItem('session_timer_name') != null
      ) {
        y = 'Твой таймер "' + localStorage.getItem('session_timer_name') + '"';
      }
      w = 'Время таймера подошло к концу!';
    } else {
      y = 'Your timer';
      if (
        localStorage.getItem('session_timer_name') != '' &&
        localStorage.getItem('session_timer_name') != null
      ) {
        y = 'Your timer "' + localStorage.getItem('session_timer_name') + '"';
      }
      w = 'The timer time has come to an end!';
    }
    this.sendNotification(y, {
      body: w,
      icon: x,
      dir: 'auto',
      vibrate: [200, 100, 200],
    });
  }



  @Output() newInput = new EventEmitter<boolean>();
  @Output() newName = new EventEmitter<string>();
  @Input()
  get input(): boolean {
    return this._input;
  }
  set input(input: boolean) {
    this._input = input;
  }
  @Input()
  get theme(): string {
    return this._theme;
  }
  set theme(theme: string) {
    this._theme = theme;
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
    return this._duration;
  }
  set volume(volume: any) {
    this._volume = volume;
  }
  @Input()
  get nameofcurrenttimer(): string {
    return this._theme;
  }
  set nameofcurrenttimer(nameofcurrenttimer: string) {
    this._nameofcurrenttimer =
      (nameofcurrenttimer && nameofcurrenttimer.trim()) || '';
  }
  @Input()
  get song(): string {
    return this._song;
  }
  set song(song: string) {
    this._song = (song && song.trim()) || '';
  }
  @Input()
  get vibro(): string {
    return this._vibro;
  }
  set vibro(vibro: string) {
    this._vibro = (vibro && vibro.trim()) || 'off';
  }
  @Input()
  get language(): string {
    return this._language;
  }
  set language(language: string) {
    if (language == this._language) {
    } else this.setcoords();
    this._language = (language && language.trim()) || '';
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1140 && !this.props[1]) {
      this.setcoords();
    }
  }
}
