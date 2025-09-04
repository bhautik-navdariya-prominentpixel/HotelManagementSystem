const KEY =  "table_size";
export function getTableSize():number{
  return +(localStorage.getItem(KEY) ?? "0")
}
export function updateTableSize(size:number){
  localStorage.setItem(KEY, (getTableSize()+size).toString());
}