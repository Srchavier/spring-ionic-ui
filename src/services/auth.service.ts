import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { JwtHelper } from "angular2-jwt";

import { CredenciasDTO } from './../models/Credencias.dto';
import { StorageService } from './storage.service';
import { LocalUser } from './../models/local_user';
import { API_CONFIG } from './../config/api.config';

@Injectable()
export class AuthService {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http: HttpClient,
        public storageService: StorageService) {

    }

    authenticate(creds: CredenciasDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`,
            creds,
            {
                observe: 'response',
                responseType: 'text'
            })
    }

    refreshToken() {
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`,
            {},
            {
                observe: 'response',
                responseType: 'text'
            })
    }


    sucessfulLogin(authorization: string) {
        if (authorization !== null) {
            let tok = authorization.substring(7);
            let user: LocalUser = {
                token: tok,
                email: this.jwtHelper.decodeToken(tok).sub
            }
            this.storageService.setLocalUser(user);
        }

    }

    logout() {
        this.storageService.setLocalUser(null);
    }
}