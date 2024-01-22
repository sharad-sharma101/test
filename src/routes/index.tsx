// @ts-nocheck
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
const Home = lazy(() => {
	return import("../pages/Home");
});
const WebEditor = lazy(() => {
	return import("../pages/WebEditor/WebEditor");
});
import AuthenticatedRoutes from "./authenticated";
import AppLoader from "../components/app-Loader";

const AppRoute: React.FC = () => {
	return (
		<Suspense>
			<Routes>
				<Route path="/" element={<AppLoader/>}  />
				<Route path="*" element={<AuthenticatedRoutes />} />
			</Routes>
		</Suspense>
	);
};

export default AppRoute;
