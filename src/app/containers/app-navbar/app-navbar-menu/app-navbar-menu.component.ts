import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { expandFadeInAnimation } from '@shared/animations/fade-in.animation';
import { ICON_PREFIX_BRAND } from '@shared/directives/icon';

enum Key {
  Backspace = 8,
  Tab = 9,
  Enter = 13,
  Shift = 16,
  Escape = 27,
  ArrowLeft = 37,
  ArrowRight = 39,
  ArrowUp = 38,
  ArrowDown = 40
}
@Component({
  selector: 'app-navbar-menu',
  animations: [expandFadeInAnimation],
  template: `
    <button
      class="btn btn-navbar btn-transparent ux-maker btn-toggle"
      (click)="toggleMenu()"
    >
      <icon name="ellipsis-v"></icon>
      <icon
        *ngIf="appVersion.isNewAvailable"
        name="dot-circle-o"
        class="pulse update-indicator text-primary"
      ></icon>
    </button>
    <div class="menu-backdrop" *ngIf="!hide" (click)="hideMenu()"></div>
    <div
      class="panel menu-dropdown"
      [class.end-animation]="end"
      [@expandFadeIn]="menuState"
      (@expandFadeIn.done)="endAnimation($event)"
    >
      <div class="list-group">
        <a
          class="list-group-item"
          href="https://github.com/GunjanKadu/Media.io.git"
          target="_blank"
          rel="noopener"
        >
          <icon name="github" prefix="${ICON_PREFIX_BRAND}"></icon> Source Code
          @Github
        </a>

        <div class="list-group-item theme-selector">
          <icon name="paint-brush" class="text-primary"></icon> Theme:
          <button-group
            [buttons]="theme.themes"
            [selectedButton]="theme.selected"
            (buttonClick)="updateTheme($event)"
          ></button-group>
        </div>
        <a
          class="list-group-item"
          href="https://gunjankadu.github.io/Portfolio/"
          rel="noopener"
          blank="_target"
        >
          <icon name="keyboard-o"></icon> Made with
          <icon name="heart-o" class="text-danger"></icon> By Gunjan Kadu
        </a>

        <button
          class="list-group-item"
          *ngIf="signedIn"
          (click)="handleSignOut()"
        >
          <icon name="sign-out"></icon> Sign Out
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./app-navbar-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppNavbarMenuComponent implements OnInit {
  end = false;
  hide = true;
  get menuState() {
    return this.hide ? 'hide' : 'show';
  }

  @Input() signedIn = false;
  @Input()
  appVersion = {
    semver: '',
    isNewAvailable: false,
    checkingForVersion: false
  };
  @Input() theme = { themes: [], selected: '' };
  @Output() signOut = new EventEmitter();
  @Output() versionUpdate = new EventEmitter();
  @Output() versionCheck = new EventEmitter();
  @Output() themeChange = new EventEmitter();

  @HostListener('keyup', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (event.keyCode === Key.Escape) {
      this.hideMenu();
    }
  }

  constructor() {}

  ngOnInit() {}

  handleSignOut() {
    this.signOut.emit();
  }

  hideMenu() {
    this.hide = true;
  }

  toggleMenu() {
    this.end = false;
    this.hide = !this.hide;
  }

  handleVersionUpdate() {
    this.versionUpdate.emit();
  }

  handleVersionCheck() {
    this.versionCheck.emit();
  }

  updateTheme(theme) {
    this.themeChange.emit(theme);
  }

  endAnimation({ toState }) {
    if (toState === 'hide') {
      this.end = true;
    }
  }
}
