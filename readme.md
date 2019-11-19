# Delete Tweets

This is a node script to delete tweets via the Twitter API.

## To Run

#### 0. Implied dependencies

This script uses node and the credentials from a [Twitter application you've
created on your own account](https://developer.twitter.com/en/apply-for-access).

If you don't want to use Yarn, you can just replace `yarn` with `npm`.

#### 1. Install the dependencies:
```
yarn
```

#### 2. Copy `config.default.js` and rename to `config.js`:
```
yarn create-config
```

#### 3. Fill-out `config.js` with your information

You need your screenname, and the API keys and tokens provided by Twitter when your application is approved.

#### 4. Run

```
yarn start
```

## On Running

This script will likely terminate with an error before all of your tweets are deleted. While writing the script, I ended up deleting all of my tweets before I really got the hang of the API.

Of note: Twitter's API is rate limited, with different limits for different endpoints. I believe that you can only delete 300 tweets every 3 hours. This script just runs and starts to delete tweets without factoring this in.
