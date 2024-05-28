// Packages

// Components
import { CollectActivations } from "./CollectActivations/CollectActivations";
import { CollectingActivationsScreen } from "./CollectingActivationsScreen/CollectingActivationsScreen";
import { Labels } from "./Labels/Labels";
import { Prompts } from "./Prompts/Prompts";

// Logic

// Context

// Services

// Styles
import "./Data.css";

// Assets

export const Data = () => {
	return (
		<div className='analyse-page-subpage analyse-page-data'>
			<CollectActivations />
			<div className='analyse-page-data-section'>
				<CollectingActivationsScreen />
				<Labels />
				<Prompts />
			</div>
		</div>
	);
};
