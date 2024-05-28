// Packages

// Components
import { ProgressBar } from "../../../../../components/ProgressBar/ProgressBar";

// Logic
import { CollectingActivationsScreenLogic } from "./CollectingActivationsScreenLogic";

// Context

// Services

// Styles
import "./CollectingActivationsScreen.css";

// Assets
import RadialActivationsPlotImage from "../../../../../content/radial_activations_plot.png";

export const CollectingActivationsScreen = () => {
	const {
		isCollectingActivations,
		labels,
		selectedLabelsForCollection,
		selectedPromptsForCollection,
		collecting_activations_text_dots_count,
		collectionGenerationsCount,
		estimated_time_remaining,
		collection_time_completed,
		collectionFileSize,
	} = CollectingActivationsScreenLogic();

	if (!isCollectingActivations) return null;
	return (
		<div className='analyse-page-data-collecting-activations-screen-container'>
			<div className='analyse-page-data-collecting-activations-screen'>
				<div className='analyse-page-data-collecting-activations-screen-info'>
					{Math.max(collectionGenerationsCount, selectedLabelsForCollection?.length * selectedPromptsForCollection?.length * 10) -
						collectionGenerationsCount >
					0 ? (
						<div className='analyse-page-data-collecting-activations-screen-title'>
							Collecting Activations
							{Array(Math.min(3, collecting_activations_text_dots_count))
								.fill(0)
								?.map((_, i) => (
									<span key={i}>.</span>
								))}
						</div>
					) : (
						<div className='analyse-page-data-collecting-activations-screen-title'>Collected Activations</div>
					)}
					<div className='analyse-page-data-collecting-activations-screen-info-text analyse-page-data-collecting-activations-screen-info-progress'>
						<b>Collection Progress: </b>
						<ProgressBar
							value={
								collectionGenerationsCount /
								Math.max(
									collectionGenerationsCount,
									selectedLabelsForCollection?.length * selectedPromptsForCollection?.length * 10
								)
							}
						/>
						<span>
							({" "}
							{collectionGenerationsCount
								.toString()
								.padStart(
									Math.max(
										collectionGenerationsCount,
										selectedLabelsForCollection?.length * selectedPromptsForCollection?.length * 10
									).toString().length,
									"0"
								)}{" "}
							/{" "}
							{Math.max(collectionGenerationsCount, selectedLabelsForCollection?.length * selectedPromptsForCollection?.length * 10)}{" "}
							)
						</span>
					</div>
					<div className='analyse-page-data-collecting-activations-screen-info-text'>
						<b>
							{Math.max(collectionGenerationsCount, selectedLabelsForCollection?.length * selectedPromptsForCollection?.length * 10) -
								collectionGenerationsCount >
							0
								? "Estimated Time Remaining: "
								: "Collection Duration: "}
						</b>
						<span>
							{Math.max(collectionGenerationsCount, selectedLabelsForCollection?.length * selectedPromptsForCollection?.length * 10) -
								collectionGenerationsCount >
							0
								? estimated_time_remaining
								: collection_time_completed}
						</span>
					</div>
					<div className='analyse-page-data-collecting-activations-screen-info-text'>
						<b>Collected Activations Size: </b>
						<span>{Math.floor(collectionFileSize * 100) / 100} MB</span>
					</div>
					<div className='analyse-page-data-collecting-activations-screen-info-text'>
						<b>Selected Labels: </b>
						<span>{selectedLabelsForCollection?.map((e) => labels?.find((e2) => e2?.id === e)?.name).join(", ")}</span>
					</div>
				</div>
				<div className='analyse-page-data-collecting-activations-screen-radial-activations-plot-container'>
					<div className='analyse-page-data-collecting-activations-screen-radial-activations-plot'>
						<img src={RadialActivationsPlotImage} alt='' draggable={false} />
					</div>
				</div>
			</div>
		</div>
	);
};
