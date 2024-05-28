// Packages
import { useContext } from "react";

// Components

// Logic

// Context
import { AnalyseContext } from "../../../context/AnalyseContext";

// Services

// Styles

// Assets

export const SubpageButtonsLogic = () => {
	const { subpage_buttons, curr_analyse_subpage_id, setCurrAnalyseSubpageId } = useContext(AnalyseContext);

	const onClickSubpage = (subpage_id) => {
		setCurrAnalyseSubpageId(subpage_id);
	};

	return { subpage_buttons, curr_analyse_subpage_id, onClickSubpage };
};
