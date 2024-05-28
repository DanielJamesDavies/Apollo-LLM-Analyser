// Packages
import { useContext, useState } from "react";

// Components

// Logic

// Context
import { AnalyseContext } from "../../../../../context/AnalyseContext";

// Services

// Styles

// Assets

export const CollectActivationsLogic = () => {
	const {
		isCollectActivationsMenuOpen,
		setIsCollectActivationsMenuOpen,
		isCollectingActivations,
		setIsCollectingActivations,
		isCollectingActivationsRef,
		completedCollectingActivations,
		setCompletedCollectingActivations,
		selectedLabelsForCollection,
		selectedPromptsForCollection,
		min_collecting_layer_bound,
		setMinCollectingLayerBound,
		max_collecting_layer_bound,
		setMaxCollectingLayerBound,
		isCollectingAllTokens,
		setIsCollectingAllTokens,
		collectingTokensCount,
		setCollectingTokensCount,
		runCollectActivations,
	} = useContext(AnalyseContext);
	const [hasJustChangedMenuOpenStatus, setHasJustChangedMenuOpenStatus] = useState(false);

	const toggleIsCollectActivationsMenuOpen = () => {
		setIsCollectActivationsMenuOpen((oldValue) => !oldValue);
		setHasJustChangedMenuOpenStatus(true);
		setTimeout(() => setHasJustChangedMenuOpenStatus(false), 200);
	};

	const toggleStartCollectingActivations = () => {
		if (selectedLabelsForCollection.length === 0 || selectedPromptsForCollection.length === 0) return false;
		setCompletedCollectingActivations(false);
		setIsCollectingActivations((oldValue) => {
			isCollectingActivationsRef.current = !oldValue;
			return !oldValue;
		});
		if (isCollectingActivationsRef.current) {
			runCollectActivations(true);
		}
	};

	const onLayersSliderChange = (value) => {
		setMinCollectingLayerBound(Math.min(...value));
		setMaxCollectingLayerBound(Math.max(...value));
	};

	const toggleIsCollectingAllTokens = () => {
		setIsCollectingAllTokens((oldValue) => !oldValue);
	};

	const decrementCollectingTokensCount = () => {
		setCollectingTokensCount((oldValue) => Math.max(1, oldValue - 1));
	};

	const incrementCollectingTokensCount = () => {
		setCollectingTokensCount((oldValue) => Math.min(20, oldValue + 1));
	};

	return {
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
	};
};
