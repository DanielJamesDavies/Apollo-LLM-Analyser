// Packages

// Components
import { SubpageButtons } from "./SubpageButtons/SubpageButtons";

// Logic
import { AnalyseLogic } from "./AnalyseLogic";

// Context

// Services

// Styles
import "./Analyse.css";

// Assets

export const Analyse = () => {
	const { subpage } = AnalyseLogic();

	return (
		<div className='analyse-page'>
			<SubpageButtons />
			<div className='analysis-page-subpage-container'>{subpage}</div>
		</div>
	);
};
