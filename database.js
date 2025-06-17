/**
 * ======================================================================
 *              DATABASE CONFIGURATION (IMPORTANT!)
 * ======================================================================
 * 
 * INSTRUCTIONS:
 * 1. Go to https://www.npoint.io/
 * 2. Paste your initial JSON data. For this app, you can start with:
 *    {
 *      "users": { "system": { "username": "System", "points": 999999 } },
 *      "botLinks": []
 *    }
 * 3. Click "Save" and copy the URL it provides.
 * 4. Paste your unique URL below to replace the placeholder.
 */

// !!! REPLACE THIS URL WITH YOUR OWN FROM NPOINT.IO !!!
const DB_ENDPOINT = 'https://api.npoint.io/b9a328d7a1883398c76c'; // This is a placeholder/example URL

/**
 * Loads the entire database from the cloud.
 * @returns {Promise<object>} A promise that resolves to the database JSON object.
 */
export async function loadDatabase() {
    if (!DB_ENDPOINT || DB_ENDPOINT.includes('placeholder')) {
        const errorMsg = "Database is not configured. Please set your npoint.io URL in database.js";
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
    try {
        const response = await fetch(DB_ENDPOINT, {
            cache: 'no-cache' // Always get the latest version
        });
        if (!response.ok) {
            // If the bin doesn't exist or there's a network error
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Could not load data from database:", error);
        throw error; // Re-throw to be handled by the caller
    }
}

/**
 * Saves the entire state object to the cloud database.
 * @param {object} data The entire application data object to save.
 * @returns {Promise<void>} A promise that resolves when the save is complete.
 */
export async function saveDatabase(data) {
     if (!DB_ENDPOINT || DB_ENDPOINT.includes('placeholder')) {
        const errorMsg = "Database is not configured. Please set your npoint.io URL in database.js";
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
    try {
        const response = await fetch(DB_ENDPOINT, {
            method: 'POST', // POST on npoint.io updates the bin content
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data, null, 2), // Pretty-print JSON for readability
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Could not save data to database:", error);
        throw error; // Re-throw to be handled by the caller
    }
}