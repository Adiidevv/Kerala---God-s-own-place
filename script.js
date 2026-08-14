/* ==================================================
   KERALAM — MAIN JAVASCRIPT
   Districts + Search + District Page Navigation
================================================== */

const API_URL = "http://localhost:3000/api";


/* ==================================================
   NAVBAR
================================================== */

const navbar = document.getElementById("navbar");

if (navbar) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 80) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    });

}


/* ==================================================
   MOBILE MENU
================================================== */

const menuBtn =
    document.getElementById("menuBtn");

const navLinks =
    document.getElementById("navLinks");


if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("active");

    });

}


document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener("click", () => {

            if (navLinks) {

                navLinks.classList.remove(
                    "active"
                );

            }

        });

    });


/* ==================================================
   SMOOTH SCROLL
================================================== */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

        anchor.addEventListener(
            "click",
            function (event) {

                const target =
                    document.querySelector(
                        this.getAttribute("href")
                    );


                if (!target) return;


                event.preventDefault();


                target.scrollIntoView({

                    behavior: "smooth"

                });

            }
        );

    });


/* ==================================================
   ESCAPE HTML
================================================== */

function escapeHTML(value) {

    return String(value ?? "")

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
   NORMALIZE API RESPONSE
================================================== */

function getArrayFromResponse(
    result,
    keys = []
) {

    if (Array.isArray(result)) {

        return result;

    }


    for (const key of keys) {

        if (
            Array.isArray(
                result?.[key]
            )
        ) {

            return result[key];

        }

    }


    return [];

}


/* ==================================================
   LOAD KERALA DISTRICTS
================================================== */

async function loadDistricts() {

    const districtGrid =
        document.getElementById(
            "districtGrid"
        );


    if (!districtGrid) {

        return;

    }


    try {

        console.log(
            "Loading Kerala districts..."
        );


        const response =
            await fetch(
                `${API_URL}/districts`
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Raw district response:",
            result
        );


        const districts =
            getArrayFromResponse(
                result,
                [
                    "districts",
                    "data",
                    "results"
                ]
            );


        if (!districts.length) {

            throw new Error(
                "No district data found."
            );

        }


        districtGrid.innerHTML = "";


        /* ------------------------------------------
           CREATE DISTRICT CARDS
        ------------------------------------------ */

        districts.forEach(
            (district, index) => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "district-card";


                const placeCount =
                    Array.isArray(
                        district.places
                    )

                    ? district.places.length

                    : Number(
                        district.placeCount ||
                        district.placesCount ||
                        0
                    );


                card.innerHTML = `

                    <div class="district-image">

                        <img
                            src="${escapeHTML(
                                district.image || ""
                            )}"
                            alt="${escapeHTML(
                                district.name ||
                                "Kerala district"
                            )}"
                            loading="lazy"
                        >

                        <div class="district-number">

                            ${String(
                                index + 1
                            ).padStart(2, "0")}

                        </div>

                    </div>


                    <div class="district-info">

                        <span class="district-label">

                            DISTRICT

                        </span>


                        <h3>

                            ${escapeHTML(
                                district.name ||
                                "Unknown District"
                            )}

                        </h3>


                        <p class="district-tagline">

                            ${escapeHTML(
                                district.tagline ||
                                "Explore Kerala"
                            )}

                        </p>


                        <p>

                            ${escapeHTML(
                                district.description ||
                                "Discover the landscapes, culture and destinations of this district."
                            )}

                        </p>


                        <div class="district-footer">

                            <span>

                                ${placeCount}
                                famous places

                            </span>


                            <button
                                class="district-button"
                                data-id="${escapeHTML(
                                    String(
                                        district.id ?? ""
                                    )
                                )}"
                            >

                                Explore

                            </button>

                        </div>

                    </div>

                `;


                districtGrid.appendChild(
                    card
                );


                /* ----------------------------------
                   EXPLORE BUTTON

                   NOW OPENS A NEW PAGE
                ---------------------------------- */

                const button =
                    card.querySelector(
                        ".district-button"
                    );


                if (button) {

                    button.addEventListener(
                        "click",
                        () => {

                            const id =
                                district.id;


                            if (!id) {

                                console.error(
                                    "District ID is missing:",
                                    district
                                );

                                return;

                            }


                            window.location.href =
                                `district.html?id=${encodeURIComponent(
                                    id
                                )}`;

                        }
                    );

                }

            }
        );


        console.log(
            `Successfully loaded ${districts.length} districts.`
        );

    }


    catch (error) {

        console.error(
            "Error loading districts:",
            error
        );


        districtGrid.innerHTML = `

            <div class="district-loading">

                <p>
                    Unable to load Kerala districts.
                </p>


                <p style="margin-top:10px;">

                    Make sure the backend is
                    running on port 3000.

                </p>

            </div>

        `;

    }

}


