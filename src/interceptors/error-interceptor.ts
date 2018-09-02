import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { StorageService } from '../services/storage.service';
import { AlertController } from 'ionic-angular';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        public storage: StorageService,
        public alertControle: AlertController) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        return next.handle(req).catch((error, caught) => {

            let errorObj = error;
            if (errorObj.error) {
                errorObj = errorObj.error;
            }
            if (!errorObj.status) {
                errorObj = JSON.parse(errorObj);
            }

            console.log("Error detectando pelo interceptor");
            console.log(errorObj);

            switch (errorObj.status) {
                case 401:
                    this.handle401();
                    break;

                case 403:
                    this.handle403(errorObj);
                    break;

                default:
                    this.handleDefaultError(errorObj)
                    break;
            }

            return Observable.throw(errorObj);
        }) as any;
    }
    handle401(): any {
        let alert = this.alertControle.create({
            title: 'Error 401: falha de autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false,
            buttons: [
                { text: 'Ok' }
            ]
        });
        alert.present();
    }

    handle403(errorObj: any) {
        this.storage.setLocalUser(null);
    }

    handleDefaultError(errorObj: any): any {
        let alert = this.alertControle.create({
            title: 'Error ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                { text: 'Ok' }
            ]
        });
        alert.present();
    }
}


export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}