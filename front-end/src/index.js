import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import APIProvider from "./context/APIContext";
import ChatProvider from "./context/ChatContext";
import AnalyseProvider from "./context/AnalyseContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<APIProvider>
			<ChatProvider>
				<AnalyseProvider>
					<App />
				</AnalyseProvider>
			</ChatProvider>
		</APIProvider>
	</React.StrictMode>
);
