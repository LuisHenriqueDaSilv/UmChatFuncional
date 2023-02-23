import { createContext, useEffect, useState } from 'react'
import {useCookies} from 'react-cookie'

import {
    AuthContextProps,
    ContextProviderPropsParams,
    User,
    AuthenticateFunctionParams,
    ErrorResponse,
    SucessAuthenticationResponse,
    SuccesFetchUserDataResponse
} from '../@types'

import backend from '../services/axios'

import { AutheticationPage } from '../pages/AuthenticationPage'

export const AuthContext = createContext({} as AuthContextProps)

export function AuthContextProvider({ children }: ContextProviderPropsParams) {

    const [userCookies, setUserCookies] = useCookies(['auth'])

    const [user, setUser] = useState<User>({username: '', imageUrl: '', id: ''})
    const [areAuthenticated, setAreAuthenticated] = useState<boolean>(false)

    useEffect(() => {

        const token = getJwtToken()
        if (token) {
            setAreAuthenticated(true)
            fetchUserData()
        }
    }, [])


    function getJwtToken() {

        return userCookies.auth
    }

    async function authenticate(data: AuthenticateFunctionParams) {
        const authenticationRequestBody = new FormData()
        authenticationRequestBody.append("username", data.username)
        authenticationRequestBody.append("password", data.password)
        if (data.image) {
            authenticationRequestBody.append("image", data.image)
        }

        try {
            const authenticationResponse = (await backend.post('/authenticate', authenticationRequestBody)) as ErrorResponse | SucessAuthenticationResponse
            if (authenticationResponse.data.status === "error") {
                return authenticationResponse
            }

            setUser(authenticationResponse.data.user)
            setUserCookies('auth', authenticationResponse.data.jwt, {path: '/'})
            setAreAuthenticated(true)
        } catch (error) {
            return ({
                data: {
                    status: 'error',
                    message: "Algo de inesperado ocorreu!"
                }
            }) as any
        }
    }

    async function fetchUserData() {
        const token = getJwtToken()

        const response = (await backend.get('/user', {
            headers: {
                authorization: `bearer ${token}`
            }
        })) as ErrorResponse | SuccesFetchUserDataResponse

        if (response.data.status === 'error') {
            return deauthenticate()
        }


        setUser(response.data.user)
    }

    function deauthenticate() {
        setUserCookies('auth', '', {path: '/'})
        setUser({username: '', imageUrl: '', id: ''})
        setAreAuthenticated(false);
    }

    return (
        <AuthContext.Provider
            value={{
                getJwtToken,
                user,
                areAuthenticated,
                authenticate,
                deauthenticate
            }}
        >
            {
                areAuthenticated ? children : <AutheticationPage />
            }
        </AuthContext.Provider>
    )
}