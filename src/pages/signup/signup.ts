import {Component} from '@angular/core';
import {AlertController, IonicPage, Loading, LoadingController, NavController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmailValidator} from "../../validators/EmailValidator";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  public signupForm: FormGroup;
  public loading: Loading;

  constructor(public navCtrl: NavController,
              public authProvider: AuthServiceProvider,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    this.signupForm = formBuilder.group({
      email: ['',
        Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['',
        Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  signupUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.signupForm.valid) {
        console.log(this.signupForm.value);
      } else {
        this.authProvider.signupUser(this.signupForm.value.email,
          this.signupForm.value.password)
          .then((result) => {
            this.loading.dismiss().then(() => {
              this.authProvider.logout();
              this.navCtrl.setRoot('AuthPage');
            });
          }, (error) => {
            this.loading.dismiss().then(() => {
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
    });
  }
}
