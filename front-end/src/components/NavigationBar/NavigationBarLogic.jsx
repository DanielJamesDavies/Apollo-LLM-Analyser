// Packages
import { useLocation, useNavigate } from "react-router-dom";

// Components

// Logic

// Context

// Services

// Styles

// Assets

export const NavigationBarLogic = () => {
	const location = useLocation();
	const navigate = useNavigate();

	function goToPage(url) {
		window.scrollTo(0, 0);
		navigate(url);
	}

	return { location, goToPage };
};
