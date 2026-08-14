/* ==================================================
   KERALAM — DISTRICT PAGE
================================================== */

const API_URL =
    "http://localhost:3000/api";


/* ==================================================
   GET DISTRICT ID FROM URL
================================================== */

const params =
    new URLSearchParams(
        window.location.search
    );


const districtId =
    params.get("id");


/* ==================================================
   PAGE ELEMENTS
================================================== */

const districtName =
    document.getElementById(
        "districtName"
    );


const districtTagline =
    document.getElementById(
        "districtTagline"
    );


const districtDescription =
    document.getElementById(
        "districtDescription"
    );


const placesGrid =
    document.getElementById(
        "placesGrid"
    );


/* ==================================================
   LOAD DISTRICT
================================================== */

async function loadDistrict() {

    if (!districtId) {

        showError(
            "No district was selected."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/districts/${encodeURIComponent(
                    districtId
                )}`
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "District received:",
            result
        );


        const district =
            result.district ||
            result.data ||
            result;


        displayDistrict(
            district
        );


        await loadPlaces(
            districtId
        );

    }

    catch (error) {

        console.error(
            "District loading error:",
            error
        );


        showError(
            "Unable to load this district."
        );

    }

}


/* ==================================================
   DISPLAY DISTRICT
================================================== */

function displayDistrict(
    district
) {

    const name =
        district.name ||
        "Kerala District";


    const tagline =
        district.tagline ||
        "Discovering Kerala";


    const description =
        district.description ||
        "Explore the beauty, culture and heritage of Kerala.";


    districtName.textContent =
        name;


    districtTagline.textContent =
        tagline;


    districtDescription.textContent =
        description;


    document.title =
        `${name} | Keralam`;


    /*
       Set hero image
    */

    if (district.image) {

        const hero =
            document.querySelector(
                ".district-hero"
            );


        hero.style.backgroundImage =
            `
            linear-gradient(
                90deg,
                rgba(5, 28, 19, .82),
                rgba(5, 28, 19, .25)
            ),
            url("${district.image}")
            `;

    }

}


/* ==================================================
   LOAD TOURIST PLACES
================================================== */

async function loadPlaces(
    id
) {

    try {

        const response =
            await fetch(
                `${API_URL}/districts/${encodeURIComponent(
                    id
                )}/places`
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const result =
            await response.json();


        const places =
            Array.isArray(result)

                ? result

                : (
                    result.places ||
                    result.data ||
                    result.results ||
                    []
                );


        if (!places.length) {

            placesGrid.innerHTML = `

                <div class="district-loading">

                    No tourist places found
                    for this district yet.

                </div>

            `;

            return;

        }


        placesGrid.innerHTML =
            places
                .map(
                    place =>
                        createPlaceCard(
                            place
                        )
                )
                .join("");

    }

    catch (error) {

        console.error(
            "Places loading error:",
            error
        );


        placesGrid.innerHTML = `

            <div class="district-loading">

                Unable to load tourist places.

            </div>

        `;

    }

}


/* ==================================================
   CREATE PLACE CARD
================================================== */

function createPlaceCard(
    place
) {

    const name =
        escapeHTML(
            place.name ||
            "Tourist Place"
        );


    const description =
        escapeHTML(
            place.description ||
            "Discover this beautiful destination in Kerala."
        );


    const type =
        escapeHTML(
            place.type ||
            place.category ||
            "DESTINATION"
        );


    const image =
        place.image
            ? escapeHTML(place.image)
            : "";


    return `

        <article class="place-card">

            <div class="place-image">

                ${
                    image

                    ? `

                        <img
                            src="${image}"
                            alt="${name}"
                            loading="lazy"
                        >

                    `

                    : ""

                }


                <span>
                    ${type}
                </span>

            </div>


            <div class="place-info">

                <h3>
                    ${name}
                </h3>


                <p>
                    ${description}
                </p>

            </div>

        </article>

    `;

}


/* ==================================================
   ERROR
================================================== */

function showError(
    message
) {

    districtName.textContent =
        "Something went wrong";


    districtTagline.textContent =
        message;


    districtDescription.textContent =
        "Please return to the Kerala districts page and try again.";


    placesGrid.innerHTML = `

        <div class="district-loading">

            ${escapeHTML(message)}

            <br><br>

            <a
                href="index.html#districts"
                class="back-button"
            >

                ← Back to districts

            </a>

        </div>

    `;

}


/* ==================================================
   ESCAPE HTML
================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==================================================
   START
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    loadDistrict
);