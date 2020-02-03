import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import config from './config';
import T from './init-twit';

// T.get will return a promise of the response
const getLikes = T.get('/favorites/list', {
  screen_name: config.screenName,
  count: 200
});

// getLikes$ converts the promise of T.get to an RxJS observable.
const getLikes$ = from(getLikes).pipe(
  switchMap(({ resp, data }) => from(data)),
  map((tweetData: any) => tweetData.id_str)
);

const unlike$ = getLikes$.pipe(
  switchMap(likeId => from(T.post('favorites/destroy', { id: likeId }))),
  map(({ resp, data }) => data.id)
);

// subscribe will trigger the streams above and log the final output.
unlike$.subscribe({
  next(id) {
    console.log('Success');
  },
  error(err) {
    console.log(err);
  },
  complete() {
    console.log('Complete');
  }
});
