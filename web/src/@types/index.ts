import { AxiosResponse } from 'axios'
import { ReactNode } from 'react'

export interface User {
    username: string,
    imageUrl: string,
    id: string
}

export interface AuthenticationFormTextInputs {
    username: string,
    password: string
}
export interface ErrorResponse extends AxiosResponse {
    data: {
        status: 'error',
        message: 'string'
    }
}

export interface SucessAuthenticationResponse extends AxiosResponse {
    data: {
        status: 'ok',
        jwt: string,
        user: User
    }
}

export interface SuccesFetchUserDataResponse extends AxiosResponse {
    data: {
        status: 'ok',
        user: User
    }
}

export interface AuthenticateFunctionParams {
    username: string,
    password: string,
    image: File | undefined
}

export interface AuthContextProps {
    getJwtToken: () => string | null,
    user: User,
    areAuthenticated: boolean,
    authenticate: (
        data: AuthenticateFunctionParams
    ) => Promise<ErrorResponse | void>,
    deauthenticate: () => void
}

export interface Message {
    id: string,
    authorId: string,
    content: string,
    createdAt: string
}

export interface Chat {
    id: string,
    lastMessageTime: string,
    messages: Message[],
    unreadedMessage: number,
    user: {
        id: string,
        imageUrl: string,
        online: boolean,
        username: string
    }
}

export interface FetchChatsReponse {
    status: 'ok' | 'error',
    message?: string,
    chats: Chat[]
}

export interface ChatsContextProps {
    chats: Chat[],
    selectedChat?: Chat|null,
    selectChat: (chatId: string|null, createdChat: Chat|null) => void,
    sendMessage: (content: string, toId: string) => void,
}

export interface SocketEventData {
    eventName: string,
    data: Message| {
        userId: string
    }
}


export interface ContextProviderPropsParams {
    children: ReactNode
}