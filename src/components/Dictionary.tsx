import { useRef, useState, type FormEventHandler } from "react";
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";

interface Props {
  words: string[];
  onAddWord: (word: string) => void;
  onDeleteWord: (i: number) => void;
  onUpdateWord: (i: number, newWord: string) => void;
}

export function Dictionary({
  words,
  onAddWord,
  onDeleteWord,
  onUpdateWord,
}: Props) {
  const [focusedWordIndex, setFocusedWordIndex] = useState<number | null>(null);

  const newWordInput = useRef<HTMLInputElement>();
  const updateWordInput = useRef<HTMLInputElement>();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const word = newWordInput.current.value;
    if (!word) return;
    onAddWord(newWordInput.current.value);
    newWordInput.current.value = "";
  };

  const onClickUpdateEntry = (i: number) => {
    onUpdateWord(i, updateWordInput.current.value);
    setFocusedWordIndex(null);
  };

  return (
    <div className="bg-gray-100 border-2 border-gray-300 rounded-xl">
      <h3 className="text-2xl text-center">Dictionary</h3>
      <div className="flex flex-col p-1">
        {words?.map((entry, i) => (
          <div
            key={entry}
            className="flex justify-between items-center gap-1 bg-white border border-gray-200 rounded-md px-1 pl-3 [&>button]:invisible [&:hover>button]:visible cursor-pointer"
            onClick={() => setFocusedWordIndex(i)}
          >
            {focusedWordIndex === i ? (
              <>
                <input
                  className="focus:outline-none"
                  ref={updateWordInput}
                  defaultValue={entry}
                  autoFocus
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickUpdateEntry(i);
                  }}
                >
                  <FaCheck size={15} />
                </button>
              </>
            ) : (
              <>
                <div>{entry}</div>
                <button onClick={() => onDeleteWord(i)}>
                  <FaRegTrashAlt size={15} />
                </button>
              </>
            )}
          </div>
        ))}
        <form
          className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-1 pl-3"
          onSubmit={onSubmit}
        >
          <input ref={newWordInput} className="focus:outline-none" required />
          <button type="submit">
            <FaCirclePlus />
          </button>
        </form>
      </div>
    </div>
  );
}
