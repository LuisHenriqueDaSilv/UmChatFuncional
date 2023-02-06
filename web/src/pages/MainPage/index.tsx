import ChatsLists from '../../components/ChatsLists'
import Chat from '../../components/Chat'

import styles from './styles.module.scss'

export default function HomePage(){


    return (
        <div className={styles.container}>
            <ChatsLists/>
            <Chat/>
        </div>
    )    
}