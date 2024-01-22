import { SERVER_ROUTES } from "./constants";
const { VITE_SERVER_BASE_URL: BASE_URL } = import.meta.env;

const SERVER_BASE_URL = BASE_URL;
// serverl url for user specific templates actions
const templatesApi = `${SERVER_BASE_URL}${SERVER_ROUTES.users}`;
// serverl url for master templates
const referencesApi = `${SERVER_BASE_URL}${SERVER_ROUTES.references}`;

export { SERVER_BASE_URL, templatesApi, referencesApi };
