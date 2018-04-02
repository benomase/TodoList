
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { TodoItem, TodoList } from "../../models/model";
import { Observable } from "rxjs/Observable";
import { FirebaseListObservable } from "angularfire2/database-deprecated";
import "firebase/app";
import { Injectable } from "@angular/core";

/*
  Generated class for the TodoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TodoServiceProvider {
  data: Observable<any[]>;

  constructor(public db: AngularFireDatabase) {
  }

  /**
   * GET TODO LISTS ID
   * @param {String} userID
   */

  public getTodoListsIds(userID: string): Observable<any> {
    return this.db.list(`/users/${userID}/lists/`).valueChanges();
  }

  getWaitingTodoListsIds2(userID: string): AngularFireList<any> {
    return this.db.list(`/users/${userID}/w-lists/`);
  }

  getWaitingTodoListsIds(userID: string): Observable<any> {
    return this.db.list(`/users/${userID}/w-lists/`).valueChanges();
  }

  public getTodoList(listUuid: string): Observable<any> {
    //return this.db.list(`/lists/${listUuid}`).valueChanges();
    return this.db.object(`/lists/${listUuid}`).valueChanges();
  }

  public getTodoMyLists() {
    //TODO
  }

  public getTodoSharedLists() {
    //TODO
  }

  /**
   * ADD LIST ID TO USER
   */

  public addTodoListId(listUuid: string, userID: string) {
    //this.db.object(`/users/${userID}/lists/${listUuid}`).set(listUuid);
    this.db.list(`/users/${userID}/lists`).push(listUuid);
  }

  /**
   * ADD LIST TO LISTS
   */
  public addTodoListObject(list: TodoList) {
    let ref = this.db.list(`/lists`).push({});
    list.uuid = ref.key;
    ref.set(list);
    return ref.key;
  }

  /**
   * ADD LIST (MAIN)
   * @param {TodoList} list
   * @param {string} userID
   */

  public addTodoList(list: TodoList, userID: string) {
    let listUuid = this.addTodoListObject(list);
    this.addTodoListId(listUuid, userID);

  }

  public getTodos(listUuid: string): Observable<any> {
    return this.db.list(`/lists/${listUuid}/items`).valueChanges();
  }

  /**
   * Add funciton
   */

  public addTodo(listUuid: string, newItem: TodoItem) {
    let ref = this.db.list(`/lists/${listUuid}/items`).push({});
    newItem.uuid = ref.key;
    ref.set(newItem);
  }

  public editTodo(listUuid: string, editedItem: TodoItem, userID: string) {
    this.db.object(`/lists/${listUuid}/items/${editedItem.uuid}`).set(editedItem);
  }

  public editTodoList(listUuid: string, editedList: TodoList, userID: string) {
    this.db.object(`/${userID}/lists/${listUuid}`).set(editedList);//a voir avec firebase

  }

  public removeTodoList(listUuid: string, userID: string) {
    this.db.object(`/users/${userID}/lists/${listUuid}`).remove();//a voir avec firebase
    this.db.object(`/lists/${listUuid}`).remove();
  }

  public removeTodo(listUuid: string, todoUuid: string, userID: string) {
    this.db.object(`/lists/${listUuid}/items/${todoUuid}`).remove();
  }

  public shareTodoList(listUuid: string, userID: string) {
    this.db.list(`/users/${userID}/w-lists`).set(listUuid, listUuid);
  }

  acceptTodoListSharing(listUuid: string, userID: string) {
    this.db.object(`/users/${userID}/w-lists/${listUuid}`).remove();
    this.db.list(`/users/${userID}/lists/`).set(listUuid, listUuid);
  }

  declineTodoListSharing(listUuid: string, userID: string) {
    this.db.object(`/users/${userID}/w-lists/${listUuid}`).remove();
  }

}
