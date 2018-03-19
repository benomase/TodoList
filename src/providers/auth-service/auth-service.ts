import {Injectable} from '@angular/core';
import * as firebase from "firebase/app";
import {AngularFireAuth} from "angularfire2/auth";

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class AuthServiceProvider {

  constructor(public afAuth: AngularFireAuth) {
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
          .child(newUser.uid)
          .set({email: email});
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
          .child(result.user.uid)
          //.set({email: result.user.email});
          .set('email',result.user.email);
        resolve(result);
      }).catch((err) =>{
          reject(err)
      });
    });
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }
}
