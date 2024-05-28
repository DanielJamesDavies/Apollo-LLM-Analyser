// Packages
import { useContext, useEffect, useState } from "react";

// Components
import { Data } from "./Subpages/Data/Data";
import { Activations } from "./Subpages/Activations/Activations";
import { AnalysisModels } from "./Subpages/AnalysisModels/AnalysisModels";

// Logic

// Context
import { AnalyseContext } from "../../context/AnalyseContext";

// Services

// Styles

// Assets

export const AnalyseLogic = () => {
	const { curr_analyse_subpage_id } = useContext(AnalyseContext);
	const [subpage, setSubpage] = useState(null);

	useEffect(() => {
		let new_subpage = null;

		switch (curr_analyse_subpage_id) {
			case "data":
				new_subpage = <Data />;
				break;
			case "activations":
				new_subpage = <Activations />;
				break;
			case "analysis_models":
				new_subpage = <AnalysisModels />;
				break;
			default:
				break;
		}

		setSubpage(new_subpage);
	}, [setSubpage, curr_analyse_subpage_id]);

	return { subpage };
};
