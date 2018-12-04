import {Component, HostBinding, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthorizationService, UserService} from '../../services';
import {UserModel} from '../../models';
import {Subscription} from 'rxjs';

@Component({
    selector:    'app-account',
    templateUrl: './account.component.html',
    styleUrls:   ['./account.component.css']
})
export class AccountComponent implements OnInit {
    @HostBinding('class') class = 'account';
    user: UserModel;
    isOpen: boolean;
    form: {
        isOpen: boolean,
        pending: boolean,
        group: FormGroup,
        minLength: number
    };
    feedback: {
        control: string
        text: string,
        type: string
    };
    subscribes: Subscription;

    constructor(private authorizationService: AuthorizationService, private userService: UserService, private formBuilder: FormBuilder) {
        this.isOpen = false;
        this.form = {
            isOpen: false,
            pending: false,
            group: null,
            minLength: 4
        };
    }

    static validSamePswd(g: FormGroup) {
        const newPswd = g.get('newPswd');
        const password = g.get('password');

        return password.value === newPswd.value ? {samePswd: true} : null;
    }

    ngOnInit() {
        this.user = this.userService.user;

        this.form.group = new FormGroup({
            password: this.formBuilder.control(null, [Validators.required, Validators.minLength(this.form.minLength)]),
            newPswd: this.formBuilder.control(null, [Validators.required, Validators.minLength(this.form.minLength)])
        }, AccountComponent.validSamePswd);

        this.subscribes = this.form.group.controls.password.valueChanges
            .subscribe(() => {
                if (this.feedback && this.feedback.control === 'password') {
                    this.feedback = null;
                }
            });
    }

    logout() {
        this.authorizationService.logout();
    }

    openForm() {
        this.isOpen = !this.isOpen;

        return false;
    }

    changePswd() {
        this.feedback = null;
        this.form.isOpen = !this.form.isOpen;
    }

    onSubmitForm() {
        this.form.pending = true;

        const params = this.form.group.value;
        params.email = this.user.email;

        this.authorizationService.changePassword(params).subscribe(value => {
            this.feedback = {
                text: value.data.message,
                type: 'success',
                control: 'other'
            };

            this.form.group.reset();
            this.form.pending = false;
        }, error => {
            let control;

            switch (error.status) {
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
    }
}
