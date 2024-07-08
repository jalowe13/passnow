// Client Side API Calls

const url: string = "http://127.0.0.1:8080";
const api_version: string = "/api/v1/";
const end: string = url + api_version;

export const ENDPOINTS = {
    HEALTH: `${end}health`,
    GENERATE_PASSWORD: `${end}password/generate`,
    SAVE: `${end}save`,
    BUTTON_CLICKED: `${end}button-clicked`,
    ALL_PASSWORDS: `${end}password/all`
}

export const API = {
    async fetch(endpoint: string, options= {}){
        if (endpoint === null || endpoint === "") {
            throw new Error("Endpoint is null or empty for fetchAPI");
          }
        console.log("FETCHING ENDPOINT:", endpoint, "WITH OPTIONS:", options);
        const optionsPath = Object.values(options).reduce((path, value) => `${path}/${value}`, "");
        const fullEndpoint = `${endpoint}${optionsPath}`; // Append options path to endpoint\
        console.log("FETCHING FULL:", `${fullEndpoint}`);
          try {
            const response = await fetch(`${fullEndpoint}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
          } catch (error) {
            console.error(`An error occurred while FETCHING check ${endpoint}`, error);
            throw new Error("Network error occurred while fetching data");
          }
    }
}

export default API;