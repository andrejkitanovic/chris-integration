// eslint-disable-next-line no-undef
let params = new URLSearchParams(document.location.search);
let code = params.get("code");

if (code) {
    // eslint-disable-next-line no-undef
    document.location.search = ""
    // eslint-disable-next-line no-undef
    axios.post(`/api/user`, { code });
}


// Create cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    // eslint-disable-next-line no-undef
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Delete cookie
function deleteCookie(cname) {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    // eslint-disable-next-line no-undef
    document.cookie = cname + "=;" + expires + ";path=/";
}

// Read cookie
function getCookie(cname) {
    let name = cname + "=";
    // eslint-disable-next-line no-undef
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Set cookie consent
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function acceptCookieConsent() {
    deleteCookie('user_cookie_consent');
    setCookie('user_cookie_consent', 1, 30);
    // eslint-disable-next-line no-undef
    document.getElementById("cookieNotice").style.display = "none";
}

let cookie_consent = getCookie("user_cookie_consent");
if (cookie_consent != "") {
    // eslint-disable-next-line no-undef
    document.getElementById("cookieNotice").style.display = "none";
} else {
    // eslint-disable-next-line no-undef
    document.getElementById("cookieNotice").style.display = "block";
}
