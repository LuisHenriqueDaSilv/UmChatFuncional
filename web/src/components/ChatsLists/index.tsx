import { useContext } from 'react'

import { AuthContext } from '../../contexts/Auth'
import { ChatsContext } from '../../contexts/Chats'

import Search from '../Search'

import styles from './styles.module.scss'

export default function ChatsLists() {
    
    const { chats, selectChat, selectedChat } = useContext(ChatsContext)
    const { deauthenticate, user } = useContext(AuthContext)


    return (
        <div className={styles.container}>

            <div className={styles.userContainer}>
                <img src={user.imageUrl} />
                <div>
                    <h1>{user.username}</h1>
                    <button onClick={deauthenticate}>logout</button>
                </div>
            </div>

            <Search/>

            <div className={styles.chatsContainer}>

                {
                    chats.map((chat, index) => {

                        return(
                            <button 
                                onClick={() => {selectChat(chat.id)}}
                                className={styles.chat}
                                key={index}
                                id={chat.id === selectedChat?.id?styles.selectedChat:undefined}
                            >

                                <img src={chat.user.imageUrl} />

                                <div className={styles.chatInfos}>
                                    <h1>{chat.user.username}</h1>

                                    {
                                        chat.user.online&&<p> <div />online</p>
                                    }
                                </div>
                                {
                                    chat.unreadedMessage > 0&& 
                                    (
                                        <div className={styles.messagesIndicator}>
                                            {chat.unreadedMessage}
                                        </div>
                                    )
                                }

                            </button>
                        )
                    })
                }
            </div>
        </div>
    )

}