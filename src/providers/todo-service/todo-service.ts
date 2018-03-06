import { HttpClient } from '@angular/common/http';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {TodoItem, TodoList} from "../../models/model";
import {Observable} from "rxjs/Observable";
import {FirebaseListObservable} from "angularfire2/database-deprecated";
import "firebase/app";
import {Injectable} from "@angular/core";

/*
  Generated class for the TodoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TodoServiceProvider {
  dataList: AngularFireList<any>;
  data: Observable<any[]>;


  constructor(public db : AngularFireDatabase) {
  }

  public getTodoListsIds(userUuid: string): Observable<any> {
    return this.db.list(`/${userUuid}/lists/`).valueChanges();
  }

  /**
   * ADD LIST ID TO USER
   */
  public addTodoListId(listUuid: string,userUuid: string) {
    this.db.object(`/users/${userUuid}/lists/${listUuid}`).set("");
  }

  /**
   * ADD LIST TO LISTS
   */
  public addTodoListObject(list : TodoList) {
    let ref = this.db.list(`/lists`).push({});
    list.uuid = ref.key;
    ref.set(list);
    return ref.key;
  }

  /**
   * ADD LIST (MAIN)
   * @param {TodoList} list
   * @param {string} userUuid
   */
  public addTodoList(list : TodoList, userUuid: string) {
    let listUuid = this.addTodoListObject(list);
    this.addTodoListId(listUuid,userUuid);
  }

  public getTodos(listUuid:string) : Observable<any> {
    return this.db.list(`/lists/${listUuid}/items`).valueChanges();
  }

  /**
   * Add funciton
   */

  public addTodo(listUuid : string, newItem: TodoItem) {
    let ref = this.db.list(`/lists/${listUuid}/items`).push({});
    newItem.uuid = ref.key;
    ref.set(newItem);
  }

  public editTodo(listUuid : String, editedItem: TodoItem, userUuid: string) {
    this.db.object(`/lists/${listUuid}/items/${editedItem.uuid}`).set(editedItem);
  }
  public editTodoList(listUuid: String,editedList:TodoList,userUuid: String){
    this.db.object(`/${userUuid}/lists/${listUuid}`).set(editedList);//a voir avec firebase

  }
  public removeTodoList(listUuid: String,userUuid: String){
    this.db.object(`/users/${userUuid}/lists/${listUuid}`).remove();//a voir avec firebase
    this.db.object(`/lists/${listUuid}`).remove();
  }
  public removeTodo(listUuid : String, todoUuid:String, userUuid: string) {
    this.db.object(`/lists/${listUuid}/items/${todoUuid}`).remove();
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
