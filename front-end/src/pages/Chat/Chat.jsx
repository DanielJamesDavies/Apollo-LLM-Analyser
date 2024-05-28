// Packages

// Components
import { Conversations } from "./Conversations/Conversations";
import { Conversation } from "./Conversation/Conversation";

// Logic

// Context

// Services

// Styles
import "./Chat.css";

// Assets

export const Chat = () => {
	return (
		<div className='chat-page'>
			<Conversations />
			<Conversation />
		</div>
	);
};
