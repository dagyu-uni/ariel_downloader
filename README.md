# Usage

## Create a json file

If you want to download all the videos contained into an Ariel web page write a json file like this:

```json
{
    "credentials": {
        "username": "USERNAME_UNIMI",
        "password": "YOUR_PASSWORD",
        "domain": "@studenti.unimi.it"
    },
    "material": [
        {
            "url": "https://smascettisadm.ariel.ctu.unimi.it/v5/frm3/ThreadList.aspx?fc=5QUYRG6KUnHNyCKYoY4x9ZqzNC8Z8G8r63Q21allT9%2fv%2bfephUv3q4FFabAKVFDh&roomid=225360",
            "basedir": "/Users/dagyu/Documents/uni/mobidev_20-21"
        },
        {
            "url":"https://onlinegamedesign.ariel.ctu.unimi.it/v5/frm3/ThreadList.aspx?fc=ZjB%2b7tNuW3rKV1NiHCjs%2fLIYuLUX83KCCbg9YC%2bAWNuomM%2f2bmVjTqzvRc0RkWC3&roomid=228574",
            "basedir":"/Users/dagyu/Documents/uni/ogd"
        },
        {
            "url":"https://dgadiartgp.ariel.ctu.unimi.it/v5/frm3/ThreadList.aspx?fc=wePuKDwYXGSAqED%2fprMFzhMGSlyBnQGzQ%2fDO5bGu0pG%2fxurs9Er5q8TA47%2f96mlb&roomid=229823",
            "basedir":"/Users/dagyu/Documents/uni/rtgp"
        }
    ]
}
```

Note that:

- `url` is the ariel link where the videolectures are
- `basedir` is the absolute path of your filesystem where you want to save downloaded videos 

## Install dependencies

- Install NodeJS dependencies typing `npm install` or `yarn`.
- Verify that you have `ffmpeg` installed typing `ffmpeg -version` otherwise install it at this link https://ffmpeg.org/download.html

## Start download

Now that the setup is ok, you can start the download using this command:

```sh
node index.js PATH_JSON_FILE
```

## View the logs

If you want to view live logs a `downloads.log` file is created so you can type `tail -f downloads.log` to see it.