import { Observable } from 'rxjs';
import { UserProfile } from '@core/services';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class PlaylistResolver implements Resolve<any> {
  constructor(private userProfile: UserProfile) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<GoogleApiYouTubePlaylistResource> {
    const playlistId = route.params['id'];
    return this.userProfile
      .fetchPlaylist(playlistId)
      .pipe(map(response => response.items[0]));
  }
}
