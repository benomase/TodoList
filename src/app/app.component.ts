import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AuthPage } from "../pages/auth/auth";
import { ListsPage } from "../pages/lists/lists";

import { AuthServiceProvider } from "../providers/auth-service/auth-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'AuthPage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authProvider: AuthServiceProvider) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  /*
  *TODO: get userid and send it in the navParam
  */
  goToHomePage() {
   
    this.nav.push('AuthPage');
  }
   /*
  *TODO: get userid and send it in the navParam
  */
  GoToListsPage(){
    this.nav.push('ListsPage');
  }
  logout() {
    this.authProvider.logoutUser().then(() => {
      console.log('o');
    });
  }

}

