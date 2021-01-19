import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/service/auth.service';

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
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
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
        const token = this.route.snapshot.queryParams.token;
        this.authService.forgotPassword(token).subscribe(() => {
            this.router.navigate(['/auth/login']);
          });
    }
  }

}
