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
import {HomePage} from "../home/home";
import {NotificationsPage} from "../notifications/notifications";
import {ToolProvider} from "../../providers/tool/tool";
import {Observable} from "rxjs/Observable";
import {AngularFireList} from "angularfire2/database";

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
  userID: string;
  waitingTodoLists: any;
  tempList: AngularFireList<any>;
  waitingListsIds:any;
  notificationCount: number;
  constructor(public navCtrl: NavController,
              public todoService: TodoServiceProvider,
              public formBuilder: FormBuilder,
              public authProvider: AuthServiceProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toolProvider: ToolProvider) {
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

   this.notificationCount = 0;
  }

  getState() {
    return this.authProvider.getState();
  }

  ionViewDidLoad() {
  }


  loginUser(): void {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.authProvider.loginUser(this.loginForm.value.email,
        this.loginForm.value.password)
        .then(authData => {
          this.loading.dismiss().then(() => {
            this.accessGranted(this.toolProvider.removeSpecialCharacters(authData.email));
          });
        }, error => {
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
  }

  goToSignup(): void {
    this.navCtrl.push('SignupPage');
  }

  goToResetPassword(): void {
    this.navCtrl.push('ResetPasswordPage');
  }

  accessGranted(userID: string): void {
    // this.navCtrl.push('ListsPage',{userUuid: userUuid});
    this.userID = userID;
    // this.todoService.getWaitingTodoListsIds(userID).subscribe((list) => {
    //   this.notificationsCount = list.length();
    //   debugger;
    // });
    //

    // this.todoService.getWaitingTodoListsIds(this.userID).subscribe((list: AngularFireList<any>)=>{
    //   this.waitingTodosList = list;
    // });

    // this.todoService.getWaitingTodoListsIds(this.userID).subscribe((listsIds: AngularFireList<any>) => {
    //   this.waitingTodoLists = [];
    //   this.waitingListsIds = listsIds;
    //   for (let listId in this.waitingListsIds) {
    //     this.todoService.getTodoList(this.waitingListsIds[listId]).subscribe((list: AngularFireList<any>) => {
    //       this.waitingTodoLists[listId] = list;
    //     });
    //   }
    //
    //   this.notificationCount = this.waitingTodoLists.length;
    // });
  }

  logout() {
    this.authProvider.logoutUser();
  }

  goToLoginGoogle(): void {
    this.authProvider.loginGoogle().then(
      (result) => {
        this.accessGranted(result.user.uid);
        console.log(result);
      }).catch((error) => {

    });
  }

  accessToMyTodoList() {
    // console.log(this.user.userUuid)
    this.navCtrl.push('ListsPage', {userID: this.userID});
  }

  notifications() {
    this.navCtrl.push('NotificationsPage', {userID: this.userID});
  }

}
