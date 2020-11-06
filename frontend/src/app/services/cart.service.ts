import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../services/product.service';
import { OrderService } from './order.service';
import { environment } from '../../environments/environment';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { BehaviorSubject, VirtualTimeScheduler } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ProductModelServer } from '../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from './user.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private serverURL = environment.SERVER_URL;

  // Data variable to store the cart's information on the clients's local storage

  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [
      {
        incart: 0,
        id: 0,
      },
    ],
  };

  // Data variable to store cart information on the server

  private cartDataServer: CartModelServer = {
    total: 0,
    data: [
      {
        numInCart: 0,
        product: undefined,
      },
    ],
  };

  /* OBSERVABLES  FOR THE COMPONENTS TO SUBSCRIBE */

  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private toast: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService:UserService
  ) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    // GET the information from the local storage if any

    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    if (info != null && info != undefined && info.prodData[0].incart != 0) {
      // Local storage is not empty and has some information

      this.cartDataClient = info;

      this.cartDataClient.prodData.forEach((p) => {
        this.productService
          .getSingleProduct(p.id)
          .subscribe((actualProductInfo: ProductModelServer) => {
            if (this.cartDataServer.data[0].numInCart === 0) {
              this.cartDataServer.data[0].numInCart = p.incart;
              this.cartDataServer.data[0].product =
                actualProductInfo['products'][0];
              this.cartDataServer.total = info.total;



              this.cartDataClient.total = this.cartDataServer.total;

              this.cartTotal$.next(this.cartDataServer.total);
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {

              this.cartDataServer.data.push({
                numInCart: p.incart,
                product: actualProductInfo['products'][0],
              });
              // Todo create calculateTotoal function and replace it here

              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }

            this.cartData$.next({ ...this.cartDataServer });
          });
      });
    }
  }

  /* Add Product to cart */

  AddProductToCart(id: number, quantity?: number) {


    if(this.authService.getIsAuth()){
      this.productService.getSingleProduct(id).subscribe((prod) => {
        // 1- If the cart is empty

        if (this.cartDataServer.data[0].product === undefined) {
          this.cartDataServer.data[0].product = prod['products'][0];

          this.cartDataServer.data[0].numInCart =
            quantity != undefined ? quantity : 1;
          // Todo calculate total amount
          this.CalculateTotal();

          this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
          this.cartDataClient.prodData[0].id = prod['products'][0]['id'];

          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({ ...this.cartDataServer });
          // Todo display a toast

          this.toast.success(
            `${prod['products'][0]['name']} added to the cart `,
            'Product Added',
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            }
          );
        }
        // 2- If the cart has some items
        else {
          let index = this.cartDataServer.data.findIndex(
            (p) => p.product.id == prod['products'][0]['id']
          ); // -1 or a positive number
          //    a- If that is already present in the cart => Index is a positive value

          if (index != -1) {
            if (
              quantity != undefined &&
              quantity < prod['products'][0]['quantity']
            ) {
              this.cartDataServer.data[index].numInCart =
                this.cartDataServer.data[index].numInCart <
                prod['products'][0]['quantity']
                  ? quantity
                  : prod['products'][0]['quantity'];
            } else {
              this.cartDataServer.data[index].numInCart <
              prod['products'][0]['quantity']
                ? this.cartDataServer.data[index].numInCart++
                : prod['products'][0]['quantity'];
            }

            this.cartDataClient.prodData[index].incart = this.cartDataServer.data[
              index
            ].numInCart;
            /* ****************************************** */

            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;

            /* ****************************************** */

            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            //  Todo display a toast notification

            this.toast.info(
              `${prod['products'][0]['name']} quantity updated in the cart `,
              'Product Updated',
              {
                timeOut: 1500,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
          //  b- If that item is not present in the cart
          else {
            this.cartDataServer.data.push({
              numInCart: 1,
              product: prod['products'][0],
            });

            this.cartDataClient.prodData.push({
              incart: 1,
              id: prod['products'][0]['id'],
            });
            //localStorage.setItem('cart',JSON.stringify(this.cartDataClient));

            // Todo display a toast notification

            this.toast.success(
              `${prod['products'][0]['name']} added to the cart `,
              'Product Added',
              {
                timeOut: 1500,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
            // Todo calculate total amount
            this.CalculateTotal();

            this.cartDataClient.total = this.cartDataServer.total;

            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            this.cartData$.next({ ...this.cartDataServer });
          }
        }
      });
      // ends
    }
    else{
      this.router.navigate(['/login']);
    }


  }

  UpdateCartItems(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];

    if (increase) {
      data.numInCart < data.product.quantity
        ? data.numInCart++
        : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      // Todo calculate total amount
      this.CalculateTotal();

      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({ ...this.cartDataServer });
    } else {
      data.numInCart = data.numInCart - 1;

      if (data.numInCart < 1) {
        // Delete the product from the cart
        this.DeleteProductFromCart(index);

        // this.cartData$.next({ ...this.cartDataServer });
      } else {
        this.cartData$.next({ ...this.cartDataServer });
        this.cartDataClient.prodData[index].incart = data.numInCart;

        //   Calculate totol amount
        this.CalculateTotal();

        this.cartDataClient.total = this.cartDataServer.total;

        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  DeleteProductFromCart(index: number) {
    this.openDialog();


    if (window.confirm('Are you sure you want to remove the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      //   Calculate total amount
      this.CalculateTotal();

      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total == 0) {
        this.cartDataClient = { total: 0, prodData: [{ incart: 0, id: 0 }] };
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          total: 0,
          data: [{ numInCart: 0, product: undefined }],
        };
        this.cartData$.next({ ...this.cartDataServer });
      } else {
        this.cartData$.next({ ...this.cartDataServer });
      }
    } else {
      // If the user clicks the cancel button

      return;
    }
  }

  private CalculateTotal() {
    let Total = 0;
    this.cartDataServer.data.forEach((p) => {
      const { numInCart } = p;
      const { price } = p.product;

      Total += numInCart * price;
    });

    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  CheckOutFromCart(userId: number) {
    this.http
      .post(`${this.serverURL}/orders/payment`, null)
      .subscribe((res: { success: boolean }) => {
        if (res.success) {

          this.http
            .post(`${this.serverURL}/orders/new`, {
              userId: userId,
              products: this.cartDataClient.prodData,
            })
            .subscribe((data: OrderResponse) => {

              this.orderService.getSingleOrder(data.order_id).then((prods) => {

                if (data.success) {
                  const navigationExtras: NavigationExtras = {
                    state: {
                      message: data.message,
                      products: prods['products'],
                      orderId: data.order_id,
                      total: this.cartDataClient.total,
                    },
                  };

                  // TODO hide spinner
                  this.spinner.hide();
                  this.router
                    .navigate(['/thankyou'], navigationExtras)
                    .then((p) => {
                      this.resetServerData();
                      this.cartDataClient = {
                        total: 0,
                        prodData: [{ incart: 0, id: 0 }],
                      };
                      this.cartTotal$.next(0);
                      localStorage.setItem(
                        'cart',
                        JSON.stringify(this.cartDataClient)
                      );
                    });
                }
              });
            });
        } else {
          this.spinner.hide();
          this.router.navigateByUrl('/checkout').then();

          this.toast.error(`Sorry! Failed to book the order`, 'Order Status', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right',
          });
        }
      });
  }

  private resetServerData() {
    this.cartDataClient = this.cartDataClient = {
      total: 0,
      prodData: [{ incart: 0, id: 0 }],
    };
    this.cartDataServer = {
      total: 0,
      data: [{ numInCart: 0, product: undefined }],
    };

    this.cartData$.next({ ...this.cartDataServer });
  }

  CalculateSubTotal(index): number {
    let subTotal = 0;

    const p = this.cartDataServer.data[index];
    subTotal = p.product.price * p.numInCart;
    return subTotal;
  }

  openDialog() {
    this.dialog.open(DialogElementsExampleDialog);
  }


}
@Component({
  //selector: 'dialog-elements-example-dialog',
  templateUrl: './deleteModel.component.html',
})
export class DialogElementsExampleDialog {}

interface OrderResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [
    {
      id: string;
      numInCart: string;
    }
  ];
}
