import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/service/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.scss']
})
export class ForgotPwdComponent implements OnInit {
  hide = true; // icono de password
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.buildForm();
  }

  ngOnInit() {
  }

  // construir form con sus Validaciones
  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }


  forgotPwd() {
    if (this.form.valid) {
      const email = this.form.value.email;
      this.authService.forgotPassword(email).subscribe((response: any) => {
        if (response.ok) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true
          });
          Toast.fire({
            icon: 'success',
            title: response.message,
          });
        }
      });
    }
  }

}
