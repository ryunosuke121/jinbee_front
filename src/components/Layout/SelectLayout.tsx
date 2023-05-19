import { ReactElement, useState, useEffect, SetStateAction, Dispatch } from "react";
import Head from "next/head";
import { useAnswerContext } from '@/components/providers/AnswerContext';
import { getImageUrl } from '@/lib/api'
type LayoutProps = {
  readonly children: ReactElement
  imageUrl: string,
  setImageUrl: Dispatch<SetStateAction<string>>
  selectedAnswers: Answer[]
  setSelectedAnswers: Dispatch<SetStateAction<Answer[]>>
}
interface Question {
  question: string;
  genre: string;
  options: string[];
}
interface Answer {
  genre: string;
  answer: string;
}
const questions: Question[] = [
  {
    question: 'Q1 見た目の性別は?',
    genre: '性別',
    options: ['男性', '女性'],
  },
  {
    question: 'Q2 どこの国風?',
    genre: '国',
    options: ['日本人', '北米', '南米', 'ヨーロッパ'],
  },
  {
    question: 'Q3 何歳くらい?',
    genre: '年齢',
    options: ['18', '22', '30', '40', '50', '60'],
  },
  {
    question: 'Q4 体型は?',
    genre: '体型',
    options: ['スリム', '標準', 'ぽっちゃり'],
  },
  {
    question: 'Q5 髪型は?',
    genre: '髪型',
    options: ['ベリーショート', 'ショート', 'ミディアム', 'ロング', 'ベリーロング'],
  },
  {
    question: 'Q6 髪色は?',
    genre: '髪色',
    options: ['黒髪', '茶髪', '金髪', '赤髪'],
  },
  {
    question: 'Q7 どんなタイプの子?',
    genre: 'タイプ',
    options: ['清楚系', '可愛い系', 'かっこいい系', '綺麗系', 'ストリート系'],
  },
  {
    question: 'Q8 大まかな性格は?',
    genre: '性格',
    options: ['外向的', '内向的', '積極的', '消極的',],
  },
  {
    question: 'Q9 性格は?',
    genre: 'タイプ',
    options: ['ツンデレ', 'デレデレ', 'ツンツン'],
  },
  {
    question: 'Q10 詳しい性格は?',
    genre: '詳細性格',
    options: ['積極的で楽観的', '社交的で話好き', '穏やかで静か'],
  },
  {
    question: 'この人と話す?',
    genre: '確認',
    options: ['他の人と話す', '話したい！'],
  },
  {
    question: 'プレイしたい場面を選択してね',
    genre: '場面',
    options: ['学校', '自宅', '遊園地'],
  },
  // 他の質問と回答のセットを追加
];
const Select = ({ children, imageUrl, setImageUrl, selectedAnswers, setSelectedAnswers }: LayoutProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [message, setMessage] = useState<number>(0);
  const [imagePrompt, setImagePrompt] = useState<string>("");
  const { isCompleted, setIsCompleted } = useAnswerContext();
  const handleOptionClick = (option: string) => {
    const genre = questions[currentQuestionIndex].genre;
    setSelectedAnswers([...selectedAnswers, { genre, answer: option }]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    if (currentQuestionIndex > 5) {
      setMessage(1);
    }
    if (currentQuestionIndex > 8) {
      setMessage(2);
    }
    if (currentQuestionIndex > 9) {
      setMessage(3);
    }
  };
  useEffect(() => {
    if (selectedAnswers.length === questions.length - 2 && message ===2) {
      const imageString = selectedAnswers
        .slice(0, 10)
        .map((item) => `${item.genre}は${item.answer}`)
        .join("、");
      setImagePrompt(imageString);
      console.log(imageString);
      getImageUrl(imageString).then((imageUrl) => {
        setImageUrl(imageUrl);
        console.log(imageUrl);
      });
    }
  }, [selectedAnswers]);
  useEffect(() => {
    if (selectedAnswers.length === questions.length) {
      setIsCompleted(true);
    }
  }, [selectedAnswers]);
  const currentQuestion = questions[currentQuestionIndex];
  return (
    <>
      <div className="bg-custom-pink text-custom-pink h-screen w-screen ">
        <div className="text-4xl text-center p-4">
          話したい人を作ってみよう！
        </div>
        <div className="text-xl text-center">
          {message === 0 ? "まずは見た目から！" : message === 1 || message === 2 ? "次は性格を決めよう！" : "シチュエーションを決めよう！"}
        </div>
        <div className="text-xl text-center">
          どれか一つを選択してね
        </div>
        <div className="text-xl p-6" >
          {currentQuestion.question}
        </div>
        {message === 0 || message === 1 ? (
          <>
            <ul className="grid grid-cols-2 gap-4 text-white text-center p-6">
              {currentQuestion.options.map((option, index) => (
                <li key={index}
                  onClick={() => handleOptionClick(option)}
                  className={"bg-custom-select-pink p-4 rounded-2xl hover:animate-bounce"}>
                  {option}
                </li>
              ))}
            </ul></>) : message === 2 ? (<>
              <div className="flex justify-center items-center">
                <img src={imageUrl} className="h-96" alt="" />
              </div>
              <div>
                <ul className="grid grid-cols-2 gap-4 text-white text-center p-6">
                  <li
                    onClick={() => window.location.reload()}
                    className={"bg-custom-select-pink p-4 rounded-2xl hover:animate-bounce"}
                  >
                    {currentQuestion.options[0]}
                  </li>
                  <li
                    onClick={() => handleOptionClick(currentQuestion.options[1])}
                    className={"bg-custom-select-pink p-4 rounded-2xl hover:animate-bounce"}
                  >
                    {currentQuestion.options[1]}
                  </li>
                </ul>
              </div>
            </>) : (
          <div>
            <ul className="grid grid-cols-2 gap-4 text-white text-center p-6">
              {currentQuestion.options.map((option, index) => (
                <li key={index}
                  onClick={() => handleOptionClick(option)}
                  className={"bg-custom-select-pink p-4 rounded-2xl hover:animate-bounce"}>
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
export default Select;
