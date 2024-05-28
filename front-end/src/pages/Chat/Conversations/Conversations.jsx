// Packages
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

// Components

// Logic
import { ConversationsLogic } from "./ConversationsLogic";

// Context

// Services

// Styles
import "./Conversations.css";

// Assets

export const Conversations = () => {
	const { chat_conversations, chat_conversation_id, is_creating_new_conversation, startNewConversation, clickConversation, deleteConversation } =
		ConversationsLogic();

	return (
		<div className='chat-conversations'>
			<button className='chat-conversations-new-btn' onClick={startNewConversation}>
				<div className='chat-conversations-new-btn-content'>
					<FontAwesomeIcon icon={faPlus} />
					<span>Start New Conversation</span>
				</div>
			</button>
			<div className='chat-conversations-list-container'>
				<div className='chat-conversations-list'>
					{!is_creating_new_conversation ? null : (
						<div
							tabIndex={0}
							className='chat-conversations-list-item chat-conversations-list-item-active chat-conversations-list-item-generating'
						>
							<div className='chat-conversations-list-item-title'>Generating...</div>
						</div>
					)}
					{chat_conversations
						?.sort((a, b) => b?.updated_time - a?.updated_time)
						?.map((conversation, index) => (
							<div
								key={index}
								tabIndex={0}
								className={
									"chat-conversations-list-item" +
									(chat_conversation_id === conversation?.id ? " chat-conversations-list-item-active" : "")
								}
								onClick={() => clickConversation(conversation?.id)}
							>
								<div className='chat-conversations-list-item-title'>{conversation?.title?.replaceAll("\n", " ")}</div>
								<div className='chat-conversations-list-item-manage'>
									<button
										className='chat-conversations-list-item-manage-btn'
										onClick={(e) => deleteConversation(e, conversation?.id)}
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};
