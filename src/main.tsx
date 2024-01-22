import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import App from "./App"
import { Authenticator } from "./auth/AuthContext"
import "./auth/configurations/amplify-init"
import { SidebarInformation } from "./auth/sidebarContext"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import AppLoader from "./components/app-Loader"


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
		<BrowserRouter>
	    <Authenticator>
		<SidebarInformation>
			<App />
		</SidebarInformation>
	    </Authenticator>
		</BrowserRouter>
		</Provider>
	</React.StrictMode>
)