import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
// import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit ,OnDestroy{
  cartData:CartModelServer;
  cartTotal:number;
  authState:boolean=false;
  private authListenerSubs:Subscription;
  authStatus2:boolean=false;


  constructor(public cartService:CartService,public authService:UserService) { }

  ngOnInit(): void {
   this.authStatus2=this.authService.getIsAuth();

    this.cartService.cartTotal$.subscribe(total=>this.cartTotal=total);
    this.cartService.cartData$.subscribe(data=>this.cartData=data);
    this.authListenerSubs=this.authService.getAuthStatusListener().subscribe(a=>this.authStatus2=a);
  }
  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();

  }

  onLogout(){
    this.authService.logout();
  }

}
