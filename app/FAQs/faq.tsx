import { PlusIcon } from "@radix-ui/react-icons";

type FaqProps = {
  id: number;
  question: string;
  answer: string;
  active: boolean;
  onClick: (id: number) => void;
};

const SingleFaq = (props: FaqProps) => {
  return (
    <div
      className="flex items-start flex-col py-4 w-full cursor-pointer gap-2 border-b-2 transition-all duration-300 ease-in-out"
      id={props.id.toString()}
      onClick={() => {
        props.onClick(props.id);
      }}
    >
      <div className="flex items-start gap-6 justify-between w-full">
        <h1 className="text-sm md:text-lg md:font-semibold font-semibold capitalize">
          {props.question}
        </h1>
        <PlusIcon
          className={`w-6 h-6 text-white transform transition-transform duration-300 ${
            props.active ? "rotate-45" : "rotate-0"
          }`}
        />
      </div>
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          props.active ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="mt-2 md:text-[15px] text-[13px] leading-normal font-light w-[95%] md:w-[100%] opacity-80">
          {props.answer}
        </p>
      </div>
    </div>
  );
};

export default SingleFaq;
