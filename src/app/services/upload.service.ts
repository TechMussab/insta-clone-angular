import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly IMGBB_API_KEY = environment.imageDB.apiKey
  private readonly IMGBB_URL = 'https://api.imgbb.com/1/upload';

  constructor(private http: HttpClient) {}

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', this.IMGBB_API_KEY);

    const response = await firstValueFrom(
      this.http.post<any>(this.IMGBB_URL, formData)
    );

    return response.data.url;
  }
}
