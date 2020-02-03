import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import config from './config';
import T from './init-twit';

// T.get will return a promise of the user's like history
const getLikes = T.get('/favorites/list', {
  screen_name: config.screenName,
  count: 200
});

// getTimelineIds$ converts the promise of a timeline to an RxJS observable.
// When the response is received, the data is mapped to a stream of the tweet
// ID's. Note that in the response data from Twitter, you'll see an id and an
// id_str. The id_str is the tweet's ID.
const getLikes$ = from(getLikes).pipe(
  switchMap(({ resp, data }) => from(data)),
  map((tweetData: any) => tweetData.id_str)
);

// deleteTimeline$ will receive each individual tweet ID and, in turn, make
// another API call to delete that tweet.
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
