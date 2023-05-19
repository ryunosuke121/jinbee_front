import axios from "axios";
import { ChatCompletionRequestMessage } from "openai";
import { useState } from "react";
import { Stream } from "stream";
import { transform } from "typescript";

const api = axios.create({
    baseURL: "https://jinbee-backend-aupxsmfz6q-uc.a.run.app",
})

//promptを送ると画像urlを返す
export const getImageUrl = async (prompt: string) => {
    const response = await api.get('/images', {
        params: {
            prompt,
        },
        timeout: 60000,
    });
    const imageUrl = `data:image/png;base64,${response.data.image}`
    return imageUrl;
}

//messagesをchatGPTの返答を返す
export const useChat = async (messages: ChatCompletionRequestMessage[]) => {
    const [responseText, setResponseText] = useState('');

    try {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:8070/message',
            data: messages,
            responseType: 'stream'
        })

        const streamReader = new Stream.Transform({
            transform(chunk, encoding, callback) {
                const decodedChunk = chunk.toString();
                this.push(decodedChunk);
                callback();
            }
        })

        response.data.pipe(streamReader);

        streamReader.on('data', (chunk) => {
            setResponseText((prev) => (prev + chunk.toString('utf-8')));
        })

        streamReader.on('end', () => {
            console.log('ストリームの終了');
        });
    } catch (error) {
        console.log(error);
    }
    return responseText;
}