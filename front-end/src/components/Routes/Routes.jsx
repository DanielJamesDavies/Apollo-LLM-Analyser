import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";

import { Page } from "../Page/Page";
import { Chat } from "../../pages/Chat/Chat";
import { Analyse } from "../../pages/Analyse/Analyse";

export const Routes = () => {
	return (
		<BrowserRouter>
			<RouterRoutes>
				<Route path='' element={<Page element={<Chat />} />} />
				<Route path='/' element={<Page element={<Chat />} />} />
				<Route path='/chat' element={<Page element={<Chat />} />} />
				<Route path='/analyse' element={<Page element={<Analyse />} />} />
			</RouterRoutes>
		</BrowserRouter>
	);
};
