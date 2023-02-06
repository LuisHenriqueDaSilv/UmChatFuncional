import {AuthContextProvider} from './contexts/Auth'
import {ChatsContextProvider} from './contexts/Chats'

import MainPage from './pages/MainPage'


export default function App() {

	return (
		<AuthContextProvider>
			<ChatsContextProvider>
				<MainPage/>
			</ChatsContextProvider>
		</AuthContextProvider>
	)

}