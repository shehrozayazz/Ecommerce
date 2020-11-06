import { Component, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({

  templateUrl: './error.component.html',
  styleUrls:['./error.component.css']
})

export class ErrorComponent  {


  constructor(public dia:MatDialog,@Inject(MAT_DIALOG_DATA)public data:{message:string}) {

   }
   onClose(){
     this.dia.closeAll();
   }




}
