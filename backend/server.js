const express = require("express");
const cors = require("cors");

const districts = require("./data/districts");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
    res.json({
        name: "Keralam API",
        message: "Welcome to God's Own Country",
        status: "running",
        version: "1.0.0"
    });
});


// ==========================================
// GET ALL DISTRICTS
// ==========================================

app.get("/api/districts", (req, res) => {

    res.json({
        success: true,
        count: districts.length,
        data: districts
    });

});


// ==========================================
// GET SINGLE DISTRICT
// ==========================================

app.get("/api/districts/:id", (req, res) => {

    const district = districts.find(
        item => item.id === req.params.id.toLowerCase()
    );

    if (!district) {

        return res.status(404).json({
            success: false,
            message: "District not found"
        });

    }

    res.json({
        success: true,
        data: district
    });

});


// ==========================================
// GET PLACES OF A DISTRICT
// ==========================================

app.get("/api/districts/:id/places", (req, res) => {

    const district = districts.find(
        item => item.id === req.params.id.toLowerCase()
    );

    if (!district) {

        return res.status(404).json({
            success: false,
            message: "District not found"
        });

    }

    res.json({
        success: true,
        district: district.name,
        count: district.places.length,
        data: district.places
    });

});


// ==========================================
// GET ALL TOURIST PLACES
// ==========================================

app.get("/api/places", (req, res) => {

    const places = [];

    districts.forEach(district => {

        district.places.forEach(place => {

            places.push({
                ...place,
                district: district.name,
                districtId: district.id
            });

        });

    });

    res.json({
        success: true,
        count: places.length,
        data: places
    });

});


// ==========================================
// SEARCH
// ==========================================

app.get("/api/search", (req, res) => {

    const query = req.query.q;

    if (!query) {

        return res.status(400).json({
            success: false,
            message: "Please provide a search query"
        });

    }

    const searchTerm = query.toLowerCase();

    const results = [];

    districts.forEach(district => {

        district.places.forEach(place => {

            const searchableText = `
                ${place.name}
                ${place.category}
                ${place.description}
                ${district.name}
            `.toLowerCase();

            if (searchableText.includes(searchTerm)) {

                results.push({
                    ...place,
                    district: district.name,
                    districtId: district.id
                });

            }

        });

    });

    res.json({
        success: true,
        query,
        count: results.length,
        data: results
    });

});


// ==========================================
// 404
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});


// ==========================================
// SERVER
// ==========================================

app.listen(PORT, () => {

    console.log("");
    console.log("========================================");
    console.log("          KERALAM BACKEND");
    console.log("========================================");
    console.log(`Server: http://localhost:${PORT}`);
    console.log("");
    console.log("API:");
    console.log("/api/districts");
    console.log("/api/districts/:id");
    console.log("/api/districts/:id/places");
    console.log("/api/places");
    console.log("/api/search?q=...");
    console.log("========================================");
    console.log("");

});