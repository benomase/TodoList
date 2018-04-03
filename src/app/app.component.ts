import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, Events} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {AuthPage} from "../pages/auth/auth";
import {ListsPage} from "../pages/lists/lists";

import {AuthServiceProvider} from "../providers/auth-service/auth-service";
import {ToolProvider} from "../providers/tool/tool";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'AuthPage';
  userID: string;


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authProvider: AuthServiceProvider, public events: Events, public toolProvider: ToolProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    events.subscribe('login', (userID: string) => {
      this.userID = userID;
    });
  }


  goToHomePage() {
    this.nav.push('AuthPage', {userID: this.userID});
  }

  GoToListsPage() {
    this.nav.push('ListsPage', {userID: this.userID});
  }

  logout() {
    this.authProvider.logout().then((msg) => {
      this.toolProvider.showToast('Successfuly Logged Out');
      this.goToHomePage();
    }).catch((msg) => {
      this.toolProvider.showToast(msg)
    });
  }

}
