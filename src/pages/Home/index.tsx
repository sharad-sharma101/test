import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { updateConfigs } from "../../features/customer-configs/customer-configs-slice";
import { getClientConfigs } from "../../services/settings";
import Logo from "../../assets/images/attryb-logo.svg";
import ChevronRightIcon from "../../assets/images/chevron-right.svg";
import "./index.sass";
import {
	addProtocolToDomain,
	getCookieByName,
	validateDomain,
	validateEmail,
} from "../../utils/helpers";
import Button from "../../components/Button";
import AppInput from "../../components/Input";
import {
	CLIENT_EMAIL_KEY,
	CLIENT_URL_BROWSER_STROAGE_KEY,
	PROFILE_STATUS,
	USER_BROWSER_STROAGE_KEY,
	PRODUCT_NAME
} from "../../utils/constants";
import { AuthContext } from "../../auth/AuthContext";
import {  getContainers, patchContainerEnabledState } from "../../services/containers";
import {errorService} from "../../libs"

const Home = () => {
	const [domainName, setDomainName] = useState<string>("https://");
	const [email, setEmail] = useState<string>("");
	const [errors, setErrors] = useState({ domainName: { message: "" }, email: { message: "" } });
	const [enabledContainer, setEnabledContainer] = useState<Container|null>(null)
	const [startbuttonLoading, setStartButtonLoading] = useState(false)

	const authContext: { user: any, profileStatus:ProfileStatus } = useContext(AuthContext);
	const user = authContext?.user || null;

	const dispatch = useAppDispatch();
	let navigate = useNavigate();


	useEffect(() => {
		if (authContext?.user) {
			const { email } = authContext.user.idToken.payload;
			setEmail(email);
		} else {
			const demoEmail = localStorage.getItem(CLIENT_EMAIL_KEY);
			if (demoEmail) {
				setEmail(demoEmail);
			}
		}

		setDomain();
	}, [authContext]);


	const setDomain = async () => {
		if (authContext?.user) {
			const userId = authContext.user?.idToken?.payload["cognito:username"]
			const containers = await getContainers(`userId=${userId}&isEnabled=${true}`);
			if(!containers.length) return;
			const container = containers[0];
			setEnabledContainer(container)

			if(container?.domainName)
				setDomainName(container.domainName);

			if(containers.length){
				const {
					accountId,
					containerName,
					domainName,
					email,
					isEnabled,
					userId,
					_id
					} = containers[0]
				
					// navigate(`/web-editor?url=${domainName}&accountId=${accountId}&containerId=${_id}`)
					return;
			}
		} else {
			setDomainFromClientStroage()
		}
	};

	const setDomainFromClientStroage = () =>{
		// domain from browser stroage
		const domain = localStorage.getItem(CLIENT_URL_BROWSER_STROAGE_KEY);
		if (domain) {
			setDomainName(domain);
		}
	}

	const handleSubmit = async (): Promise<void> => {
		try{
			if (domainName && !validateDomain(domainName)) {
				const newErrors = { ...errors };
				newErrors.domainName.message = "please enter the valid domain";
				setErrors(newErrors);
			} else {
				const newErrors = { ...errors };
				newErrors.domainName.message = "";
				setErrors(newErrors);
			}
	
			if (email && !validateEmail(email)) {
				const newErrors = { ...errors };
				newErrors.email.message = "please enter valid email";
				setErrors(newErrors);
				// return;
			} else {
				const newErrors = { ...errors };
				newErrors.email.message = "";
				setErrors(newErrors);
			}
	
			if (domainName && email && validateDomain(domainName) && validateEmail(email)) {
				setStartButtonLoading(true)
				const { containerId, accountId } = await getClientConfigs(domainName, email, user);
				dispatch(updateConfigs({ domainName: domainName, accountId, containerId, email }));
				const domain = localStorage.getItem(CLIENT_URL_BROWSER_STROAGE_KEY);
				const clientEmail = localStorage.getItem(CLIENT_EMAIL_KEY);
				if (domain && domainName !== domain) {
					localStorage.removeItem(CLIENT_URL_BROWSER_STROAGE_KEY);
				}
				if (!user && clientEmail && clientEmail !== email) {
					localStorage.removeItem(CLIENT_EMAIL_KEY);
				}
				localStorage.setItem(CLIENT_URL_BROWSER_STROAGE_KEY, domainName);
				if (!user) localStorage.setItem(CLIENT_EMAIL_KEY, email);
	
				if(enabledContainer && enabledContainer._id && enabledContainer._id !== containerId){
				//	await patchContainerEnabledState(enabledContainer._id, false)
				}
				//await patchContainerEnabledState(containerId, true)
				setStartButtonLoading(false)
				navigate(
					`/web-editor?url=${domainName}&accountId=${accountId}&containerId=${containerId}`
				);
			}
		}
		catch(error){
			setStartButtonLoading(false)
			errorService.reportError(error)
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSubmit();
		}
	};	

	return (
		<>
		 <div className="search-view">
		<div className="search-view-container">
			<div>
				<h1 className="text-left">Let’s personalize your website</h1>
			</div>
			<div className="input-group">
				<div className="container-form">
					<AppInput
						value={domainName}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setDomainName(e.target.value)
						}
						onKeyDown={handleKeyDown}
						placeholder={"Enter your URL"}
						error={errors.domainName}
					/>
					{!authContext?.user ? (
						<AppInput
							value={email}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setEmail(e.target.value)
							}
							placeholder={"Enter your work email"}
							onKeyDown={handleKeyDown}
							error={errors.email}
						/>
					) : null}
				</div>
				<Button
					label="Start Personalizing"
					onClick={handleSubmit}
					className="home-screen-btn"
					suffix={ChevronRightIcon}
					disabled={!(domainName !== "https://" && email && domainName)}
					type="primary-button"
					loading={startbuttonLoading}
				/>
			</div>
		</div>
		</div>
		</>
	);
};

export default Home;
