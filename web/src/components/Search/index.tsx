import { useContext, useEffect, useState } from 'react'
import styles from './styles.module.scss'

import { Chat, Message, User } from '../../@types'

import backend from '../../services/axios'

import { AuthContext } from '../../contexts/Auth'
import { ChatsContext } from '../../contexts/Chats'

export default function Search() {

    const [searchTerm, setSearchTerm] = useState<string>('')
    const [searchResults, setSearchResults] = useState<User[]>()
    const [error, setError] = useState<string>('')
    const [loading, setLoading]= useState<boolean>(false)

    const {
        deauthenticate,
        getJwtToken,
        user
    } = useContext(AuthContext)
    const {
        chats, 
        selectChat,
    } = useContext(ChatsContext)

    function handleClickInUser(user: User){

        let clickedChat = chats.filter((chat) => {
            return chat.user.id == user.id
        })[0]

        if(!clickedChat){
            const date = new Date()
            clickedChat = {
                id: date.toISOString(),
                messages: [] as Message[],
                unreadedMessage: 0,
                user,
                lastMessageTime: date.toISOString()
            } as Chat
        }

        selectChat(null, clickedChat)
        setError('')
        setSearchResults([])
        setSearchTerm('')

    }

    useEffect(() => {

        if(searchTerm){
            setLoading(true)
        }

        const timeout = setTimeout(async () => {

            setError('')

            if (searchTerm) {


                const jwtToken = getJwtToken()
                try {
                    const response = await backend.get(`/search/users?s=${searchTerm}`, {
                        headers: {
                            authorization: `bearer ${jwtToken}`
                        }
                    })

                    if (response.data.status != "ok") {
                        if (response.data.message == "Token invalido") {
                            return deauthenticate()
                        }
                        return setError(response.data.message)
                    }

                    setSearchResults(response.data.usersData as User[])
                    setLoading(false)


                } catch (error) {
                    setError("Algo de inesperado ocorreu durante a busca!")
                    setLoading(false)
                }
            } else {
                setSearchResults(undefined)
            }
        }, 1000)

        return () => clearTimeout(timeout)
    }, [searchTerm])


    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                <input
                    onChange={(event) => { setSearchTerm(event.target.value) }}
                    placeholder='buscar chats'
                    value={searchTerm}
                />
            </div>

            {
                (searchResults || error|| loading) && (
                    <div className={styles.resultsContainer}>
                        {loading&& <h1>carregando...</h1>}
                        {error&& <h1 className={styles.errorMessage}>{error}</h1>}
                        
                        {
                            searchResults?.map((searchResult) => {

                                if(searchResult.id == user.id){return}
                                return (
                                    <button 
                                        key={searchResult.id}
                                        onClick={() => handleClickInUser(searchResult)}
                                    >
                                        <img src={searchResult.imageUrl} />
                                        <h1>{searchResult.username}</h1>
                                    </button>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}