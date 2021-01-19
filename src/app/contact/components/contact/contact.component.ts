import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '@core/service/contact/contact.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  form: FormGroup;
  // loading message
  showLoadingSpinner = false;

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService
  ) {
    this.buildForm();
  }

  ngOnInit() {}

  // contruir form con sus validaciones
  private buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(900)]],
    });
  }

  // enviar correo con NODE.js
  sendEmail() {
    if (this.form.valid) {
      this.showLoadingSpinner = true;
      const user = {
        name: this.form.value.name,
        email: this.form.value.email,
        message: this.form.value.message,
      };
      this.contactService.sendMessage(user).subscribe(() => {
        this.showLoadingSpinner = false;
        // mensaje cuande se envie el correo OK
        const Toast = Swal.mixin({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        Toast.fire({
          icon: 'success',
          title: 'Mensaje enviado'
        });
      });
      this.form.reset(); // vacia los campos del form
    }
  }
}
