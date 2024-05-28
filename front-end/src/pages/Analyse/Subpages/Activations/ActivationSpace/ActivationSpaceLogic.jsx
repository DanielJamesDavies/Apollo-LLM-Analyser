// Packages
import { useContext, useState, useEffect, useLayoutEffect } from "react";

// Components

// Logic

// Context
import { AnalyseContext } from "../../../../../context/AnalyseContext";

// Services

// Styles

// Assets

export const ActivationSpaceLogic = () => {
	const { tsne_activations, collection_list, labels } = useContext(AnalyseContext);
	const [label_colours, setLabelColours] = useState([]);

	useEffect(() => {
		// setLabelColours(
		// 	Array.from(
		// 		{ length: Object.keys(tsne_activations).length },
		// 		() =>
		// 			"#" +
		// 			Math.floor(Math.random() * 16777215)
		// 				.toString(16)
		// 				.padStart(6, "0")
		// 	)
		// );
		setLabelColours(["#f08", "#44f", "#0a4", "#fa0", "#f40"]);
	}, [tsne_activations]);

	const [activation_space_style, setActivationSpaceStyle] = useState({});

	useLayoutEffect(() => {
		setTimeout(() => {
			setActivationSpaceStyle({ width: "fit-content" });
		}, 1);
	}, [setActivationSpaceStyle]);

	return { tsne_activations, collection_list, labels, label_colours, activation_space_style };
};
