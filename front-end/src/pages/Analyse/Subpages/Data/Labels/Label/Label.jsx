// Packages
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronDown, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

// Components

// Logic
import { LabelLogic } from "./LabelLogic";

// Context

// Services

// Styles
import "./Label.css";

// Assets

export const Label = ({ label, index }) => {
	const {
		expanded,
		toggleExpanded,
		changeName,
		changeWordsToCollect,
		deleteLabel,
		isCollectActivationsMenuOpen,
		selectedLabelsForCollection,
		toggleSelectLabelForCollection,
	} = LabelLogic({ label, index });

	return (
		<div
			className={
				"analyse-page-data-labels-label-container" +
				(expanded ? " analyse-page-data-labels-label-container-expanded" : "") +
				(isCollectActivationsMenuOpen ? " analyse-page-data-labels-label-container-collect-activations-menu-open" : "") +
				(selectedLabelsForCollection?.findIndex((e) => e === label?.id) !== -1
					? " analyse-page-data-labels-label-container-selected-for-collection"
					: "")
			}
			onClick={toggleSelectLabelForCollection}
		>
			<div className='analyse-page-data-labels-label'>
				{isCollectActivationsMenuOpen ? (
					<div className='analyse-page-data-labels-label-toggle-select-for-collection-btn-container'>
						<button className='analyse-page-data-labels-label-toggle-select-for-collection-btn'>
							{selectedLabelsForCollection?.findIndex((e) => e === label?.id) === -1 ? (
								<FontAwesomeIcon icon={faPlus} />
							) : (
								<FontAwesomeIcon icon={faCheck} />
							)}
						</button>
					</div>
				) : (
					<div className='analyse-page-data-labels-label-expand-btn-container'>
						<button className='analyse-page-data-labels-label-expand-btn' onClick={toggleExpanded}>
							<FontAwesomeIcon icon={faChevronDown} />
						</button>
					</div>
				)}
				<div className='analyse-page-data-labels-label-name'>
					<input value={label?.name} onChange={changeName}></input>
				</div>
				<div className='analyse-page-data-labels-label-manage'>
					<button className='analysis-page-data-labels-label-delete-btn' onClick={deleteLabel}>
						<FontAwesomeIcon icon={faTrash} />
					</button>
				</div>
			</div>
			<div className='analyse-page-data-labels-label-subcontent-container'>
				<div className='analyse-page-data-labels-label-subcontent'>
					<div className='analyse-page-data-labels-label-subcontent-title'>Words to Collect (Comma Separated)</div>
					<div className='analyse-page-data-labels-label-subcontent-input-container'>
						<input value={label?.words_to_collect} onChange={changeWordsToCollect}></input>
					</div>
				</div>
			</div>
		</div>
	);
};