/* ==================================================
   SEARCH ELEMENTS
================================================== */

const searchForm =
    document.getElementById(
        "searchForm"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const searchClear =
    document.getElementById(
        "searchClear"
    );


const searchStatus =
    document.getElementById(
        "searchStatus"
    );


const searchResults =
    document.getElementById(
        "searchResults"
    );


/* ==================================================
   UPDATE CLEAR BUTTON
================================================== */

function updateSearchClearButton() {

    if (
        !searchClear ||
        !searchInput
    ) {

        return;

    }


    searchClear.classList.toggle(
        "visible",
        searchInput.value
            .trim()
            .length > 0
    );

}


/* ==================================================
   NORMALIZE SEARCH RESPONSE
================================================== */

function normalizeSearchResults(
    result
) {

    if (Array.isArray(result)) {

        return result;

    }


    if (
        Array.isArray(
            result?.results
        )
    ) {

        return result.results;

    }


    if (
        Array.isArray(
            result?.data
        )
    ) {

        return result.data;

    }


    if (
        Array.isArray(
            result?.places
        )
    ) {

        return result.places;

    }


    if (
        Array.isArray(
            result?.districts
        )
    ) {

        return result.districts;

    }


    return [];

}


/* ==================================================
   GET SEARCH RESULT NAME
================================================== */

function getResultName(item) {

    return (

        item.name ||

        item.title ||

        item.place?.name ||

        item.district?.name ||

        "Unknown"

    );

}


/* ==================================================
   GET DISTRICT NAME
================================================== */

function getResultDistrict(item) {

    if (
        typeof item.district === "string"
    ) {

        return item.district;

    }


    if (item.district?.name) {

        return item.district.name;

    }


    if (item.districtName) {

        return item.districtName;

    }


    if (item.place?.district) {

        return item.place.district;

    }


    return "Kerala";

}


/* ==================================================
   GET DESCRIPTION
================================================== */

function getResultDescription(
    item
) {

    return (

        item.description ||

        item.place?.description ||

        item.district?.description ||

        "Discover this beautiful part of Kerala."

    );

}


/* ==================================================
   GET IMAGE
================================================== */

function getResultImage(item) {

    return (

        item.image ||

        item.place?.image ||

        item.district?.image ||

        ""

    );

}


/* ==================================================
   GET RESULT TYPE
================================================== */

function getResultType(item) {

    if (item.type) {

        return item.type;

    }


    if (item.place) {

        return "TOURIST PLACE";

    }


    if (item.district) {

        return "DISTRICT";

    }


    if (item.category) {

        return item.category;

    }


    return "KERALA DESTINATION";

}


/* ==================================================
   DISPLAY SEARCH RESULTS
================================================== */

function renderSearchResults(
    items,
    query
) {

    if (!searchResults) {

        return;

    }


    if (!items.length) {

        searchResults.innerHTML = `

            <div class="search-empty">

                No results found for

                <strong>
                    “${escapeHTML(query)}”
                </strong>.

                <br><br>

                Try another district
                or tourist place.

            </div>

        `;

        return;

    }


    searchResults.innerHTML =

        items.map(
            item => {

                const name =
                    getResultName(
                        item
                    );


                const district =
                    getResultDistrict(
                        item
                    );


                const description =
                    getResultDescription(
                        item
                    );


                const image =
                    getResultImage(
                        item
                    );


                const type =
                    getResultType(
                        item
                    );


                return `

                    <article
                        class="search-result-card"
                    >

                        <div
                            class="search-result-image"
                        >

                            ${
                                image

                                ? `

                                    <img
                                        src="${escapeHTML(
                                            image
                                        )}"
                                        alt="${escapeHTML(
                                            name
                                        )}"
                                        loading="lazy"
                                    >

                                `

                                : ""

                            }

                        </div>


                        <div
                            class="search-result-info"
                        >

                            <span
                                class="search-result-type"
                            >

                                ${escapeHTML(
                                    type
                                )}

                            </span>


                            <h4>

                                ${escapeHTML(
                                    name
                                )}

                            </h4>


                            <div
                                class="search-result-district"
                            >

                                📍
                                ${escapeHTML(
                                    district
                                )}

                            </div>


                            <p>

                                ${escapeHTML(
                                    description
                                )}

                            </p>

                        </div>

                    </article>

                `;

            }
        ).join("");

}


