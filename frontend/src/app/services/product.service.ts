import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {Router} from "@angular/router";
import { environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProductModelServer, ServerResponse } from '../models/product.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 private SERVER_URL=environment.SERVER_URL;

  constructor(private http: HttpClient,private authService:UserService) { }

  // This is to fetch all the products from the backend

  getAllProducts(numberofResults=9):Observable<ServerResponse> {

   return this.http.get<ServerResponse>(this.SERVER_URL+'/products',{
      params:{
        limit:numberofResults.toString()
      }
    });
  }


  // Get single product from the database

  getSingleProduct(id:number):Observable<ProductModelServer>{
    return this.http.get<ProductModelServer>(this.SERVER_URL+'/products/'+id );

  }

  // GET Products from one category
  getProductsFromCategory(catName:string):Observable<ProductModelServer[]>{
    return this.http.get<ProductModelServer[]>(this.SERVER_URL+'/products/category/'+catName);
  }
}
