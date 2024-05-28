// Packages
import { useContext, useEffect, useState } from "react";

// Components

// Logic

// Context
import { AnalyseContext } from "../../../../../context/AnalyseContext";

// Services

// Styles

// Assets

export const CollectingActivationsScreenLogic = () => {
	const {
		isCollectingActivations,
		labels,
		selectedLabelsForCollection,
		selectedPromptsForCollection,
		collectionGenerationsCount,
		estimated_time_remaining,
		collection_time_completed,
		collectionFileSize,
	} = useContext(AnalyseContext);

	const [collecting_activations_text_dots_count, setCollectingActivationsTextDotsCount] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCollectingActivationsTextDotsCount((oldValue) => (oldValue >= 4 ? 0 : oldValue + 1));
		}, 500);
		return () => clearInterval(interval);
	}, [setCollectingActivationsTextDotsCount]);

	return {
		isCollectingActivations,
		labels,
		selectedLabelsForCollection,
		selectedPromptsForCollection,
		collecting_activations_text_dots_count,
		collectionGenerationsCount,
		estimated_time_remaining,
		collection_time_completed,
		collectionFileSize,
	};
};
