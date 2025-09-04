import { McqQuestion, McqUserResponse } from '@/types/mcq';
import { useEffect, useState } from 'react';

interface McqCardProps {
  selectedQuestion: McqQuestion;
  userResponseList: McqUserResponse[];
  handleSelection: (
    selected: string[],
    attended: McqUserResponse['attended'],
    isCorrect: boolean,
    submitted_answer: string
  ) => void;
  isMultiple?: boolean; // New prop to determine radio vs checkbox behavior
}

const McqCard = ({
  selectedQuestion,
  handleSelection,
  userResponseList,
  isMultiple = false, // Default to checkbox behavior
}: McqCardProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const correctAnswerArr = selectedQuestion.choices
    .filter(item => selectedQuestion.correct_answer == item.option)
    .map(item => item.text);

  const handleChange = (option: string) => {
    if (isMultiple) {
      setSelected(prev =>
        prev.includes(option)
          ? prev.filter(o => o !== option)
          : [...prev, option]
      );
    } else {
      setSelected([option]);
    }
  };

  useEffect(() => {
    if (selected.length > 0) {
      const isCorrect =
        selected.length === correctAnswerArr.length &&
        selected.every(ans => correctAnswerArr.includes(ans));
      const filterSelectedResponseOptions = selectedQuestion.choices.filter(
        item => {
          return selected.find(val => val == item.text);
        }
      );
      const selectedResponseOptions = filterSelectedResponseOptions
        .map(item => item.option)
        .join(',');
      handleSelection(selected, 'attended', isCorrect, selectedResponseOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    const alreadySelectedOptions: McqUserResponse[] = userResponseList.filter(
      item => item.question_id == selectedQuestion.question_id
    );
    const data =
      alreadySelectedOptions.length == 0
        ? []
        : alreadySelectedOptions[0].selectedResponse;
    setSelected(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestion]);

  return (
    <div className="w-full h-fit flex flex-col gap-2 justify-start items-start">
      <p className="w-full text-[20px] font-[200] mb-4">
        {selectedQuestion.question}
      </p>
      {selectedQuestion.choices.map(option => (
        <label
          key={option.text}
          className="w-full h-fit min-h-[50px] bg-[#F9FAFB] hover:bg-[#eff7ff] rounded-[5px] flex flex-row gap-3 items-center py-2 px-4 cursor-pointer transition-colors duration-200"
        >
          {/* Hidden input */}
          <input
            type={isMultiple ? 'checkbox' : 'radio'}
            name={
              isMultiple
                ? undefined
                : `question-${selectedQuestion.question_id}`
            }
            checked={selected.includes(option.text)}
            onChange={() => handleChange(option.text)}
            className="hidden peer"
          />
          {/* Custom visual indicator */}
          <span
            className={`
              w-5 h-5 transition-all duration-200 flex justify-center items-center
              ${!isMultiple ? 'rounded-full' : 'rounded-sm border-2'}
              ${
                selected.includes(option.text)
                  ? isMultiple
                    ? 'bg-[#41873F] border-[#41873F]'
                    : 'bg-[#41873F]' // Radio: full green fill, no border
                  : isMultiple
                    ? 'bg-white border-gray-400 hover:border-gray-500'
                    : 'bg-white border-2 border-gray-400 hover:border-gray-500' // Radio: keep border when unselected
              }
            `}
          >
            {selected.includes(option.text) && (
              <>
                {isMultiple ? (
                  // Checkmark for checkboxes
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : // No icon needed for radio - just green fill
                null}
              </>
            )}
          </span>
          <span className="flex-1 text-gray-800">{option.text}</span>
        </label>
      ))}
    </div>
  );
};

export default McqCard;
