import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {TodoItem} from "../../models/model";
import {TodoServiceProvider} from "../../providers/todo-service/todo-service";

/**
 * Generated class for the ViewTodoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-todo',
  templateUrl: 'view-todo.html',
})
export class ViewTodoPage {
  name;
  complete;
  uuid;

  constructor(public navParams: NavParams, public view: ViewController, public todoService: TodoServiceProvider){
  }

  ionViewDidLoad() {
    this.name = this.navParams.data.todo.name;
    this.complete = this.navParams.data.todo.complete;
    this.uuid = this.navParams.data.todo.uuid;
  }

  changeTodoStatus() {
    this.complete = ! this.complete;
  }

  saveTodo (){
    let todo : TodoItem = {
      name: this.name
      , complete: this.complete
      , uuid: this.uuid
    };

    this.view.dismiss(todo);
  }

}
