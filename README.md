# daily-server

Simplify your daily.co API calls with this package.

Full Typescript support.

Based on: https://docs.daily.co/reference/rest-api

Inspired by https://github.com/sharkyze/daily-node

# Usage

```node
const daily = new Daily(process.env.DAILY_API_KEY!);

const room = daily.createRoom({name:"myfirstroom"});
```

# License

MIT
