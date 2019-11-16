const Twit = require('twit');
const { from } = require('rxjs');
const { map, switchMap } = require('rxjs/operators');
const config = require('../config');

const T = new Twit({
  consumer_key: config.apiKey,
  consumer_secret: config.apiSecretKey,
  access_token: config.accessToken,
  access_token_secret: config.accessTokenSecret
});

// T.get will return a promise of the user's tweet history
const getTimeline = T.get('/statuses/user_timeline', {
  screen_name: config.screenName,
  count: 3200
});

// getTimelineIds$ converts the promise of a timeline to an RxJS observable.
// When the response is received, the data is mapped to a stream of the tweet
// ID's. Note that in the response data from Twitter, you'll see an id and an
// id_str. The id_str is the tweet's ID.
const getTimelineIds$ = from(getTimeline).pipe(
  switchMap(({ resp, data }) => from(data)),
  map(tweetData => tweetData.id_str)
);

// deleteTimeline$ will receive each individual tweet ID and, in turn, make
// another API call to delete that tweet.
const deleteTimeline$ = getTimelineIds$.pipe(
  switchMap(tweetId => from(T.post('statuses/destroy/:id', { id: tweetId }))),
  map(({ resp, data }) => data.id)
);

// subscribe will trigger the streams above and log the final output.
deleteTimeline$.subscribe({
  next(id) {
    console.log(`Deleted tweet with ID ${id}`);
  },
  error(err) {
    console.log(err);
  },
  complete() {
    console.log('Complete');
  }
});
