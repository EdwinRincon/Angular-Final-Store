import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/service/auth.service';
import Swal from 'sweetalert2';
@Component({
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.scss']
})
export class ChangePwdComponent implements OnInit {
  hide = true;
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  // construir form con sus validaciones
  private buildForm() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,20}$/)]],
    });
  }

  changePwd() {
    if (this.form.valid) {
      const password = this.form.value.password;
      this.route.queryParamMap.subscribe((params) => {

        this.authService.resetPassword(params.get('token'), password).subscribe((response: any) => {
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
          this.form.reset();
        });
      }
      );
    }
  }
}
