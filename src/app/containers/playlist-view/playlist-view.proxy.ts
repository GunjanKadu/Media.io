import { Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { EchoesState } from '@core/store';
import * as NowPlaylist from '@core/store/now-playlist';

import { ActivatedRoute, Data } from '@angular/router';
import { UserProfileActions } from '@core/store/user-profile';
import { AppPlayerApi } from '@api/app-player.api';
import { AppApi } from '@api/app.api';

import * as RouterActions from '@core/store/router-store';

export interface PlaylistData {
  videos: GoogleApiYouTubeVideoResource[];
  playlist: GoogleApiYouTubePlaylistResource;
}

@Injectable()
export class PlaylistProxy {
  nowPlaylistIds$ = this.store.pipe(select(NowPlaylist.getPlaylistMediaIds));

  constructor(
    public store: Store<EchoesState>,
    private userProfileActions: UserProfileActions,
    private appPlayerApi: AppPlayerApi,
    private appApi: AppApi
  ) { }

  goBack() {
    this.appApi.navigateBack();
  }

  toRouteData(route: ActivatedRoute) {
    return route.data;
  }

  fetchPlaylist(route: ActivatedRoute) {
    return this.toRouteData(route).pipe(
      map((data: PlaylistData) => data.playlist)
    );
  }

  fetchPlaylistVideos(route: ActivatedRoute) {
    return this.toRouteData(route).pipe(
      map((data: PlaylistData) => data.videos)
    );
  }

  fetchPlaylistHeader(route: ActivatedRoute) {
    return this.fetchPlaylist(route).pipe(
      map((playlist: GoogleApiYouTubePlaylistResource) => {
        const { snippet, contentDetails } = playlist;
        return `${snippet.title} (${contentDetails.itemCount} videos)`;
      })
    );
  }

  playPlaylist(playlist: GoogleApiYouTubePlaylistResource) {
    this.appPlayerApi.playPlaylist(playlist);
  }

  queuePlaylist(playlist: GoogleApiYouTubePlaylistResource) {
    this.appPlayerApi.queuePlaylist(playlist);
  }

  queueVideo(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerApi.queueVideo(media);
  }

  playVideo(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerApi.playVideo(media);
  }

  unqueueVideo(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerApi.removeVideoFromPlaylist(media);
  }

  addVideo(media: GoogleApiYouTubeVideoResource) {
    this.appApi.toggleModal(true, media);
  }
}
