import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService:UserService){}
  ngOnInit(){
    this.authService.autoAuthUser();
  }

  title = 'Ecommerce App';
}
