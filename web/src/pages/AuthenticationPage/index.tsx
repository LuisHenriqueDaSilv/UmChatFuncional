import React, { FormEvent, useState, useContext } from 'react'
import styles from './styles.module.scss'

import { AuthContext } from '../../contexts/Auth'

import { 
    AuthenticationFormTextInputs
} from '../../@types'


export function AutheticationPage() {

    const {authenticate} = useContext(AuthContext)

    const [errorMessage, setErrorMessage] = useState<string>()

    const [textInputsData, setTextInputsData] = useState<AuthenticationFormTextInputs>({ username: '', password: '' })
    const [selectedImage, setSelectedImage] = useState<File>()

    const [selectedImagePreview, setSelectedImagePreview] = useState<string>()

    function handleFormInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0])
            setSelectedImagePreview(URL.createObjectURL(event.target.files[0]));
            event.target.value = '';
        } else {
            if (["password", "username"].includes(event.target.name)) {
                setTextInputsData({
                    ...textInputsData,
                    [event.target.name]: event.target.value
                })
            }
        }
    }
    function handleRemoveImage() {
        setSelectedImage(undefined)
        setSelectedImagePreview(undefined)
    }

    async function handleFormSubmit(event: FormEvent) {
        event.preventDefault()

        const {
            password,
            username
        } = textInputsData

        const authenticationError = await authenticate({
            password, 
            username, 
            image:selectedImage
        })


        if(authenticationError?.data.status === "error"){
            setErrorMessage(authenticationError.data.message)
        }


    }

    return (
        <div className={styles.container}>
            <form
                onSubmit={handleFormSubmit}
            >
                <h1>Registre-se</h1>

                <input
                    type="text"
                    placeholder="nome de usuario"
                    maxLength={25}
                    name="username"
                    onChange={handleFormInputChange}
                />

                <input
                    type="password"
                    placeholder="senha"
                    maxLength={50}
                    name="password"
                    onChange={handleFormInputChange}
                />

                <label id={styles.imageContainer}>
                    <img
                        id={!selectedImagePreview ? styles.noImage : undefined}
                        src={selectedImagePreview}
                    />
                    <p>Clique aqui para adicionar uma imagem ao seu perfil</p>
                    <input
                        type="file"
                        onInput={handleFormInputChange}
                        accept=".png,.jpg,.jpeg,.pjpeg"
                    />
                </label>
                <button
                    style={!selectedImage ? { display: "none" } : {}}
                    onClick={handleRemoveImage}
                    className={styles.removeImageButton}
                >
                    remover imagem
                </button>

                <p className={styles.errorMessage}>{errorMessage}</p>
                <button className={styles.submitButton}>entrar</button>
            </form>
        </div>
    )
}