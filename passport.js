/**
 * @copyright 2020 - Sankarsan Kampa
 * @license MIT
 */


/** The subdomain of Passport */
const PASSPORT_SUBDOMAIN = "passport";

/** The subdomain of extraction API */
const API_SUBDOMAIN = "ex";


/**
 * Constructs an URL for traction.one for the specified subdomain and path.
 * @param {string} subdomain the subdomain of the URL
 * @param {string} path the path to the resource
 * @returns {string} the fully qualified URL
 */
const buildURL = (subdomain, path) => {
    const PROTOCOL = "https://";
    const DOMAIN = "traction.one";

    let BASE_URL;
    if (subdomain) {
        BASE_URL = PROTOCOL + subdomain + "." + DOMAIN;
    } else {
        BASE_URL = PROTOCOL + DOMAIN;
    }

    if (path) {
        return BASE_URL + (path.startsWith("/") ? "" : "/") + path;
    }
    return BASE_URL;
};


/**
 * Makes a request to the URL resource.
 * @param {string} url the request URL
 * @returns {Promise<Response>}
 */
const request = (url) => {
    return window.fetch(url, {
        credentials: "include",
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        json: true,
    });
};


/**
 * Sign in with Passport.
 */
const signInWithPassport = () => {
    const popup = window.open(buildURL(PASSPORT_SUBDOMAIN), "_blank", "height=600,width=600");

    let timer = window.setInterval(() => {
        if (popup.closed) {
            clearInterval(timer);

            request(buildURL(API_SUBDOMAIN, "/accounts/verify"))
                .then(res => res.json())
                .then(res => {
                    if (res.username) {
                        // eslint-disable-next-line no-undef
                        if (typeof onPassportSignin !== "undefined" && onPassportSignin instanceof Function) {
                            // eslint-disable-next-line no-undef
                            onPassportSignIn(res);
                        } else {
                            throw new Error("PassportError: onPassportSignIn function wasn't declared to handle the signin event.");
                        }
                    } else {
                        // eslint-disable-next-line no-undef
                        if (typeof onPassportError !== "undefined" && onPassportError instanceof Function) {
                            // eslint-disable-next-line no-undef
                            onPassportError(res);
                        } else {
                            throw new Error("PassportError: onPassportError function wasn't declared to handle the error event.");
                        }
                    }
                })
                .catch(err => {
                    // eslint-disable-next-line no-undef
                    if (typeof onPassportRequestError !== "undefined" && onPassportRequestError instanceof Function) {
                        // eslint-disable-next-line no-undef
                        onPassportRequestError(err);
                    } else {
                        throw new Error("PassportError: onPassportRequestError function wasn't declared to handle the error event.");
                    }
                });
        }
    }, 1000);
};

/**
 * HACK: Since `module` doesn't exist in browsers, this will prevent
 * from showing errors when loaded in browsers.
 */
// eslint-disable-next-line no-global-assign
if (typeof module === "undefined") module = {};

module.exports = {
    signInWithPassport,
};
