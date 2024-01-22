import React from "react";
import { Route, Routes } from "react-router-dom";
import ConfirmProductIntegration from "../../pages/ConfirmProductIntegration";
import { NavbarComponent } from "../../components/navbar";
import EditorView from "../../pages/Editor";
import EditUseCaseView from "../../pages/EditUseCaseView";
import InsertCode from "../../../src/components/how-to-insert-code";
import NotFound from "../../pages/NotFound";
import AggregateUseCaseView from "../../pages/use-cases-view/aggregate";
import AggregateSegmentsView from "../../pages/segments/aggregate";
import GettingStarted from "../../pages/getting-started";
import PaymentSuccess from "../../pages/Payments/success";
import AppSidebar from "../../components/app-sidebar";
import AggregateCampaignView from "../../pages/campaigns/aggregate";
import UseCaseView from "../../pages/use-cases-view/usecase";
import SegmentView from "../../pages/segments/segment";
import CampaignView from "../../pages/campaigns/campaign";
import TemplateLibrary from "../../pages/TemplateLibrary";
import AllTemplateView from "../../pages/AllTemplateView";
import WebPreview from "../../pages/LivePlacement";
import VariantsRoutes from "./../variants";
import Layout from "../layouts";

import UserProfileView from "../../pages/UserProfileView";

import AudiencesFindPeople from "../../pages/Audiences/Find-people";


const AuthenticatedRoutes: React.FC = () => {
	return (
	  <Routes>
		{/* Routes without sidebar */}
		<Route
		  path="variants/:variantId/*"
		  element={<Layout Component={VariantsRoutes} withSidebar={false} />}
		  />
		<Route path="/preview" element={<Layout Component={WebPreview} withSidebar={false} />} />
		<Route
		  path="/connect"
		  element={<Layout Component={ConfirmProductIntegration} withSidebar={false} />}
		  />
	
		<Route path="/thank-you" element={<Layout Component={PaymentSuccess} withSidebar={false} />} />
		{/* Routes without sidebar */}

		{/* Routes with sidebar */}
		<Route path="/audiences/find-visitors/:type/:id" element={<Layout Component={UserProfileView}/>}/>
		<Route path="/getting-started" element={<Layout Component={GettingStarted} />} />
		<Route path="/template-library" element={<Layout Component={TemplateLibrary} />} />
		<Route path="/template-library/my-templates" element={<Layout Component={AllTemplateView} />} />
		<Route path="/use-cases" element={<Layout Component={AggregateUseCaseView} />} />
		<Route path="/use-cases/:usecaseId" element={<Layout Component={UseCaseView} />} />
		<Route path="/segments/all" element={<Layout Component={AggregateSegmentsView} />} />
		<Route path="/segments/all/:segmentId" element={<Layout Component={SegmentView} />} />
		<Route path="/my-campaigns" element={<Layout Component={AggregateCampaignView} />} />
		<Route path="/my-campaigns/:campaignId" element={<Layout Component={CampaignView} />} />
		<Route path="/segments/all/:segmentId/my-campaigns/:campaignId" element={<Layout Component={CampaignView} />} />
		<Route path="/use-cases/:usecaseId/my-campaigns/:campaignId" element={<Layout Component={CampaignView} />} />
		<Route path="/settings/insert-code" element={<Layout Component={InsertCode} />} />
		<Route path="/audiences/find-visitors" element={<Layout Component={AudiencesFindPeople} />} />
		{/* Routes with sidebar */}

		{/* 404 routes */}
		<Route path="/not-found" element={<Layout Component={NotFound} withSidebar={false} />} />
		<Route path="*" element={<Layout Component={NotFound} withSidebar={false} />} />
		{/* 404 routes */}
		
	  </Routes>
	);
  };
  
export default AuthenticatedRoutes;
