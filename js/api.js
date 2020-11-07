const API_KEY = "beda3834440743a6ab0267c43b5b1ecb";
const BASE_URL = "https://api.football-data.org/v2";

const LEAGUE_ID = 2021;

const ENDPOINT_STANDING = `${BASE_URL}/competitions/${LEAGUE_ID}/standings`;
const ENDPOIN_TEAM_BY_ID = `${BASE_URL}/teams/`;

const fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(res => {
            if (res.status !== 200) {
                console.log('Error : ' + res.status);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res);
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err);
        })
};

function getAllStandings() {
    if ("caches" in window) {
        caches.match(ENDPOINT_STANDING).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Data Competition: " + data);
                    showStanding(data);
                })
            }
        })
    }
    fetchAPI(ENDPOINT_STANDING)
        .then(data => {
            showStanding(data);
        })
        .catch(error => {
            console.log(error);
        })
}

function getTeamById() {
    return new Promise(function (resolve, reject) {
        //get value query params (?id=)
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");
        if ("caches" in window) {
            caches.match(ENDPOIN_TEAM_BY_ID + idParam).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        console.log("Data Team: " + data);
                        showTeamById(data);
                        resolve(data);
                    })
                }
            })
        }

        fetchAPI(ENDPOIN_TEAM_BY_ID + idParam)
            .then(data => {
                showTeamById(data);
                resolve(data);
            })
            .catch(error => {
                console.log(error);
            })
    });
}

function showStanding(data) {
    let standings = "";
    let standingElement = document.getElementById("standingsLeague");
    let no = 1;

    data.standings[0].table.forEach(function (standing) {
        let teamLogo = standing.team.crestUrl;
        standings += `
            <tr>
                <td>${no}.</td>
                <td><img src="${teamLogo}" width="20px" alt="badgeTeams" /></td>
                <td><a href="./detail.html?id=${standing.team.id}" style="color: black;">${standing.team.name}</a></td>
                <td class="center-align">${standing.playedGames}</td>
                <td class="center-align">${standing.won}</td>
                <td class="center-align">${standing.draw}</td>
                <td class="center-align">${standing.lost}</td>
                <td class="center-align">${standing.goalsFor}</td>
                <td class="center-align">${standing.goalsAgainst}</td>
                <td class="center-align">${standing.goalDifference}</td>
                <td class="center-align">${standing.points}</td>
            </tr>
        `;
        no++;
    });

    standingElement.innerHTML = `
        <div class="card" style="padding: 10px 20px;">
            <table class="striped responsive-table">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>Club</th>
                        <th>Main</th>
                        <th>Menang</th>
                        <th>Imbang</th>
                        <th>Kalah</th>
                        <th>Jml Gol</th>
                        <th>Jml Kebobolan</th>
                        <th>Selisih Gol</th>
                        <th>Poin</th>
                    </tr>
                </thead>
                <tbody>
                    ${standings}
                </tbody>
            </table>
        </div>
    `;
}

function showTeamById(data) {
    let squads = "";
    let info = "";
    let teamElement = document.getElementById("body-content");
    let teamLogo = data.crestUrl;

    info += `
            <div class="card" style="text-align:center;">
                <div class="row">
                    <div class="col s3 l5"></div>
                    <div class="col s6 l2" style="margin-bottom: 0; padding:0; ">
                        <img src="${teamLogo}" style="padding-top: 2rem; width:100%; height: auto;" align="middle" >
                    </div>
                </div>
                <div class="card-content" style="margin-top: 0;padding:0; ">
                    <h5 class="bold">${data.name} (${data.tla})</h5>
                    <h6 class="light bold">${data.area.name}, ${data.founded}</h6>
                    <a href="${data.website}" target="blank" style="margin-top: 10px;">${data.website}</a>
                    <p style="margin-top: 8px;">Stadion: ${data.venue}</p>
                    <p style="margin-top: 8px;">Alamat: ${data.address}</p>
                    <p style="margin-top: 8px;">Warna Klub: ${data.clubColors}</p>
                    <br>
                </div>
        `;

    data.squad.forEach(function (member) {
        squads += `
            <tr style="text-align: center;">
                <td>${member.name}</td>
                <td>${member.nationality}</td>
                <td>${member.role}</td>
                <td>${member.position}</td>
            </tr>
    `;
    });

    teamElement.innerHTML = `
            ${info}
                <div class="card" style="padding: 0 24px">
                    <table class="striped responsive-table">
                        <thead>
                        <tr><h5 style="text-align: center; padding-top: 15px;"><strong>Pemain</strong><h5></tr>
                            <tr>
                                <th>Nama</th>
                                <th>Negara</th>
                                <th>Role</th>
                                <th>Posisi</th>
                            </tr>
                        </thead>
                        <tbody id="standings" >
                            ${squads}
                        </tbody>
                    </table>
                    
                </div>
            </div>
        `;
}

function getSavedTeams() {
    getAll().then(function (teams) {
        console.log(teams);
        let squads = "";

        teams.forEach(function (team) {
            let logoTeam = team.crestUrl;
            squads += `
                    <a href="./detail.html?id=${team.id}&saved=true" style="color:black;">
                        <div class="col s12 m4 l3" style="float: left; margin: 0; padding: 10px; ">
                            <div class="card">
                                <div class="card-image" style="height : 15rem;">
                                    <img src="${logoTeam}" style="margin: auto; padding: 1rem 1rem 0 1rem; height: 100%; width:auto; max-width: 100%; ">
                                </div>
                                <div class="card-content" style="padding: 5px"> 
                                    <h5 class="bold center-align">${team.name}</h5>
                                </div>
                                <div class="card-action center-align">
                                    <a href="/detail.html?id=${team.id}&saved=true" style="color: #3F1052; font-weight: bold;">Lihat Detail</a>
                                </div>
                            </div>
                        </div>
                    </a>
                    `;
        });

        document.getElementById("saved").innerHTML = ` 
                    <div class="row">    
                        ${squads}
                    </div>
                `;
    });
}

function getSavedTeamById() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = parseInt(urlParams.get("id"));

    getById(idParam).then(function (team) {
        console.log(team);
        showTeamById(team);
    });
}