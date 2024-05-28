// Packages
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronDown, faChevronUp, faPlay, faRightFromBracket, faStop } from "@fortawesome/free-solid-svg-icons";
import { MinMaxRangeSlider } from "../../../../../components/MinMaxRangeSlider/MinMaxRangeSlider";

// Components

// Logic
import { CollectActivationsLogic } from "./CollectActivationsLogic";

// Context

// Services

// Styles
import "./CollectActivations.css";
import { ToggleInput } from "../../../../../components/ToggleInput/ToggleInput";

// Assets

export const CollectActivations = () => {
	const {
		isCollectActivationsMenuOpen,
		toggleIsCollectActivationsMenuOpen,
		hasJustChangedMenuOpenStatus,
		isCollectingActivations,
		completedCollectingActivations,
		selectedLabelsForCollection,
		selectedPromptsForCollection,
		toggleStartCollectingActivations,
		min_collecting_layer_bound,
		max_collecting_layer_bound,
		onLayersSliderChange,
		isCollectingAllTokens,
		toggleIsCollectingAllTokens,
		collectingTokensCount,
		decrementCollectingTokensCount,
		incrementCollectingTokensCount,
	} = CollectActivationsLogic();

	return (
		<div
			className={
				"analyse-page-data-collect-activations-container" +
				(!isCollectActivationsMenuOpen ? " analyse-page-data-collect-activations-container-closed" : "") +
				(hasJustChangedMenuOpenStatus ? " analyse-page-data-collect-activations-container-just-changed-open-status" : "") +
				(isCollectingActivations ? " analyse-page-data-collect-activations-container-is-collecting-activations" : "")
			}
		>
			<button className='analyse-page-data-collect-activations-toggle-open-btn' onClick={toggleIsCollectActivationsMenuOpen}>
				{!isCollectActivationsMenuOpen ? (
					<div className='analyse-page-data-collect-activations-toggle-open-btn-content'>Collect Activations</div>
				) : (
					<div className='analyse-page-data-collect-activations-toggle-open-btn-content'>
						<FontAwesomeIcon icon={faArrowLeft} />
						<span>Back</span>
					</div>
				)}
			</button>
			<div className='analyse-page-data-collect-activations-options-container'>
				<button
					className={
						"analyse-page-data-collect-activations-toggle-start-btn" +
						(!isCollectingActivations && (selectedLabelsForCollection?.length === 0 || selectedPromptsForCollection?.length === 0)
							? " analyse-page-data-collect-activations-toggle-start-btn-inactive"
							: "")
					}
					onClick={toggleStartCollectingActivations}
				>
					{!isCollectingActivations ? (
						<div className='analyse-page-data-collect-activations-toggle-start-btn-content'>
							<FontAwesomeIcon icon={faPlay} />
							<span>Start Collecting Activations</span>
						</div>
					) : !completedCollectingActivations ? (
						<div className='analyse-page-data-collect-activations-toggle-start-btn-content'>
							<FontAwesomeIcon icon={faStop} />
							<span>Stop Collecting Activations</span>
						</div>
					) : (
						<div className='analyse-page-data-collect-activations-toggle-start-btn-content'>
							<FontAwesomeIcon icon={faRightFromBracket} />
							<span>Exit Collecting Activations</span>
						</div>
					)}
					<div className='analyse-page-data-collect-activations-toggle-start-btn-tooltip'>
						Please select at least one label and one prompt.
					</div>
				</button>
				<div className='analyse-page-data-collect-activations-options-divider'></div>
				<div className='analyse-page-data-collect-activations-options-layers-container'>
					<div className='analyse-page-data-collect-activations-options-layers-title'>Layers</div>
					<div className='analyse-page-data-collect-activations-options-layers-bound'>
						{min_collecting_layer_bound?.toString()?.length < 2 ? "0" + min_collecting_layer_bound : min_collecting_layer_bound}
					</div>
					<MinMaxRangeSlider
						className='analyse-page-data-collect-activations-options-layers-slider'
						min_value={min_collecting_layer_bound}
						max_value={max_collecting_layer_bound}
						min_end={1}
						max_end={28}
						onChange={onLayersSliderChange}
					/>
					<div className='analyse-page-data-collect-activations-options-layers-bound'>
						{max_collecting_layer_bound?.toString()?.length < 2 ? "0" + max_collecting_layer_bound : max_collecting_layer_bound}
					</div>
				</div>
				<div className='analyse-page-data-collect-activations-options-divider'></div>
				<div className='analyse-page-data-collect-activations-options-tokens-container'>
					<div className='analyse-page-data-collect-activations-options-tokens-title'>Tokens</div>
					<div className='analyse-page-data-collect-activations-options-tokens-collect-all-label'>Collect All Keyword Tokens</div>
					<ToggleInput value={isCollectingAllTokens} onToggle={toggleIsCollectingAllTokens} />
					{isCollectingAllTokens ? null : (
						<div className='analyse-page-data-collect-activations-options-tokens-collect-count-container'>
							<div className='analyse-page-data-collect-activations-options-tokens-collect-count-label'>
								No. of Tokens From Start of Keywords to Collect
							</div>
							<button
								className={
									"analyse-page-data-collect-activations-options-tokens-collect-count-btn" +
									(collectingTokensCount <= 1
										? " analyse-page-data-collect-activations-options-tokens-collect-count-btn-inactive"
										: "")
								}
								onClick={decrementCollectingTokensCount}
							>
								<FontAwesomeIcon icon={faChevronDown} />
							</button>
							<div className='analyse-page-data-collect-activations-options-tokens-collect-count-value'>{collectingTokensCount}</div>
							<button
								className={
									"analyse-page-data-collect-activations-options-tokens-collect-count-btn" +
									(collectingTokensCount >= 20
										? " analyse-page-data-collect-activations-options-tokens-collect-count-btn-inactive"
										: "")
								}
								onClick={incrementCollectingTokensCount}
							>
								<FontAwesomeIcon icon={faChevronUp} />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
