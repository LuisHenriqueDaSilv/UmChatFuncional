import { useState, useContext, useEffect, FormEvent, useRef } from 'react'
import styles from './styles.module.scss'

import {ChatsContext} from '../../contexts/Chats'
import {AuthContext} from '../../contexts/Auth'

export default function Chats(){

    const endChatComponent = useRef(null) 

    const {
        selectedChat,
        sendMessage,
        selectChat
    } = useContext(ChatsContext)
    const {
        user
    } = useContext(AuthContext)

    const [messageContent, setMessageContent] = useState<string>('')

    function handleCloseChat(){
        selectChat(null, null)
    }

    function handleMessageSubmit(event:FormEvent){
        event.preventDefault();

        if(!messageContent){
            return
        }

        if(!selectedChat){
            return
        }

        sendMessage(messageContent, selectedChat?.user.id)
        setMessageContent('')

    }


    useEffect(() => {
        if(selectedChat){
            // @ts-ignore
            endChatComponent.current?.scrollIntoView({ behavior: "smooth" })
        }
    },  [selectedChat?.messages.length])


    if(!selectedChat){
        return
    }

    return (
        <div 
            className={styles.container}
        >
            <section className={styles.header}>
                <img src={selectedChat.user.imageUrl}/>
                
                <div className={styles.userInfos}>
                    <h1>
                        {selectedChat.user.username}
                    </h1>
                    {
                        selectedChat.user.online&& (
                            <p>
                                <div />
                                Online
                            </p>
                        )
                    }
                </div>

                <button
                    onClick={handleCloseChat} 
                    className={styles.closeChatButton}
                >
                    <img src="/close.jpg"/>
                </button>

            </section>


            <section className={styles.messagesContainer}>

                {
                    selectedChat.messages.map((message, index) => {
                        return (
                            <div 
                                key={message.id}
                                className={styles.message}
                                id={
                                    message.authorId==user.id?styles.myMessage:undefined
                                }
                                
                            >
                                <h1>
                                    {
                                        message.authorId==user.id? "Você":selectedChat.user.username.split(" ")[0]
                                    } - {message.createdAt}
                                </h1>
                                <p>
                                    {message.content}
                                </p>
                            </div>
                        )
                    })
                }

                <div ref={endChatComponent}/>

            </section>

            <form
                onSubmit={handleMessageSubmit} 
                className={styles.messageForm}
            >
                <input 
                    placeholder='Escreva sua mensagem' 
                    type="text"
                    onChange={(event) => {setMessageContent(event.target.value)}}
                    value={messageContent}
                />
                <button>
                    <img src="/send.png"/>
                </button>
            </form>
        </div>
    )
}