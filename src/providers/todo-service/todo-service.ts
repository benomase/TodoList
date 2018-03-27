
import {HttpClient} from '@angular/common/http';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {TodoItem, TodoList} from "../../models/model";
import {Observable} from "rxjs/Observable";
import {FirebaseListObservable} from "angularfire2/database-deprecated";
import "firebase/app";
import { Injectable } from "@angular/core";
import * as Firebase from "firebase";
import {FirebaseApp} from "angularfire2";

/*
  Generated class for the TodoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TodoServiceProvider {
  data: Observable<any[]>;

  constructor(public db: AngularFireDatabase, public firebase : FirebaseApp) {
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

  /**
   * ADD LIST ID TO USER
   */
  public addTodoListId(listUuid: string, userID: string) : Promise<any>{
    return this.db.object(`/users/${userID}/lists/${listUuid}`).set(listUuid);
  }

  /**
   * ADD LIST TO LISTS
   */
  public addTodoListObject(list: TodoList, userID: string)
  {
    let ref = this.db.list(`/lists`).push({});
    list.uuid = ref.key;
    list.instances = 1;
    list.users = [];
    list.users[userID] = userID;
    ref.set(list);
    return ref.key;
  }

  /**
   * ADD LIST (MAIN)
   * @param {TodoList} list
   * @param {string} userID
   */

  public addTodoList(list: TodoList, userID: string) : Promise<any>{
    return new Promise((resolve,reject) => {
      let listUuid = this.addTodoListObject(list, userID);
      this.addTodoListId(listUuid, userID).then(()=>{
        resolve('La liste a été ajouté avec succès');
      }).catch((err)=>{
        reject(err)
      });
    });
  }

  public getTodos(listUuid: string): Observable<any> {
    return this.db.list(`/lists/${listUuid}/items`).valueChanges();
  }

  public addTodo(listUuid: string, newItem: TodoItem) : Promise<any>{
    let ref = this.db.list(`/lists/${listUuid}/items`).push({});
    newItem.uuid = ref.key;
    return ref.set(newItem);
  }

  public editTodo(listUuid: string,todoUuid: string, newName: string): Promise<any> {
    return this.db.object(`/lists/${listUuid}/items/${todoUuid}/name`).set(newName);
  }

  public editTodoList(listUuid: string, newName: string) : Promise<any>{
    return this.db.object(`/lists/${listUuid}/name`).set(newName);
  }

  public removeTodoList(listUuid: string, userID: string) : Promise<any>{
   return this.firebase.database().ref(`/lists/${listUuid}`).once('value').then((snapshot)=>{
      this.db.object(`/users/${userID}/lists/${listUuid}`).remove();
      if(snapshot.val().instances<=1){
        this.db.object(`/lists/${listUuid}`).remove();
      }
      else {
        this.db.object(`/lists/${listUuid}/instances`).set(--snapshot.val().instances);
        this.db.object(`/lists/${listUuid}/users/${userID}`).remove();
      }
    });
  }

  public removeTodo(listUuid: string, todoUuid: string, userID: string) : Promise<any>{
    return this.db.object(`/lists/${listUuid}/items/${todoUuid}`).remove();
  }

  public shareTodoList(listUuid: string, userID: string): Promise<any> {
    return new Promise<any>((resolve,reject)=>{
      this.firebase.database().ref(`/users/${userID}`).once("value").then((snapshot)=>{
        if(snapshot.val()) {
          this.db.list(`/users/${userID}/w-lists`).set(listUuid, listUuid);
          resolve('La liste a été partagée avec succès');
        }
        else {
          reject("L'email n'as pas été trouvé dans nos bases de données");
        }

      }).catch(()=>{
        reject('Probleme de communication avec la base de donnée, veuillez réessayé plutard');
      });
    });
  }

  acceptTodoListSharing(listUuid: string, userID: string) {
    this.firebase.database().ref(`/lists/${listUuid}`).once('value').then((snapshot)=>{
      this.db.object(`/lists/${listUuid}/instances`).set(++snapshot.val().instances);
      this.db.list(`/lists/${listUuid}/users`).set(userID,userID);
      this.db.object(`/users/${userID}/w-lists/${listUuid}`).remove();
      this.db.list(`/users/${userID}/lists`).set(listUuid, listUuid);
    });
  }

  declineTodoListSharing(listUuid: string, userID: string) {
    this.db.object(`/users/${userID}/w-lists/${listUuid}`).remove();
  }

  getSharedPeopleForList(listUuid: string) : Observable<any>{
    return this.db.list(`/lists/${listUuid}/users`).valueChanges();
  }

}
