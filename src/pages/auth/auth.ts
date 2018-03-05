import {Component} from '@angular/core';
import {
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  AlertController, Events
} from 'ionic-angular';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {TodoServiceProvider} from "../../providers/todo-service/todo-service";
import {EmailValidator} from "../../validators/EmailValidator";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {ListsPage} from "../lists/lists";

/**
 * Generated class for the AuthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {
  user: any;
  public loginForm: FormGroup;
  public loading: Loading;

  constructor(public navCtrl: NavController,
              public todoService: TodoServiceProvider,
              public formBuilder: FormBuilder,
              public authProvider: AuthServiceProvider,
              public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    /**
     * TODO KEEP USER LOGGED IN
     */
    // this.afAuth.authState.subscribe((auth) => {
    //  if(auth)
    //    this.accessGranted(this.afAuth.auth.currentUser.uid);
    // });

    this.loginForm = formBuilder.group({
      email: ['',
        Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['',
        Validators.compose([Validators.minLength(6), Validators.required])]
    });

  }

  getState() {
      return this.authProvider.getState();
  }

  ionViewDidLoad() {
  }


  loginUser(): void {
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authProvider.loginUser(this.loginForm.value.email,
        this.loginForm.value.password)
        .then( authData => {
          this.loading.dismiss().then( () => {
            this.accessGranted(authData.uid);
          });
        }, error => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

  goToSignup(): void {
    this.navCtrl.push('SignupPage');
  }

  goToResetPassword(): void {
    this.navCtrl.push('ResetPasswordPage');
  }

  accessGranted(userUuid : string) {
    this.navCtrl.push('ListsPage',{userUuid: userUuid});
  }

  logout() {
    this.authProvider.logoutUser();
  }

  goToLoginGoogle() : void {
    this.authProvider.loginGoogle().then(
      (result) => {
        this.accessGranted(result.user.uid);
        console.log(result);
      }).catch((error) => {

    });
  }
}
