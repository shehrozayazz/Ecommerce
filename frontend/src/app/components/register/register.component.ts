import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit ,OnDestroy{
  private authStatusSub: Subscription;

  constructor(public authService: UserService,public spinner2:NgxSpinnerService) {}
  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {

      });
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onRegister(form: NgForm) {
    if (form.invalid) {
      return;
    }
 //  this.spinner.show();

    this.authService.createUser(form.value.email, form.value.password, form.value.password2, form.value.fname, form.value.lname);
  }



}
