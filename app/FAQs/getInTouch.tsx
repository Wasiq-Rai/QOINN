import { Button } from "./button";

const GetInTouch = () => {
	return (
		<div className="w-full bg-[#1f2937ff] rounded-md p-6 flex flex-col items-start mt-5 gap-4">
			<div className="flex flex-col">
				<h2 className="md:text-[18px] text-xl sm:text-3xl md:text-4xl font-semibold capitalize">
					Still have questions?
				</h2>
				<p className="md:text-[14px] text-[13px] md:text-md leading-normal font-light w-[95%] md:w-[100%] opacity-80">
					Feel free to contact us if you have any <br /> other questions.
				</p>
			</div>
			<div className="w-full bg-gray-700 h-[1px]" />
			<Button variant="link" className="px-0 text-white">
				Get in touch
			</Button>
		</div>
	);
};

export default GetInTouch;
