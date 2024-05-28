// Packages
import { useContext, useLayoutEffect, useRef, useState, useEffect, useCallback } from "react";
import showdown from "showdown";

// Components

// Logic

// Context
import { APIContext } from "../../../context/APIContext";
import { ChatContext } from "../../../context/ChatContext";

// Services

// Styles

// Assets

export const ConversationLogic = () => {
	const { APIRequest } = useContext(APIContext);
	const {
		chat_conversation_id,
		setChatConversationId,
		setChatConversations,
		chat_input_message,
		setChatInputMessage,
		chat_messages,
		setChatMessages,
		setIsCreatingNewConversation,
		roles,
	} = useContext(ChatContext);

	const chatConversationMessagesContainerRef = useRef();

	const md_html_converter = new showdown.Converter();
	md_html_converter.setOption("tables", true);

	const [is_generating, setIsGenerating] = useState(false);
	const [activations_data, setActivationsData] = useState([]);
	const [activations_data_progress, setActivationsDataProgress] = useState(-1);
	const [message_focusing_index, setMessageFocusingIndex] = useState(-1);
	const [model_message_focusing_index, setModelMessageFocusingIndex] = useState(-1);
	const [message_focusing_token_index, setMessageFocusingTokenIndex] = useState(-1);

	const convertActivationsMatrixToMultiDimensionMatrix = useCallback((matrix) => {
		const multi_dimension_matrix = [];

		matrix.map((row) => {
			const [v1, v2, v3, ...values] = row;
			if (!multi_dimension_matrix[v1]) multi_dimension_matrix[v1] = [];
			if (!multi_dimension_matrix[v1][v2]) multi_dimension_matrix[v1][v2] = [];
			if (!multi_dimension_matrix[v1][v2][v3]) multi_dimension_matrix[v1][v2][v3] = [];
			multi_dimension_matrix[v1][v2][v3] = values;
			return true;
		});

		return multi_dimension_matrix;
	}, []);

	const getActivationsData = useCallback(async () => {
		setActivationsData([]);
		if (!chat_conversation_id) return false;

		const conversation_activations_res = await APIRequest(
			"/chat-activations?conversation_id=" + encodeURI(chat_conversation_id),
			"GET",
			false,
			setActivationsDataProgress
		);

		if (conversation_activations_res) {
			setActivationsData(convertActivationsMatrixToMultiDimensionMatrix(conversation_activations_res));
			setTimeout(() => setActivationsDataProgress(-1), 2000);
		}
	}, [setActivationsData, setActivationsDataProgress, convertActivationsMatrixToMultiDimensionMatrix, APIRequest, chat_conversation_id]);

	useEffect(() => {
		getActivationsData();
	}, [getActivationsData, chat_conversation_id]);

	useLayoutEffect(() => {
		setActivationsData([]);
		chatConversationMessagesContainerRef.current.scrollTop = 0;
		setTimeout(() => {
			chatConversationMessagesContainerRef.current.scrollTop =
				chatConversationMessagesContainerRef?.current?.scrollHeight - chatConversationMessagesContainerRef?.current?.clientHeight;
		}, 8);
	}, [chat_conversation_id, chatConversationMessagesContainerRef, setActivationsData]);

	const changeChatInputMessage = (e) => {
		setChatInputMessage(e?.target?.value);
	};

	const submitChatInputMessage = async () => {
		if (is_generating) return false;

		const new_chat_conversation_id = JSON.parse(JSON.stringify(chat_conversation_id));
		const new_chat_message = JSON.parse(JSON.stringify(chat_input_message));
		if (new_chat_message.trim().length === 0) return false;

		if (!new_chat_conversation_id) setIsCreatingNewConversation(true);

		const is_at_bottom_of_scroll_before =
			chatConversationMessagesContainerRef?.current?.scrollHeight - chatConversationMessagesContainerRef?.current?.clientHeight <=
				chatConversationMessagesContainerRef?.current?.scrollTop ||
			chatConversationMessagesContainerRef?.current?.scrollHeight === chatConversationMessagesContainerRef?.current?.clientHeight;

		setIsGenerating(true);

		let newChatMessages = JSON.parse(JSON.stringify(chat_messages));
		newChatMessages = newChatMessages.concat({ sender: "user", text: new_chat_message });
		setChatMessages(newChatMessages);

		setChatInputMessage("");

		if (is_at_bottom_of_scroll_before) {
			setTimeout(() => {
				chatConversationMessagesContainerRef.current.scrollTop =
					chatConversationMessagesContainerRef?.current?.scrollHeight - chatConversationMessagesContainerRef?.current?.clientHeight;
			}, 10);
		}

		let response = {};
		await APIRequest("/chat", "POST", { prompt: new_chat_message, conversation_id: new_chat_conversation_id }, (res) => {
			if (Array.isArray(res)) {
				if (newChatMessages[newChatMessages.length - 1]?.sender !== "model") {
					newChatMessages = newChatMessages.concat({ sender: "model", text: "{}" });
					setChatMessages(newChatMessages);
				} else {
					setTimeout(
						() => {
							newChatMessages[newChatMessages.length - 1] = { sender: "model", text: res[0] };
							setChatMessages(JSON.parse(JSON.stringify(newChatMessages)));
						},
						!new_chat_conversation_id ? 1000 * 15 : 1000 * 5
					);
				}
			} else {
				response = res;
			}
		});
		getActivationsData();

		setIsGenerating(false);

		if (response.message !== "Success") {
			alert(response?.message);
			console.log("Error:", response);
			return false;
		}

		setIsCreatingNewConversation(false);

		if (response?.conversation_id) {
			setChatConversationId(response?.conversation_id);
			setChatConversations((oldChatConversations) => {
				let newChatConversations = JSON.parse(JSON.stringify(oldChatConversations));
				const conversation_index = newChatConversations.findIndex((e) => e?.id === response?.conversation_id);
				if (conversation_index === -1) {
					newChatConversations = newChatConversations.concat({
						id: response?.conversation_id,
						title: response?.conversation_title,
						updated_time: response?.updated_time,
					});
				} else {
					newChatConversations[conversation_index].updated_time = response?.updated_time;
				}
				return newChatConversations;
			});
		}

		const is_at_bottom_of_scroll_after =
			chatConversationMessagesContainerRef?.current?.scrollHeight - chatConversationMessagesContainerRef?.current?.clientHeight <=
				chatConversationMessagesContainerRef?.current?.scrollTop ||
			chatConversationMessagesContainerRef?.current?.scrollHeight === chatConversationMessagesContainerRef?.current?.clientHeight;

		if (response?.response) {
			newChatMessages[newChatMessages.length - 1] = { sender: "model", text: response?.response };
			setChatMessages(JSON.parse(JSON.stringify(newChatMessages)));
		}

		if (is_at_bottom_of_scroll_after) {
			setTimeout(() => {
				chatConversationMessagesContainerRef.current.scrollTop =
					chatConversationMessagesContainerRef?.current?.scrollHeight - chatConversationMessagesContainerRef?.current?.clientHeight;
			}, 10);
		}
	};

	const [mouse_position, setMousePosition] = useState({ x: 0, y: 0 });
	useEffect(() => {
		const updateMousePosition = (event) => setMousePosition({ x: event?.clientX, y: event?.clientY });
		window.addEventListener("mousemove", updateMousePosition);
		return () => window.removeEventListener("mousemove", updateMousePosition);
	}, []);

	const handleTokenMouseEnter = (message_index, token_index) => {
		const new_model_message_index = message_index - chat_messages.slice(0, message_index).filter((e) => e?.sender === "user").length;
		setMessageFocusingIndex(message_index);
		setModelMessageFocusingIndex(new_model_message_index);
		setMessageFocusingTokenIndex(token_index);
	};

	const handleTokenMouseLeave = () => {
		setMessageFocusingIndex(-1);
		setMessageFocusingTokenIndex(-1);
	};

	return {
		chatConversationMessagesContainerRef,
		md_html_converter,
		chat_messages,
		chat_input_message,
		changeChatInputMessage,
		submitChatInputMessage,
		roles,
		is_generating,
		activations_data,
		activations_data_progress,
		message_focusing_index,
		model_message_focusing_index,
		message_focusing_token_index,
		mouse_position,
		handleTokenMouseEnter,
		handleTokenMouseLeave,
	};
};
