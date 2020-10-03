import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { FormControl, Validators } from '@angular/forms';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogueComponent } from '../delete-dialogue/delete-dialogue.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public dataService:DataserviceService,public dialog:MatDialog,private snackBar:MatSnackBar) { }

  updateStatus = false;

  mediumPSearch=""
  highPSearch=""
  lowPSearch=""

  highPPage=1
  mediumPPage=1
  lowPPage=1

  userData:any =[]
  taskData:any=[]
  opened:boolean = false
  todaysDate
  taskColumns: string[] = ['taskDetails', 'dueDate', 'priority', 'assignedTo'];

  loading = false

  public message: FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]);
  public due_date: FormControl = new FormControl('');
  public priority: any;
  public assigendTo:any;

  taskMediumPriority:any=[]
  taskHighPriority:any=[]
  taskLowPriority:any=[]
  noPriority:any=[]
  id:any;


  priorityArray=[
    {id:1,Name:"High"},
    {id:2,Name:"Medium"},
    {id:3,Name:"Low"}
  ]
  formatDate(date){
    date = new Date(date);

        var weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var monthNames = ["01", "01", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    //   var dateString = //weekdayNames[date.getDay()] + " "
    //   + date.getHours() + ":" + ("00" + date.getMinutes()).slice(-2) + " "
    // + date.getDate() + "" + monthNames[date.getMonth()] + " " + date.getFullYear();
    var dateString = date.getFullYear() + "-" + monthNames[date.getMonth()]+ "-" + date.getDate()+' '+ ("0" +date.getHours()) + ":" + ("00" + date.getMinutes()).slice(-2) + ":"+("0"+date.getSeconds())   ;

    return dateString;
  }



  ngOnInit() {

    this.todaysDate =   new Date()
    this.getAllTask()
    this.getAllUser()

  }
  getAllTask(){
    this.dataService.getAllTasks().subscribe((res:any)=>{
      console.log(res)
      //this.taskData = res.tasks
      this.taskData = []
      this.taskHighPriority = []
      this.taskMediumPriority = []
      this.taskLowPriority = []
      for (let i = 0; i < res.tasks.length; i++) {
       if(res.tasks[i].priority=='1'){
         this.taskHighPriority.push(res.tasks[i])
       }
       else if(res.tasks[i].priority=='2'){
         this.taskMediumPriority.push(res.tasks[i])
       }

       else if(res.tasks[i].priority=='3'){
        this.taskLowPriority.push(res.tasks[i])
      }
      else{
        this.taskData.push(res.tasks[i])
      }

      }
    })

  }
  getAllUser(){
    this.dataService.getAllUser().subscribe((res:any)=>{
      console.log(res)
      this.userData = res.users
    })
  }
  headerTitle="Task Manager"

  applyFilter(filterValue:string){
    this.taskData.filter =filterValue.trim().toLocaleLowerCase()
    console.log(this.taskData)
  }
  onPriorityChange(){}

  openAddTaskDrawer(){
    this.opened = true
    this.updateStatus =false
    this.setDefault()
  }

  createTask(){
    if(this.message.invalid){
      this.snackBar.open('Enter required fields','',{duration:2000})
      return;
    }
    this.loading = true
    let task = new FormData();
    task.append('message',this.message.value)
    task.append('due_date',this.formatDate(this.due_date.value))
    task.append('priority',this.priority)
    task.append('assigned_to',this.assigendTo)
    console.log(this.formatDate(this.due_date.value))
    // let task = {
    //   message:this.message.value,
    //   due_date: this.formatDate(this.due_date.value),
    //   priority:this.priority,
    //   assigned_to:this.assigendTo
    // }
    console.log(task)
   //return
    this.dataService.createTask(task).subscribe((res)=>{
      this.getAllTask();

    this.loading = false
    this.opened = false
    this.snackBar.open('Task Created','',{
      duration:2000
    })
    })
  }

  setDefault(){
    // public message: FormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]);
    // public due_date: FormControl = new FormControl('');
    // public priority: any;
    // public assigendTo:any;
    this.message.reset()
    this.due_date.reset()
    this.priority=null
    this.assigendTo=null
  }

  dropList(event){
  //  / console.log(event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      let msg = event.previousContainer.data[ event.previousIndex].message
      let id = event.previousContainer.data[ event.previousIndex].id
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
                        let priority;
                        if(event.container.id=='cdk-drop-list-0'){
                          priority=1
                        }
                        else if(event.container.id=='cdk-drop-list-1'){
                          priority=2
                        }
                        else{
                          priority=3
                        }
                        let updateTask = new FormData();
                        updateTask.append('message',msg)
                        updateTask.append('priority',priority)
                        updateTask.append('taskid',id)
                        this.updateTask(updateTask)
                      }

//    cdk-drop-list-2


    // console.log(this.taskHighPriority)

    // console.log(this.taskMediumPriority)
    // console.log(this.taskLowPriority)
  }

  updateTask(data){
    this.dataService.updateTask(data).subscribe((res:any)=>{
      console.log(res)
      this.getAllTask();
    this.loading = false
    this.opened = false
    this.snackBar.open('Task Updated','',{
      duration:2000
    })
    })
  }
  openUpdateDrawer(data:any){
  this.message.setValue(data.message)
  this.due_date.setValue(new Date(data.due_date))
  this.priority = data.priority
  this.assigendTo = data.assigned_to
  this.id = data.id
  this.updateStatus =true
  this.opened=true
  }
  updateCurrentTask(){
    if(this.message.invalid){
      this.snackBar.open('Enter required fields','',{duration:2000})
      return;
    }
    this.loading = true
    let task = new FormData()
    task.append('message',this.message.value)
    task.append('due_date',this.formatDate(this.due_date.value))
    task.append('priority',this.priority)
    task.append('assigned_to',this.assigendTo)
    task.append('taskid',this.id)
    this.updateTask(task)

  }


  deleteTask(item,i,type){
    let dialog = this.dialog.open(DeleteDialogueComponent)
    dialog.afterClosed().subscribe((res)=>{
      console.log(res)
      if(res=="true"){
        if(type=="1"){
          this.taskHighPriority.splice(i,1)
        }
       else if(type=="2"){

        this.taskMediumPriority.splice(i,1)
        }
        else{

          this.taskLowPriority.splice(i,1)
        }
          let data = new FormData()
          data.append('taskid',item.id)
          this.dataService.deleteTask(data).subscribe((res)=>{
          this.snackBar.open('Task Deleted','',{
          duration:2000
      })
    })
      }
    })

  }
}

