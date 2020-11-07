let webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BG1EeUiKajKPXCJRL3cDl4o42xjmwj37npejRpUiqneNYEkJldvA9NpM3r79OGE5eGw8Y2Bl5qXL3tW_aTv-AQY",
    "privateKey": "ilFhEUdcSnvoUZIL1e87Ugdo21M1xRnY3IBGPdFHluE"
};

webPush.setVapidDetails(
    'mailto:fachrulmustofa200@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

let pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/cz12dqKUgmk:APA91bFXoSg7SL3Wnz0zroX_Zw3Q7pfS0iDBiPBJg3bSSrjrbH3YYXRZiU1QgznTa5rUvKIpepiEMMAys5O0-uuQpHMH6-P6qCTTmZI3bUSRBr6DBMPwF8xozGsY334EKQNUvaxP5XzW",
    "keys": {
        "p256dh": "BEG4033AUgdtznb2rWJ1jOztGh8mFezGc4OiBa5AUL6rb+e1rQvC6GVxuCYHg0iGdS7d3zODkSY56UvP0cw7SDM=",
        "auth": "dWHlCkrkX5TYF8iIVCutXw=="
    }
};

let payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

let options = {
    gcmAPIKey: '49890083311',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);