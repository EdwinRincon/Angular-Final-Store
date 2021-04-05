import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/service/auth.service';

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
      const token = this.route.snapshot.queryParams.token;
      const pwd = this.form.value.password;
      this.authService.resetPassword(token, pwd).subscribe(() => {
        this.router.navigate(['/auth/login']);
      });
    }
  }
}
