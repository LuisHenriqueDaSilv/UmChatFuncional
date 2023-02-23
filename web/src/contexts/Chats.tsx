import { createContext, useEffect, useState, useContext } from 'react'
import * as io from 'socket.io-client'


import {
    ContextProviderPropsParams,
    ChatsContextProps,
    Chat,
    FetchChatsReponse,
    Message,
    SocketEventData
} from '../@types'

import { AuthContext } from './Auth'

import backend from '../services/axios'

export const ChatsContext = createContext({} as ChatsContextProps)


export function ChatsContextProvider({ children }: ContextProviderPropsParams) {

    const { getJwtToken, deauthenticate, user } = useContext(AuthContext)

    const [socket, setSocket] = useState<io.Socket>();
    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChat, setSelectedChat] = useState<Chat|null>(null)
    const [socketEventData, setSocketEventData ] = useState<SocketEventData>()

    useEffect(() => {
        fetchChats()

        const jwtToken = getJwtToken()
    
        const newSocket = io.connect(
            `http://localhost:3000`,
            {
                auth: {
                    token: `bearer ${jwtToken}`
                },
            }
        );
    
        newSocket.on('unauthenticated', deauthenticate)
    
        newSocket.on("message", (data) => {setSocketEventData({
            eventName: "message",
            data
        })})
    
        newSocket.on("newConnection", (data) => {setSocketEventData({
            eventName: "newConnection",
            data
        })})
        newSocket.on("disconnection", (data) => {setSocketEventData({
            eventName: "disconnection",
            data
        })})
    
        setSocket(newSocket);
        return () => newSocket.close() as any
    }, [])

    useEffect(() => {

        if(!socketEventData){
            return
        }

        if(socketEventData.eventName === "message"){
            handleNewMessage(socketEventData.data as Message)
        } else if(socketEventData.eventName === "newConnection"){
            handleConnectionChange(socketEventData.data as {userId:string}, true)
        } else if(socketEventData.eventName === "disconnection"){
            handleConnectionChange(socketEventData.data as {userId:string}, false)
        } 

    }, [socketEventData])

    async function fetchChats() {

        const jwtToken = getJwtToken()

        try {
            const response = (await backend.get('/chats', {
                headers: {
                    authorization: `bearer ${jwtToken}`
                }
            })).data as FetchChatsReponse

            if(response.status === 'error'){
                if(response.message == "Token invalido"){
                    deauthenticate()
                } else {
                    alert("Algo de inesperado ocorreu!")
                }
            }

            response.chats.forEach((chat) => {
                if(chat.user.id == selectedChat?.user.id){
                    setSelectedChat(chat)
                }
            })
            setChatsSorted(response.chats)
        } catch(error){
            deauthenticate()
        }
    }

    function selectChat(chatId:string|null, createdChat: Chat|null){

        if(!chatId && !createdChat){
            setSelectedChat(null)
            return
        }

        if(createdChat){
            setSelectedChat(createdChat)
            return 
        }
        const chat = chats.filter((chat) => {
            return chat.id == chatId
        })[0]

        const newChatsData = [...chats]

        newChatsData[newChatsData.indexOf(chat)].unreadedMessage = 0

        if(!chat){
            return
        }
        setSelectedChat(chat)
        setChatsSorted(newChatsData)
    }

    async function handleConnectionChange(data: {userId:string}, status: boolean){

        const newChatsData:Chat[] =[]
        chats.forEach((chat) => {
            if(chat.user.id == data.userId){
                chat.user.online = status

                if(chat.id == selectedChat?.id){
                    setSelectedChat(chat)
                }
            }
            newChatsData.push(chat)
        })
        setChatsSorted(newChatsData)
    }

    function handleNewMessage(message: Message){

        let messageAddedToChat = false 
        const newChatsData = [] as Chat[]
        chats.forEach((chat) => {

            if(chat.user.id == message.authorId){
                chat.messages.push(message)
                chat.lastMessageTime = (new Date()).toISOString()

                if(chat.id == selectedChat?.id){
                    setSelectedChat(chat)
                } else {
                    chat.unreadedMessage = chat.unreadedMessage + 1  
                }
                messageAddedToChat = true
            }

            return newChatsData.push(chat)

        })

        if(!messageAddedToChat){
            return fetchChats()
        }
        
        setChatsSorted(newChatsData)
    }

    function sendMessage(content:string, toId: string){
        const jwtToken = getJwtToken()

        socket?.emit("message", {
            auth: {
                token: `bearer ${jwtToken}`
            },
            data: {
                content,
                toId
            }
        })
        
        const date = new Date()
        const message = {
            //@ts-ignore
            id: date.toISOString(),
            authorId: user.id,
            content,
            createdAt: `${date.getHours()}:${("0" + (date.getMinutes())).slice(-2)}`,
        }

        let messageAddedToChat = false 
        const newChatsData = [] as Chat[]
        chats.forEach((chat) => {

            if(chat.user.id == toId){
                chat.messages.push(message)
                chat.lastMessageTime = (new Date()).toISOString()

                if(chat.id == selectedChat?.id){
                    setSelectedChat(chat)
                } else {
                    chat.unreadedMessage = chat.unreadedMessage + 1  
                }
                messageAddedToChat = true
            }

            return newChatsData.push(chat)

        })

        if(!messageAddedToChat){
            return fetchChats()
        }
        
        setChatsSorted(newChatsData)

    }

    function setChatsSorted(newChatsData:Chat[]){
        function compareFunction(chat1:Chat, chat2:Chat){
            const lastMessageDate1 = (new Date(chat1.lastMessageTime)).getTime()
            const lastMessageDate2 = (new Date(chat2.lastMessageTime)).getTime()

            return (lastMessageDate2 - lastMessageDate1)
        }

        const chatsToSet = newChatsData.sort(compareFunction)

        setChats(chatsToSet)
    }

    return (
        <ChatsContext.Provider
            value={{
                chats,
                selectedChat,
                selectChat,
                sendMessage
            }}
        >
            {children}
        </ChatsContext.Provider>
    )
}