# Nolen Tabner's BaHotH Webapp in Docker

## Why?

My friends and I love playing BaHotH but the pieces that come with the game are
a bit clunky to use. Unfortunately many of the webapps that host the character
cards eventually go down because they're personal projects. So I downloaded my
favorite incarnation and shoved it in a Docker container that I could host on my
site.

Have a look at the [demo](https://betrayal.inspiredby.es).

## Building

```bash
docker build -t me/betrayal .
```

## Running

Everything you need to run the app is inside the container. No persistent
storage, no database, no server side scripting.

```bash
docker run --rm -d \
  --name betrayal \
  -p 8080:80 \
  me/betrayal
```

## Credits

All credit for this app goes to [Nolen Tabner](http://www.nolentabner.com) which
is hosted [here](http://www.nolentabner.com/projects/betrayal).
