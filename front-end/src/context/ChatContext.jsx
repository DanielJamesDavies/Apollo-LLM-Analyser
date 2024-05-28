import { createContext, useContext, useEffect, useState, useRef } from "react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { APIContext } from "./APIContext";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
	const { APIRequest } = useContext(APIContext);
	const [chat_input_message, setChatInputMessage] = useState("");
	const [chat_conversation_id, setChatConversationId] = useState(false);
	const [chat_conversations, setChatConversations] = useState([]);
	const [chat_messages, setChatMessages] = useState([]);
	const [is_creating_new_conversation, setIsCreatingNewConversation] = useState(false);

	const roles = { user: { name: "User", icon: faUser }, model: { name: "Gemma" } };

	const has_got_conversations = useRef(false);
	useEffect(() => {
		const get_conversations = async () => {
			const new_conversations_res = await APIRequest("/conversations", "GET");
			if (new_conversations_res?.conversations) {
				has_got_conversations.current = true;
				setChatConversations(JSON.parse(new_conversations_res?.conversations));
			}
		};
		get_conversations();
		const interval = setInterval(async () => {
			if (has_got_conversations.current) {
				clearInterval(interval);
				return false;
			}
			const new_conversations_res = await APIRequest("/conversations", "GET");
			if (new_conversations_res?.conversations) {
				has_got_conversations.current = true;
				setChatConversations(JSON.parse(new_conversations_res?.conversations));
			}
		}, 1000 * 30);
		return () => {
			clearInterval(interval);
		};
	}, [APIRequest]);

	return (
		<ChatContext.Provider
			value={{
				chat_input_message,
				setChatInputMessage,
				chat_conversation_id,
				setChatConversationId,
				chat_conversations,
				setChatConversations,
				chat_messages,
				setChatMessages,
				is_creating_new_conversation,
				setIsCreatingNewConversation,
				roles,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export default ChatProvider;
