import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnInit,
} from '@angular/core';
import { ThemeService } from './theme/theme.service';
import { ColorPresetService } from './color presets/colorpreset.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { ColorPreset, COLORPRESETS } from './color presets/symbols';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('Blur', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.85s ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.85s ease-in', style({ opacity: 0 })),
      ]),
    ]),

    trigger('Settings', [
      transition(':enter', [
        style({ opacity: 0, left: -520 }),
        animate('0.85s ease-out', style({ opacity: 1, left: '0px' })),
      ]),
      transition(':leave', [
        animate('0.85s ease-in', style({ opacity: 0, left: -520 })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private themeService: ThemeService,
    private colorPresetService: ColorPresetService,
    @Inject(COLORPRESETS) public colorpresets: ColorPreset[]
  ) {}

  ngAfterViewInit(): void {
    this.updateTranslate();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  protected fullscreen = false;

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmodes() {
    this.fullscreen = !this.fullscreen;

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  compress_expand() {
    if (!this.fullscreen) {
      var body = document.documentElement;
      if (body.requestFullscreen) {
        body.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    setTimeout(() => {
      this.updateTranslate();
    }, 0);
  }

  protected title = 'Your timer';
  public timerOff = true;
  protected settings: boolean = false;
  protected timerName: string = '';
  presetslist = new Array();
  //элементы которые может поменять пользователь из настроек
  protected theme: string;
  protected preset: string;
  protected vibro: string;
  protected volume: number;
  protected language: string;
  protected duration: number;
  protected song: string;
  //иконка переменной значка сайта
  private favicon: HTMLElement = document.querySelector(
    '#appIcon'
  ) as HTMLElement;
  private apptitle: HTMLElement = document.querySelector(
    '#appTitle'
  ) as HTMLElement;
  protected dslsettings = false;

  ngOnInit(): void {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    if (localStorage.getItem('timernamewait')) {
      this.timerName = localStorage.getItem('timernamewait')!;
    }

    let w = 'light';
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      w = 'dark';
    }

    //берем данные из localStorage
    this.changeTheme(localStorage.getItem('theme') || w);
    this.changePreset(localStorage.getItem('preset') || 'Parrot');
    this.changeDuration(Number(localStorage.getItem('duration') || '10'));
    this.changeSong(localStorage.getItem('song') || 'Base');
    this.changeVibro(localStorage.getItem('vibro') || 'on');
    this.changeVolume(Number(localStorage.getItem('volume') || '50'));
    this.changeLanguage(localStorage.getItem('language') || 'English');
    this.settings = localStorage.getItem('settings') === 'true';

    for (let i = 0; i <= 5; i++) {
      let arrayIn = new Array();
      this.presetslist[i] = arrayIn;
      for (let j = 0; j <= 2; j++) {
        let arrayIn = new Array();
        this.presetslist[i][j] = arrayIn;
        try {
          this.presetslist[i][j][0] = this.colorpresets[i * 3 + j].name;
          this.presetslist[i][j][1] =
            this.colorpresets[i * 3 + j].properties['--first-accent-color-rgb'];
          this.presetslist[i][j][2] =
            this.colorpresets[i * 3 + j].properties[
              '--second-accent-color-rgb'
            ];
        } catch {}
      }
    }
  }

  // методы которые вызываются при изменении элементов в меню либо при запуске сайта для взятия значений из localStorage
  public changeTheme(new_theme: string): void {
    this.themeService.setTheme(new_theme);
    this.theme = new_theme;
    localStorage.setItem('theme', this.theme);
    setTimeout(() => {
      this.updateTranslate();
    });
  }
  public changeDuration(new_duration: number): void {
    this.duration = new_duration;
    localStorage.setItem('duration', String(this.duration));
  }
  public changeVolume(new_volume: number): void {
    this.volume = new_volume;
    localStorage.setItem('volume', String(this.volume));
  }
  public changeVibro(new_vibro: string): void {
    this.vibro = new_vibro;
    localStorage.setItem('vibro', this.vibro);
  }
  public changePreset(new_preset: string): void {
    this.colorPresetService.setColorPreset(new_preset);
    this.preset = new_preset;
    this.favicon.setAttribute(
      'href',
      'assets/pictures/favicons/' + this.preset.toLowerCase() + '.png'
    );
    localStorage.setItem('preset', this.preset);
  }
  public changeSong(new_song: string): void {
    this.song = new_song;
    localStorage.setItem('song', this.song);
  }
  public changeLanguage(new_lang: string): void {
    this.language = new_lang;
    localStorage.setItem('language', this.language);
    this.updateTranslate();
  }
  public changeInput(inp: boolean): void {
    this.timerOff = inp;
    localStorage.removeItem('timernamewait');
  }
  public resetName(name: string): void {
    this.timerName = name;
  }
  public openSettings(): void {
    //  var body = document.documentElement;
    //  if (body.requestFullscreen) {
    //   body.requestFullscreen();
    // }

    this.settings = !this.settings;
    localStorage.setItem('settings', String(this.settings));

    this.dslsettings = true;
    setTimeout(() => {
      this.dslsettings = false;
    }, 850);
    setTimeout(() => {
      this.updateTranslate();
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }
  timnametype() {
    this.timerName = this.timerName.trimStart();
    if (this.timerName.trim() == '') {
      this.timerName = this.timerName.trimEnd();
    }
    if (
      this.timerName[this.timerName.length - 1] +
        this.timerName[this.timerName.length - 2] ==
      '  '
    ) {
      this.timerName = this.timerName.slice(0, -1);
    }
    localStorage.setItem('timernamewait', this.timerName);
  }

  protected name: String;

  public updateTranslate() {
    let lan: string =
      this.language[0].toLowerCase() + this.language[1].toLowerCase();

    this.apptitle.innerHTML =
      this.language == 'English' ? 'Your timer' : 'Твой таймер';
    for (let key in this.langArr) {
      let elem = document.querySelector('.lng-' + key);
      if (elem) {
        elem.innerHTML = this.langArr[key][lan];
      }

      if (key == 's' || key == 'm' || key == 'h') {
        let elems: any;
        elems = document.getElementsByClassName('lng-' + key);
        for (let i = 0; i <= elems.length - 1; i++) {
          elems[i].innerHTML = this.langArr[key][lan];
        }
      }

      let elemplace = document.querySelector('.lng-placeholder-' + key);
      if (elemplace) {
        elemplace.setAttribute('placeholder', this.langArr[key][lan]);
      }
      let elemtitle = document.querySelector('.lng-title-' + key);
      if (elemtitle) {
        elemtitle.setAttribute('title', this.langArr[key][lan]);
      }
    }
  }
  validate(): boolean {
    if (/\S/.test(this.timerName)) {
      return true;
    } else {
      return false;
    }
  }

  langArr: any = {
    title: {
      ru: 'Твой таймер',
      en: 'Your timer',
    },

    notify: {
      ru: 'Оповещение',
      en: 'Notification',
    },
    notify2: {
      ru: 'Оповещение',
      en: 'Notification',
    },
    unfortunately: {
      ru: 'К сожалению, по каким-то причинам таймер не смог отправить тебе звуковое уведомление раньше. Скорее всего, твоё устройство было в спящем режиме! Таймер должен был прозвенеть ',
      en: "Unfortunately, for some reason, the timer couldn't send you an audio notification earlier. Most likely, your device was in sleep mode! The timer should have rung ",
    },
    secondsago: {
      ru: ' сек. назад.',
      en: ' sec ago.',
    },
    minutesago: {
      ru: ' мин. назад и',
      en: ' min ago and',
    },
    hoursago: {
      ru: ' ч. назад,',
      en: ' h ago, ',
    },
    timeexpired: {
      ru: 'Установленное тобой время истекло! Ты можеть отключить таймер или просто дождаться окончания оповещения.',
      en: 'The timer time you set has expired! You can turn off timer or just wait until the alert is over.',
    },

    changeduration: {
      ru: '*Ты также можешь изменить продолжительность оповещений после каждого таймера в настройках.',
      en: '*You can also change the duration of alerts after each timer in the settings.',
    },
    changeduration2: {
      ru: '*Ты также можешь изменить продолжительность оповещений после каждого таймера в настройках.',
      en: '*You can also change the duration of alerts after each timer in the settings.',
    },
    Capy: {
      ru: 'Кэпи',
      en: 'Capy',
    },
    turnoff: {
      ru: 'Выключить таймер',
      en: 'Turn off timer',
    },
    turnoff2: {
      ru: 'Выключить таймер',
      en: 'Turn off timer',
    },
    warning: {
      ru: 'Предупреждение',
      en: 'Warning',
    },
    enteredinvalid: {
      ru: 'Ты ввел неверное значение времени. Пожалуйста, проверь введенные данные и попробуй еще раз!',
      en: 'You entered invalid time value. Please check the entered data and try again!',
    },
    valuecannot: {
      ru: 'Значение таймера не может быть больше целого дня, а также оно не может состоять только из нулевых значений.',
      en: 'The timer value cannot be more than a whole day, and also cannot consist only of zero values.',
    },
    okey: {
      ru: 'Хорошо',
      en: 'Okey',
    },
    timesup: {
      ru: 'Уже всё!',
      en: "Time's up!",
    },
    timesupmob: {
      ru: 'Уже всё!',
      en: "Time's up!",
    },

    Michael: {
      ru: 'Миша',
      en: 'Michael',
    },

    Ellie: {
      ru: 'Элли',
      en: 'Ellie',
    },

    Raff: {
      ru: 'Рафик',
      en: 'Raff',
    },
    Lolita: {
      ru: 'Лола',
      en: 'Lolita',
    },

    quicktime: {
      en: '+ quick time selection panel',
      ru: '+ панель быстрого выбора времени',
    },
    Cherry: {
      ru: 'Черри',
      en: 'Cherry',
    },
    themesinfo: {
      ru: 'После изменения цветовой темы изменятся главные цвета сайта, твой питомец, а также иконка сайта!',
      en: 'After changing the color preset, the main colors of the site, your pet, as well as the site favicon will change!',
    },
    h: {
      ru: 'ч',
      en: 'h',
    },
    m: {
      ru: 'м',
      en: 'm',
    },
    s: {
      ru: 'с',
      en: 's',
    },
    language: {
      ru: 'Язык',
      en: 'Language',
    },
    sound: {
      ru: 'Звук',
      en: 'Sound',
    },
    Theme: {
      ru: 'Темы',
      en: 'Theme',
    },

    typetask: {
      ru: 'Напиши задачу вот тут',
      en: 'You can type a task here',
    },

    noname: {
      ru: 'Без имени',
      en: 'No name',
    },
    Settings: {
      ru: 'Настройки',
      en: 'Settings',
    },

    hoursmobile: {
      ru: 'часы',
      en: 'hour',
    },

    minutesmobile: {
      ru: 'мин',
      en: 'min',
    },

    secondsmobile: {
      ru: 'сек',
      en: 'sec',
    },

    Choosetimerlanguage: {
      ru: 'Выбери язык таймера',
      en: 'Choose timer language',
    },

    taskforthetimer: {
      ru: 'ВВЕДИ ЗАДАЧУ ДЛЯ ТАЙМЕРА',
      en: 'ENTER A TASK FOR THE TIMER',
    },

    currenttask: {
      ru: 'ТЕКУЩАЯ ЗАДАЧА',
      en: 'CURRENT TASK',
    },
    Tunetimersound: {
      ru: 'Настрой звуки таймера',
      en: 'Tune timer sound',
    },

    Createowndesign: {
      ru: 'Создай свой дизайн',
      en: 'Create own design',
    },

    Foxy: {
      ru: 'Лисёнок',
      en: 'Foxy',
    },
    Hippo: {
      ru: 'Биги',
      en: 'Hippo',
    },
    Pegas: {
      ru: 'Пегас',
      en: 'Pegas',
    },
    Piggy: {
      ru: 'Хрюша',
      en: 'Piggy',
    },
    Unique: {
      ru: 'Рожок',
      en: 'Unique',
    },
    Parrot: {
      ru: 'Попуг',
      en: 'Parrot',
    },
    Drago: {
      ru: 'Дракоша',
      en: 'Drago',
    },
    Octy: {
      ru: 'Оська',
      en: 'Octy',
    },
    Chick: {
      ru: 'Цыпа',
      en: 'Chick',
    },
    Owl: {
      ru: 'Совуня',
      en: 'Owl',
    },
    Croco: {
      ru: 'Кроко',
      en: 'Croco',
    },
    Tigra: {
      ru: 'Тигра',
      en: 'Tigra',
    },
    darkmode: {
      ru: 'Тёмная тема',
      en: 'Dark mode',
    },
    lightmode: {
      ru: 'Светлая тема',
      en: 'Light mode',
    },
    Colorpresets: {
      ru: 'Цветные темы',
      en: 'Color presets',
    },
    Vibration: {
      ru: 'Вибрация',
      en: 'Vibration',
    },
    Melody: {
      ru: 'Мелодия',
      en: 'Melody',
    },
    Volume: {
      ru: 'Громкость',
      en: 'Volume',
    },
    Duration: {
      ru: 'Время',
      en: 'Duration',
    },
    Ringtones: {
      ru: 'Рингтоны',
      en: 'Ringtones',
    },
    Base: {
      ru: 'База',
      en: 'Base',
    },
    Bomb: {
      ru: 'Взрыв',
      en: 'Bomb',
    },
    Forest: {
      ru: 'Лес',
      en: 'Forest',
    },
    Future: {
      ru: 'Будущее',
      en: 'Future',
    },
    Bell: {
      ru: 'Колокол',
      en: 'Bell',
    },
    'Hi-tech': {
      ru: 'Хай-тек',
      en: 'Hi-tech',
    },
    Midnight: {
      ru: 'Полночь',
      en: 'Midnight',
    },
    Oreo: {
      ru: 'Орео',
      en: 'Oreo',
    },
    Wood: {
      ru: 'Роща',
      en: 'Wood',
    },
    Chill: {
      ru: 'Отдых',
      en: 'Chill',
    },
    Techno: {
      ru: 'Техно',
      en: 'Techno',
    },
    Jump: {
      ru: 'Прыг-скок',
      en: 'Jump',
    },
    Matrix: {
      ru: 'Матрица',
      en: 'Matrix',
    },
    Clarity: {
      ru: 'Ясность',
      en: 'Clarity',
    },
    Party: {
      ru: 'Вечеринка',
      en: 'Party',
    },
    Morning: {
      ru: 'Утро',
      en: 'Morning',
    },
    Fairytale: {
      ru: 'Сказка',
      en: 'Fairytale',
    },
    English: {
      ru: 'Английский',
      en: 'English',
    },
    Russian: {
      ru: 'Русский',
      en: 'Russian',
    },
  };
}
