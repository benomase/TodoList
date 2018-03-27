import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import { AngularFireAuth } from "angularfire2/auth";
import { GooglePlus } from "@ionic-native/google-plus";
import {ToolProvider} from "../tool/tool";

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class AuthServiceProvider {

  constructor(
    public afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private toolProvider: ToolProvider) {
    console.log('Hello AuthServiceProvider Provider');
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        firebase
          .database()
          .ref('/users')
          .child((email.replace('@', '')).replace(/\./g, ''))
          .set({ email: email, uid: newUser.uid });
      });
  }

  getState() {
    return this.afAuth.authState;
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.afAuth.auth.signOut();
    /*Return to first page*/
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  loginGoogle(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
        firebase
          .database()
          .ref('/users')
          .child(result.user.email)
          .set('email', result.user.email);

        resolve(result);
      }).catch((err) => {
        reject(err)
      });
    });
  }

  async loginGoogleNative(): Promise<any> {
    const googlePlusUser = await this.googlePlus.login({
      webClientId:
      "597263730613-qd22cpi5cgu5q6ll313tbnvh63c32fsb.apps.googleusercontent.com",
      offline: true,
      scopes: "profile email"
    });


    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(googlePlusUser.idToken)).then(() => {//(result) => {
        firebase
          .database()
          .ref('/users')
          .child(this.toolProvider.removeSpecialCharacters(googlePlusUser.email))
          .set('email', googlePlusUser.email);
        resolve(googlePlusUser.email);
      }
      ).catch((err) => {
        reject(err)
      });
    });

  }
  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }


  public getUserByEmail(email: string) {

  }
}
