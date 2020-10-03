import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  apiURL = 'http://devza.com/tests/tasks'
  header = new HttpHeaders({
    AuthToken:'heWVzN2w5Ktb6iwqw3shNDAJyUCrted6'
  })

  constructor(private _http:HttpClient) { }
  getAllTasks(){
    return this._http.get(this.apiURL+"/list",{
      headers:this.header
  })
  }
  getAllUser(){
    return this._http.get(this.apiURL+"/listusers",{
      headers:this.header

  })

}
createTask(data){
  return this._http.post(this.apiURL+"/create",data,{
    headers:this.header

})

}
updateTask(data){
  return this._http.post(this.apiURL+"/update",data,{
    headers:this.header

})
}
deleteTask(data){
  return this._http.post(this.apiURL+"/delete",data,{
    headers:this.header
  })
}

}
