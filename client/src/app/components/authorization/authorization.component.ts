import {Component, OnInit, OnDestroy, HostBinding} from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';

import {AuthorizationService} from '../../services/authorization.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-authorization',
    templateUrl: './authorization.component.html',
    styleUrls: ['./authorization.component.css']
})

export class AuthorizationComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'account';
    isOpen: boolean;
    subscribes: Subscription;
    // 0 - registration, 1 - sign in, 2 - restore password
    form: {
        group: FormGroup,
        type: number,
        pending: boolean,
        email: {
            control: FormControl,
            value: string
        },
        password: {
            control: FormControl,
            value: string,
            minLength: number
        }
    };
    feedback: {type: string, text: string, control: string};

    constructor(private formBuilder: FormBuilder, private authorizationService: AuthorizationService) {
        this.isOpen = false;
        this.form = {
            group: null,
            type: 1,
            pending: false,
            email: {
                control: null,
                value: null
            },
            password: {
                control: null,
                value: null,
                minLength: 4
            }
        };
    }

    ngOnInit() {
        this.form.group = this.formBuilder.group({
            email: this.formBuilder.control(null, [Validators.required, Validators.email]),
            password: this.formBuilder.control(null, [Validators.required, Validators.minLength(this.form.password.minLength)])
        });

        this.form.email.control = this.form.group.get('email') as FormControl;
        this.form.password.control = this.form.group.get('password') as FormControl;

        this.subscribes = this.form.email.control.valueChanges
            .subscribe(value => {
                this.form.email.value = this.form.email.control.status.toLowerCase() === 'valid' ? value : null;
                this.feedback = null;
            });
        this.subscribes.add(this.form.password.control.valueChanges
            .subscribe(value => {
                this.form.password.value = this.form.password.control.status.toLowerCase() === 'valid' ? value : null;
                this.feedback = null;
            })
        );
    }

    ngOnDestroy() {
        this.subscribes.unsubscribe();
    }

    public openForm() {
        this.feedback = null;
        this.isOpen = !this.isOpen;
        return false;
    }

    public changeForm(type: number) {
        this.feedback = null;
        if (this.form.type === type) { return false; }

        this.form.type = type;
        type === 2 ? this.form.password.control.setValidators(null) : this.form.password.control.setValidators([Validators.required, Validators.minLength(this.form.password.minLength)]);
        this.onResetForm({
            email: this.form.email.value,
            password: this.form.password.value
        });
        return false;
    }

    onSubmitForm() {
        this.form.pending = true;
        switch (this.form.type) {
            case 0:
                this.authorizationService.registration(this.form.group.value).subscribe(result => {
                    this.feedback = {
                        text: result.data.message,
                        type: 'success',
                        control: 'other'
                    };

                    this.form.pending = false;
                }, error => {
                    let control;

                    switch (error.status) {
                        case 400:
                            control = 'email';
                            break;
                        default:
                            control = 'other';
                    }

                    this.feedback = {
                        text: error.error.errors.message,
                        type: 'danger',
                        control
                    };

                    this.form.pending = false;
                });
                break;
            case 1:
                this.authorizationService.login(this.form.group.value).subscribe(() => {
                    this.form.pending = false;
                }, error => {
                    let control;

                    switch (error.status) {
                        case 400:
                        case 404:
                            control = 'email';
                            break;
                        case 401:
                            control = 'password';
                            break;
                        default:
                            control = 'other';
                    }

                    this.feedback = {
                        text: error.error.errors.message,
                        type: 'danger',
                        control
                    };

                    this.form.pending = false;
                });
                break;
            case 2:
                this.authorizationService.recovery(this.form.group.value).subscribe(result => {
                    this.feedback = {
                        text: result.data.message,
                        type: 'success',
                        control: 'other'
                    };

                    this.form.pending = false;
                }, error => {
                    let control;

                    switch (error.status) {
                        case 404:
                            control = 'email';
                            break;
                        default:
                            control = 'other';
                    }

                    this.feedback = {
                        text: error.error.errors.message,
                        type: 'danger',
                        control
                    };

                    this.form.pending = false;
                });
                break;
        }
    }

    private onResetForm(values: object) {
        this.form.group.reset(values);
    }
}
