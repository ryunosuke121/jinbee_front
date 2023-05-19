import { useChat } from "@/lib/api"
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai"
import { Dispatch, SetStateAction, useState } from "react"
import axios from "axios"
import { Stream } from "stream"
import { transform } from "typescript"

//talkScreenの型定義
type talkType = {
  text: string
  setText: Dispatch<SetStateAction<string>>
  name: string
  placeholder: string
  talkButton: string
  clickSetEnd?: () => void
  clickSetConfession?: () => void
  imageUrl: string
  setImageUrl: Dispatch<SetStateAction<string>>
  selectedAnswers: any
  setSelectedAnswers: Dispatch<SetStateAction<any>>
}

export default function TalkScreen(props: talkType) {
  const { clickSetEnd, text, clickSetConfession, name, placeholder, talkButton, setText, imageUrl, setImageUrl, selectedAnswers, setSelectedAnswers } = props
  const imageString = selectedAnswers
    .slice(0, 10)
    .map((item: any) => `${item.genre}は${item.answer}`)
    .join("、");
  console.log(imageString);
  //入力か応答かを判断するstate
  const [isInput, setIsInput] = useState(true)
  const [inputValue, setInputValue] = useState("")
  //入力に応じて値を変える関数
  const handleInputChabge = (e: any) => {
    setInputValue(e.target.value)
  }
  //gptに送るデータの管理
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([
    { role: "system", content: 'あなたは' + imageString + 'な人として振る舞ってください' },
  ])

  const addMessages = (message: ChatCompletionRequestMessage) => {
    setMessages((prev) => [...prev, message])
  }

  //入力応答を変更する関数
  const completeInput = async () => {
    await addMessages({ role: "user", content: inputValue })
    setIsInput(!isInput)

    const newMessage = [...messages, { role: "user", content: inputValue }]
    console.log(newMessage)
    const response = await fetch("https://jinbee-backend-aupxsmfz6q-uc.a.run.app/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage)
    });

    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let aiResponse: string = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      console.log(chunkValue);
      setText((prev) => (prev + chunkValue));
    }
  }

  const completeOutput = () => {
    console.log(messages);
    setText('');
    setIsInput(!isInput)
    setInputValue('');
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-end">
          <img src={imageUrl} alt="ジェシー" className="h-[400px]" />
          {/*告白モードにするか、ゲームを終了するかの判断の条件分岐*/}
          {clickSetConfession ? (
            <button className="mr-40 mb-5" onClick={clickSetEnd || clickSetConfession}>
              <img
                src="/958E0078-D2F6-48BF-8D37-9BCC4E3F39F7-fotor-bg-remover-20230422235953.png"
                alt=""
                className="h-48 animate-pulse"
              />
            </button>
          ) : (
            <button className="mr-40 mb-5" onClick={clickSetEnd}>
              <img
                src="/9CF9584A-4874-45AC-A594-74F64C2A10FF-fotor-bg-remover-20230423044.png"
                alt=""
                className="h-48 animate-pulse"
              />
            </button>
          )}
        </div>
        <div className="bg-black opacity-80">
          {/*入力画面か出力画面かの判断の条件分岐 */}
          {isInput ? (
            <>
              <p className="text-white text-2xl px-40 pt-4">あなた</p>
              <div className="flex items-center justify-center pb-36 mt-32">
                <input
                  className="outline-0 px-2 focus:caret-white h-10 w-1/3 bg-black text-white text-2xl"
                  placeholder={placeholder}
                  type="text"
                  onChange={handleInputChabge}
                />
                <button className="text-white border-2 py-2 px-1 ml-5" onClick={completeInput}>
                  {talkButton}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-white text-2xl px-40 pt-4">{name}</p>
              <div className="flex pb-36 pt-32 items-center justify-center">
                <p className="text-white text-3xl text-center">{text}</p>
                <div onClick={completeOutput} className="text-white text-2xl ml-10">
                  ▶︎
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