/* ==================================================
   PERFORM SEARCH
================================================== */

async function performSearch() {

    if (
        !searchInput ||
        !searchStatus ||
        !searchResults
    ) {

        return;

    }


    const query =
        searchInput.value.trim();


    if (!query) {

        searchStatus.textContent =
            "Type a district or tourist place to search.";


        searchResults.innerHTML = "";


        updateSearchClearButton();


        return;

    }


    searchStatus.className =
        "search-status";


    searchStatus.textContent =
        `Searching Keralam for “${query}”...`;


    searchResults.innerHTML = "";


    try {

        const response =
            await fetch(
                `${API_URL}/search?q=${encodeURIComponent(
                    query
                )}`
            );


        if (!response.ok) {

            throw new Error(
                `Search request failed with status ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Search response:",
            result
        );


        const items =
            normalizeSearchResults(
                result
            );


        if (items.length) {

            searchStatus.textContent =
                `${items.length} result${
                    items.length === 1
                        ? ""
                        : "s"
                } found.`;

        } else {

            searchStatus.textContent =
                "No matching results found.";

        }


        renderSearchResults(
            items,
            query
        );

    }


    catch (error) {

        console.error(
            "Search error:",
            error
        );


        searchStatus.className =
            "search-status error";


        searchStatus.textContent =
            "Unable to search right now. " +
            "Make sure the backend is running on port 3000.";


        searchResults.innerHTML = "";

    }

}


/* ==================================================
   SEARCH FORM
================================================== */

if (searchForm) {

    searchForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            performSearch();

        }
    );

}


/* ==================================================
   SEARCH INPUT
================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        updateSearchClearButton
    );


    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                performSearch();

            }

        }
    );

}


/* ==================================================
   CLEAR SEARCH
================================================== */

if (searchClear) {

    searchClear.addEventListener(
        "click",
        () => {

            if (searchInput) {

                searchInput.value = "";

                searchInput.focus();

            }


            if (searchStatus) {

                searchStatus.textContent =
                    "";

            }


            if (searchResults) {

                searchResults.innerHTML =
                    "";

            }


            updateSearchClearButton();

        }
    );

}


/* ==================================================
   IMAGE ERROR HANDLING
================================================== */

document
    .querySelectorAll("img")
    .forEach(image => {

        image.addEventListener(
            "error",
            () => {

                console.warn(
                    "Image failed to load:",
                    image.src
                );

            }
        );

    });


/* ==================================================
   SCROLL REVEAL
================================================== */

function setupRevealAnimation() {

    if (
        !("IntersectionObserver" in window)
    ) {

        return;

    }


    const elements =
        document.querySelectorAll(
            ".story-grid, " +
            ".nature-card, " +
            ".culture-card, " +
            ".festival-item, " +
            ".gallery-item"
        );


    const observer =
        new IntersectionObserver(
            (
                entries,
                observer
            ) => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "reveal"
                            );


                            setTimeout(
                                () => {

                                    entry.target.classList.add(
                                        "active"
                                    );

                                },
                                100
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        element => {

            observer.observe(
                element
            );

        }
    );

}


/* ==================================================
   CURRENT YEAR
================================================== */

function updateYear() {

    const footerText =
        document.querySelector(
            ".footer-bottom p"
        );


    if (footerText) {

        footerText.textContent =
            `© ${new Date().getFullYear()} Keralam. Made with ❤️ in Kerala.`;

    }

}


/* ==================================================
   START WEBSITE
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Keralam website started."
        );


        loadDistricts();


        setupRevealAnimation();


        updateYear();


        updateSearchClearButton();

    }
);