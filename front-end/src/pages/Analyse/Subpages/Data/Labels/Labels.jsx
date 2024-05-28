// Packages
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";

// Components
import { Label } from "./Label/Label";

// Logic
import { LabelsLogic } from "./LabelsLogic";

// Context

// Services

// Styles
import "./Labels.css";

// Assets

export const Labels = () => {
	const { labels, addLabel, hasSavedLabelsAndPrompts, isCollectActivationsMenuOpen, isCollectingActivations } = LabelsLogic();

	return (
		<div className={"analyse-page-data-labels" + (isCollectingActivations ? " analyse-page-data-labels-is-collecting-activations" : "")}>
			<div className='analyse-page-data-labels-header'>
				<div className='analyse-page-data-labels-header-title'>Labels</div>
				{hasSavedLabelsAndPrompts ? null : (
					<div className='analyse-page-data-labels-header-saving'>
						<FontAwesomeIcon icon={faSave} />
						<span>Saving...</span>
					</div>
				)}
				<div className='analyse-page-data-labels-header-buttons'>
					{isCollectActivationsMenuOpen ? null : (
						<button className='analyse-page-data-labels-header-button' onClick={addLabel}>
							<FontAwesomeIcon icon={faPlus} />
						</button>
					)}
				</div>
			</div>
			<div className='analyse-page-data-labels-list'>
				{labels?.map((label, index) => (
					<Label key={index} label={label} index={index} />
				))}
			</div>
		</div>
	);
};
