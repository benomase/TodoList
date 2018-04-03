export interface TodoList {
  uuid? : string,
  instances?: number,
  users?: string[],
  name : string,
  items : TodoItem[]
}

export interface TodoItem {
  uuid? : string,
  name : string,
  desc? : string,
  complete : boolean
}
