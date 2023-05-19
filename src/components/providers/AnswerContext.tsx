import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from 'react';


interface AnswerContextType {
  isCompleted: boolean;
  setIsCompleted: (value: boolean) => void;
}

export const AnswerContext = createContext<{isCompleted: boolean, setIsCompleted: Dispatch<SetStateAction<boolean>>}>({isCompleted: false, setIsCompleted: () => {}});

export const useAnswerContext = () => {
  const context = useContext(AnswerContext);
  if (!context) {
    throw new Error('useAnswerContext must be used within an AnswerProvider');
  }
  return context;
};

export const AnswerProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [isCompleted, setIsCompleted] = useState(false);
  
    return (
      <AnswerContext.Provider value={{ isCompleted, setIsCompleted }}>
        {children}
      </AnswerContext.Provider>
    );
  };