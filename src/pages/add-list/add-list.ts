import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TodoList } from "../../models/model";
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ChangeDetectorRef } from '@angular/core';
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
  isRecording:boolean=false;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public view: ViewController,
    private speechRecognition: SpeechRecognition,
    private cd: ChangeDetectorRef
  ) {
    console.log(this.navParams.get("name"));
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

    this.isRecording=false;
    this.view.dismiss(list);
  }

  close() {
    this.view.dismiss();
  }

  addListWithSpeachRecognition() {
    //get permission 
    this.getPermission();
    // start listening
    this.startListening();
    // let name = "";
    // this.matchedName.map(elt => {
    //   name = name + elt;
    // });
    // this.addList(name);
    

  }
  private getPermission() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission().then(
            () => console.log('Granted'),
            () => console.log('Denied')
          );
        }
      });
  }
  private startListening() {
    let options = {
      language: 'en-EN'
    }
    this.speechRecognition.startListening().subscribe(matches => {
     
      let name = "";
      matches.map(elt => {
        name = name + elt;
      });

      this.name = name;
      
      this.cd.detectChanges();

    });
     this.isRecording = true;
  }


}
