import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TodoList } from "../../models/model";
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ChangeDetectorRef } from '@angular/core';
import { ToastController } from 'ionic-angular';
/**
 * Generated class for the AddListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-list',
  templateUrl: 'add-list.html',
})
export class AddListPage {
  name: string;
  // isRecording: boolean = false;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public view: ViewController,
    private speechRecognition: SpeechRecognition,
    private cd: ChangeDetectorRef,
    private toastCtrl: ToastController
  ) {
    this.name = this.navParams.get("name");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddListPage');
  }

  saveList() {
    let list: TodoList = {
      uuid: "",
      name: this.name,
      items: []
    };

    this.view.dismiss(list);
  }

  close() {
    this.view.dismiss();
  }

  private getPermission() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission().then(
            () => this.presentToast('Granted'),
            () => this.presentToast('Denied')
          );
        } else {
          this.presentToast('has permission');
        }
      });
  }
  private startListening() {
    // this.isRecording = true;

    let options = {
      language: 'fr-FR'
    };
    // if (!this.isRecording) {

      //get permission
      this.getPermission();
      this.speechRecognition.startListening(options).subscribe(matches => {

        matches.map(elt => {
          this.name = elt;

        });

        this.cd.detectChanges();

      }, error => this.presentToast(error));
    // }
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
