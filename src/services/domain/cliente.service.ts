import { API_CONFIG } from './../../config/api.config';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

import { ClienteDTO } from '../../models/cliente.dto';
import { StorageService } from '../storage.service';
import { ImageUtilService } from '../ImageUtilService';

@Injectable()
export class ClienteService {


    constructor(
        public http: HttpClient,
        public storage: StorageService,
        public imageUltilService: ImageUtilService) {
    }

    findByEmail(email: string) {
        return this.http.get(
            `${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
    }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`)
    }

    getImageFromBucket(id: string): Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        return this.http.get(url, { responseType: 'blob' });
    }

    insert(obj: ClienteDTO) {
        this.formatObjParaPost(obj)
        return this.http.post(`${API_CONFIG.baseUrl}/clientes`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            });
    }
    formatObjParaPost(obj: any): any {
        if (obj !== null && obj.cep !== null && obj.cpfOuCnpj !== null && obj.telefone1 !== null) {
            obj.cep = this.findAndReplace(obj.cep, /\D/g, "");
            obj.cpfOuCnpj = this.findAndReplace(obj.cpfOuCnpj, /\D/g, "");
            obj.telefone1 = this.findAndReplace(obj.telefone1, /\D/g, "");
            obj.telefone2 = this.findAndReplace(obj.telefone2, /\D/g, "");
            obj.telefone3 = this.findAndReplace(obj.telefone3, /\D/g, "");
        }
    }

    findAndReplace(string, target, replacement) {
        string = string.replace(target, replacement);
        return string;
    }

    uploadPicture(picture: string) {
        let pictureBlob = this.imageUltilService.dataUriToBlob(picture);
        let formData: FormData = new FormData();
        formData.set('file', pictureBlob, 'file.png');
        return this.http.post(`${API_CONFIG.baseUrl}/clientes/foto`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            });
    }

}