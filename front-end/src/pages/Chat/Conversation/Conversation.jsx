// Packages
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sanitize } from "dompurify";

// Components
import { TextArea } from "../../../components/TextArea/TextArea";
import { RadialActivationsChart } from "../../../components/RadialActivationsChart/RadialActivationsChart";
import { ProgressBar } from "../../../components/ProgressBar/ProgressBar";

// Logic
import { ConversationLogic } from "./ConversationLogic";

// Context

// Services

// Styles
import "./Conversation.css";

// Assets

export const Conversation = () => {
	const {
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
	} = ConversationLogic();

	return (
		<div className={"chat-conversation" + (activations_data?.length === 0 ? " chat-conversation-no-activations-data" : "")}>
			<div ref={chatConversationMessagesContainerRef} className='chat-conversation-messages-container'>
				{chat_messages?.length !== 0 ? null : (
					<div className='chat-conversation-messages-start'>
						<img src='/symbol.png' alt='' />
						<div>Chat with Gemma</div>
					</div>
				)}
				<div className='chat-conversation-messages'>
					{chat_messages?.map((chat_message, message_index) => {
						if (
							chat_message.sender === "model" &&
							(JSON.stringify(chat_message.text) === JSON.stringify("{}") ||
								JSON.stringify(chat_message.text) === JSON.stringify('{"text": []}')) &&
							!chat_message.content
						)
							return null;
						return (
							<div
								key={message_index}
								className={
									"chat-conversation-message" +
									(chat_message?.sender === "user" ? " chat-conversation-message-user" : " chat-conversation-message-ai")
								}
							>
								{chat_message?.sender === "user" ? (
									<div
										className='chat-conversation-message-content'
										dangerouslySetInnerHTML={{
											__html: sanitize(md_html_converter.makeHtml(chat_message?.text)),
										}}
									></div>
								) : (
									<>
										<div className='chat-conversation-message-content'>
											{JSON.parse(chat_message?.text)?.text && !JSON.parse(chat_message?.text)?.content
												? JSON.parse(chat_message?.text)?.text
												: JSON.parse(chat_message?.text)?.content?.map((token, index) =>
														token === "\n" ? (
															<div key={index} className='chat-conversation-message-content-line-break'></div>
														) : (
															<span
																key={index}
																onMouseEnter={() => handleTokenMouseEnter(message_index, index)}
																onMouseLeave={handleTokenMouseLeave}
															>
																{token}
															</span>
														)
												  )}
										</div>
									</>
								)}
								<div className='chat-conversation-message-role'>
									{roles[chat_message?.sender]?.icon ? (
										<FontAwesomeIcon icon={roles[chat_message?.sender]?.icon} />
									) : (
										<img src='/symbol.png' alt='' />
									)}
									<span>{roles[chat_message?.sender]?.name}</span>
									{chat_message?.sender === "model" &&
									chat_messages.length - 1 === message_index &&
									activations_data_progress !== -1 ? (
										<ProgressBar value={activations_data_progress} label='Activations' />
									) : null}
								</div>
							</div>
						);
					})}
					{!is_generating ||
					(chat_messages[chat_messages.length - 1].sender === "model" &&
						JSON.stringify(chat_messages[chat_messages.length - 1].text) !== JSON.stringify("{}") &&
						JSON.stringify(chat_messages[chat_messages.length - 1].text) !== JSON.stringify('{"text": []}') &&
						!chat_messages[chat_messages.length - 1].content) ? null : (
						<div className='chat-conversation-message chat-conversation-message-ai chat-conversation-message-generating'>
							<div className='chat-conversation-message-content'>
								<div className='chat-conversation-message-generating-dots'>
									<div className='chat-conversation-message-generating-dot'></div>
									<div className='chat-conversation-message-generating-dot'></div>
									<div className='chat-conversation-message-generating-dot'></div>
								</div>
							</div>
							<div className='chat-conversation-message-role'>
								{roles["model"]?.icon ? <FontAwesomeIcon icon={roles["model"]?.icon} /> : <img src='/symbol.png' alt='' />}
								<span>{roles["model"]?.name}</span>
							</div>
						</div>
					)}
				</div>
			</div>
			<TextArea
				className='chat-conversation-text-area'
				value={chat_input_message}
				onChange={changeChatInputMessage}
				placeholder='Chat with Gemma'
				onSubmit={submitChatInputMessage}
				disableSubmit={is_generating}
			/>
			<div
				className='chat-conversation-radial-activations-chart-container'
				style={{ "--mouseX": mouse_position?.x + "px", "--mouseY": mouse_position?.y + "px" }}
			>
				<div className='chat-conversation-radial-activations-chart'>
					{activations_data?.[model_message_focusing_index]?.[message_focusing_token_index] === undefined ? null : (
						<RadialActivationsChart
							data={activations_data[model_message_focusing_index][message_focusing_token_index].map((layer) =>
								layer.map((act) => Math.abs(act))
							)}
							tokens={[
								JSON.parse(chat_messages?.[message_focusing_index]?.text)?.content?.[message_focusing_token_index - 1],
								JSON.parse(chat_messages?.[message_focusing_index]?.text)?.content?.[message_focusing_token_index],
								JSON.parse(chat_messages?.[message_focusing_index]?.text)?.content?.[message_focusing_token_index + 1],
							]}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
