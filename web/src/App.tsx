import { CookiesProvider } from 'react-cookie'

import { AuthContextProvider } from './contexts/Auth'
import { ChatsContextProvider } from './contexts/Chats'


import MainPage from './pages/MainPage'


export default function App() {

	return (
		<CookiesProvider>
			<AuthContextProvider>
				<ChatsContextProvider>
					<MainPage />
				</ChatsContextProvider>
			</AuthContextProvider>
		</CookiesProvider>
	)

}