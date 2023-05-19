type confession = {
  text: string
  clickChangeScreen?: () => void
}

export default function Confession(props: confession) {
  const { clickChangeScreen, text } = props
  return (
    //画面遷移の幕間
    <>
      <div
        className="bg-pink-300 h-screen flex items-center justify-center"
        onClick={clickChangeScreen}
      >
        <p className="text-pink-500 text-8xl font-bold animate-bounce">{text}</p>
      </div>
    </>
  )
}
