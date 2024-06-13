// Packages
import { useContext } from "react";

// Components

// Logic

// Context
import { AnalyseContext } from "../../../../../context/AnalyseContext";

// Services

// Styles

// Assets

export const LabelsLogic = () => {
	const { labels, setLabels, hasSavedLabelsAndPrompts, isCollectActivationsMenuOpen, isCollectingActivations } = useContext(AnalyseContext);

	const addLabel = () => {
		const new_id = URL.createObjectURL(new Blob()).split("/").pop();
		setLabels((oldLabels) => oldLabels.concat([{ id: new_id, name: "New Label", words_to_collect: "New Label" }]));
	};

	return { labels, addLabel, hasSavedLabelsAndPrompts, isCollectActivationsMenuOpen, isCollectingActivations };
};
