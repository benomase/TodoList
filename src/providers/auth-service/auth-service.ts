import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import {AngularFireAuth} from "angularfire2/auth";

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class AuthServiceProvider {

  constructor(public afAuth: AngularFireAuth, ) {
    console.log('Hello AuthServiceProvider Provider');
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then( newUser => {
        firebase
          .database()
          .ref('/userProfile')
          .child(newUser.uid)
          .set({ email: email });
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

  loginGoogle() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }
}
