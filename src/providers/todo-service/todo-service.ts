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

  public getTodoLists(userUuid: string): Observable<any> {
    return this.db.list(`/${userUuid}/lists/`).valueChanges();
  }

  public addTodoList(list : TodoList, userUuid: string) {
    let ref = this.db.list(`/${userUuid}/lists`).push({});
    list.uuid = ref.key;
    ref.set(list);
  }

  public getTodos(uuid:string, userUuid: string) : Observable<any> {
    return this.db.list(`/${userUuid}/lists/${uuid}/items`).valueChanges();
  }

  public addTodo(listUuid : string, newItem: TodoItem, userUuid: string) {
    let ref = this.db.list(`/${userUuid}/lists/${listUuid}/items`).push({});
    newItem.uuid = ref.key;
    ref.set(newItem);
  }

  public editTodo(listUuid : String, editedItem: TodoItem, userUuid: string) {
    this.db.object(`/${userUuid}/lists/${listUuid}/items/${editedItem.uuid}`).set(editedItem);
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
