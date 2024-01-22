import { configureStore } from "@reduxjs/toolkit"
import featureConfigurationSlice from "../features/features-configurations/features-slice"
import customerConfigs from "../features/customer-configs/customer-configs-slice"
import featureSetting from "../features/customer-configs/feature-settings-slice"
import versions from "../features/feature-versions/feature-version-slice"
import productInfo from "../features/products/product"
import templateState from "../features/use-case-templates/template-slice"
import templateConfigs from "../features/templates/template-slice"
import triggersConfig from '../features/triggers/triggers-slice'
import globalConfig from '../features/globalConfigs/global-slice'
import copyGlobalConfig from '../features/verification-configs/changes-slice'
import coreFeaturesSlice from "../features/core-feature-configs/core-features-slice"
import coreAudienceSlice from "../features/core-audience-configs/core-audience-slice"
import coreUserProfileSlice from "../features/core-user-profile-configs/core-user-profile-slice"
import coreOnboardingConfigs from "../features/core-onboarding-configs/core-onboarding-slice"
import coreUserFeatures from "../features/user-configs/user-configs-slice"

export const store = configureStore({
	reducer: {
		features: featureConfigurationSlice,
		customerConfigs,
		featureSetting,
		versions,
		productInfo,
		templateState,
		templateConfigs,
		triggersConfig,
		globalConfig,
		copyGlobalConfig,
		coreFeaturesSlice,
		coreOnboardingConfigs,
		coreUserFeatures,
		coreAudienceSlice,
		coreUserProfileSlice

	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>