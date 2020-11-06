import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartData:CartModelServer;
  cartTotal:number;
  subTotal:number;

  constructor(public cartService:CartService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data:CartModelServer)=>this.cartData=data);
    this.cartService.cartTotal$.subscribe(total=>this.cartTotal=total);
  }


  ChangeQuantity(index:number,increase:boolean){
    this.cartService.UpdateCartItems(index,increase);
  }


}

