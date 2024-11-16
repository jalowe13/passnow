// Client Side API Calls

const url: string = "http://127.0.0.1:8080";
const api_version: string = "/api/v1/";
const end: string = url + api_version;

export const ENDPOINTS = {
  HEALTH: `${end}health`,
  GENERATE_PASSWORD: `${end}password/generate`,
  SAVE: `${end}save`,
  BUTTON_CLICKED: `${end}button-clicked`,
  ALL_PASSWORDS: `${end}password/all`,
  DELETE_PASSWORD: `${end}password`,
  IMPORT_PASSWORD: `${end}password/import`,
  FETCH_SLICE: `${end}password`,
  FETCH_CONTAINS_KEYWORD: `${end}password/keyword`,
  FETCH_PASSWORD_AMOUNT: `${end}password/amount`
};

export const API = {
  async fetch(
    endpoint: string,
    options: {
      method?: string;
      params?: Record<string, string>;
      body?: any;
    } = {},
  ) {
    if (endpoint === null || endpoint === "") {
      throw new Error("Endpoint is null or empty for fetchAPI");
    }
    console.log("FETCHING:", `${endpoint}`);
    try {
      const response = await fetch(endpoint, {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        `An error occurred while FETCHING check ${endpoint}`,
        error,
      );
      throw new Error("Network error occurred while fetching data");
    }
  },
};

export default API;
