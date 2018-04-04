import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {TodoItem} from "../../models/model";
import {TodoServiceProvider} from "../../providers/todo-service/todo-service";

/**
 * Generated class for the AddTodoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-todo',
  templateUrl: 'add-todo.html',
})
export class AddTodoPage {


  name: string;
  desc: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController,public todoService : TodoServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTodoPage');
  }


  saveTodo(){
    if(!this.desc)
      this.desc = '';

    let todoItem : TodoItem = {
      name: this.name,
      desc: this.desc,
      complete:false
    };
    this.view.dismiss(todoItem);

  }

  close(){
    this.view.dismiss();
  }
}
