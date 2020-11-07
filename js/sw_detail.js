if (!("serviceWorker" in navigator)) {
    console.log("ServiceWorker belum didukung browser ini!.");
} else {
    registerServiceWorker();
    requstPerrmission();
}

//function register
function registerServiceWorker() {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/sw.js")
            .then(function () {
                console.log("Pendafataran ServiceWorker berhasil");
            })
            .catch(function () {
                console.log("Pendaftaran ServiceWorker gagal.");
            });
    });
}

//function request permission
function requstPerrmission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (result) {
            if (result === "denied") {
                console.log("Pendaftaran Service Worker berhasil");
                return;
            } else if (result === "default") {
                console.log("Pengguna menutup kotak dialog permintaan ijin.");
                return;
            }

            /* kode berlangganan pesan push melalui objek PushManager */
            if (('PushManager') in window) {
                navigator.serviceWorker.getRegistration().then(function (registration) {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(
                            "BG1EeUiKajKPXCJRL3cDl4o42xjmwj37npejRpUiqneNYEkJldvA9NpM3r79OGE5eGw8Y2Bl5qXL3tW_aTv-AQY"
                        )
                    }).then(function (subscribe) {
                        console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                        console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                            null, new Uint8Array(subscribe.getKey('p256dh')))));
                        console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                            null, new Uint8Array(subscribe.getKey('auth')))))
                    }).catch(function (e) {
                        console.error('Tidak dapat melakukan subscribe ', e.message);
                    });
                });
            }
        });
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

document.addEventListener("DOMContentLoaded", function () {
    let urlParams = new URLSearchParams(window.location.search);
    let id = Number(urlParams.get("id"));
    let isSave = urlParams.get("saved");
    let btnSave = document.getElementById("save");
    let btnRemove = document.getElementById("delete");
    let item = getTeamById();

    checkFavorite(id);

    if (isSave) {
        btnSave.style.display = 'none';
        getSavedTeamById();
    } else {
        btnRemove.style.display = 'none';
    }

    checkFavorite(id).then((msg) => {
        btnSave.style.display = 'none';
        btnRemove.style.display = 'block';
    }).catch((msg) => {
        btnSave.style.display = 'block';
        btnRemove.style.display = 'none';
    });

    btnSave.onclick = function () {
        console.log("Tombol Save diklik");
        item.then(function (team) {
            saveForLater(team);
        });
    };

    btnRemove.onclick = function () {
        console.log("Tombol Remove diklik");
        item.then(function (id) {
            removeTeam(id);
        });
        location.replace("/#favorite");
    }
});