// Packages
import { useContext } from "react";

// Components

// Logic

// Context
import { ChatContext } from "../../../context/ChatContext";
import { APIContext } from "../../../context/APIContext";

// Services

// Styles

// Assets

export const ConversationsLogic = () => {
	const { chat_conversations, setChatConversations, chat_conversation_id, setChatConversationId, setChatMessages, is_creating_new_conversation } =
		useContext(ChatContext);
	const { APIRequest } = useContext(APIContext);

	const startNewConversation = () => {
		setChatConversationId(false);
		setChatMessages([]);
	};

	const clickConversation = async (id) => {
		const conversation_messages_res = await APIRequest("/chat-messages?conversation_id=" + encodeURI(id), "GET");
		if (conversation_messages_res?.messages) {
			setChatConversationId(id);
			setChatMessages([]);
			setTimeout(() => {
				setChatMessages(JSON.parse(conversation_messages_res?.messages));
			}, 7);
		}
	};

	const deleteConversation = async (e, id) => {
		e?.stopPropagation();
		if (chat_conversation_id === id) startNewConversation();
		const delete_conversation_res = await APIRequest("/conversation?conversation_id=" + encodeURI(id), "DELETE");
		if (delete_conversation_res?.message === "Success") {
			setChatConversations((oldChatConversations) => oldChatConversations?.filter((e) => e?.id !== id));
			if (chat_conversation_id === id) startNewConversation();
		}
	};

	return { chat_conversations, chat_conversation_id, is_creating_new_conversation, startNewConversation, clickConversation, deleteConversation };
};
