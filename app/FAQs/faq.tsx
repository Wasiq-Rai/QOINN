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
			className="flex items-start flex-col py-4 w-full cursor-pointer gap-2 border-b-2"
			id={props.id.toString()}
			onClick={() => {
				props.onClick(props.id);
			}}
		>
			<div className="flex items-start gap-6 justify-between w-full">
				<h1 className="text-sm md:text-lg md:font-semibold font-semibold capitalize">
					{props.question}
				</h1>
				<PlusIcon className="w-6 h-6 text-white" />
			</div>
			{props.active && (
				<p className="mt-2 md:text-[15px] text-[13px] md:text-md leading-normal font-light w-[95%] md:w-[100%] opacity-80">
					{props.answer}
				</p>
			)}
		</div>
	);
};

export default SingleFaq;
