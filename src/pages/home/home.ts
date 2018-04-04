import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  userID: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public afAuth: AngularFireAuth) {
    this.userID = navParams.data.userID;

    this.afAuth.authState.subscribe((auth) => {
      if (auth) {
        //this.accessGranted(this.afAuth.auth.currentUser.uid);
        console.log("auth ok");
      } else {
        console.log("auth not ok");
      }

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  accessToMyTodoList() {
    console.log(this.userID)
    this.navCtrl.push('ListsPage', { userID: this.userID });
  }
}
