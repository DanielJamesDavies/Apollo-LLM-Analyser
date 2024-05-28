import { NavigationBar } from "../NavigationBar/NavigationBar";

import "./Page.css";

export const Page = ({ element }) => {
	return (
		<div className='page'>
			<NavigationBar />
			<div className='page-content'>{element}</div>
		</div>
	);
};
