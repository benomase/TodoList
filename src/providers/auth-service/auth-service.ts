import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import { AngularFireAuth } from "angularfire2/auth";
import { GooglePlus } from "@ionic-native/google-plus";
import {ToolProvider} from "../tool/tool";

/**
 * This Provider handles operations related to authentication
 */
@Injectable()
export class AuthServiceProvider {
  constructor(
    public afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private toolProvider: ToolProvider) {
    console.log('Hello AuthServiceProvider Provider');
  }

  /**
   * This method signs up a user
   * it uses by default firebase as an authentication store
   * @param {string} email
   * @param {string} password
   * @returns {Promise<any>}
   */
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

  /**
   * Get the state of the user authentication, is it authenticated yet ?
   * @returns {Observable<User | null>}
   */
  getState() {
    return this.afAuth.authState;
  }

  /**
   * This Method logs a user into firebase
   * @param {string} email
   * @param {string} password
   * @returns {Promise<any>}
   */
  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  /**
   * This method signs up the user from firebase
   */
  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  /**
   * This method sends a request to change the user's password
   * @param {string} email
   * @returns {Promise<void>}
   */
  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  /**
   * This method uses google sso in order to login the user (uses the browser)
   * @returns {Promise<any>}
   */
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

  /**
   * This method uses Google sso to login the user (uses native google app)
   * @returns {Promise<any>}
   */
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
}
