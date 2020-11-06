import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

import { ProductModelServer, ServerResponse } from '../../models/product.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: ProductModelServer[] = [];

  constructor(
    private productService: ProductService,
    private toast: ToastrService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts(9).subscribe((prods: ServerResponse) => {
      this.products = prods.products;
    });
  }
  selectProduct(id: Number) {
    this.router.navigate(['/product', id]).then();
  }
  AddToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }
}
