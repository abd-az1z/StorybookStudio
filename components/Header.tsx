import { BookOpen, FilePen } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="relative bg-[#05052C] border-b border-[#AEB8FE] text-[#F1F2F6] px-4 py-6  sm:p-6">
      <Link href="/" className="block text-center">
        <h1 className="text-4xl font-bold sm:text-5xl  lg:text-6xl">
          Storybook Studio
        </h1>
        <div className="mt-4 flex flex-col  sm:flex-row sm:items-center sm:justify-center sm:space-x-4 text-sm sm:text-2xl">
          <p>AI-crafted storybooks at your</p>
          <div className="relative mt-1 sm:mt-0 ">
            <div className="absolute w-fit bg-[#F1F2F6] text-[#27187E] right-50 left-30 top-2 -bottom-9   sm:-left-2 sm:-top-5 sm:-bottom-4 sm:-right-2  -rotate-3 px-2 py-1">
              <p className="relative">fingertips!</p>
            </div>
          </div>
        </div>
      </Link>

      {/* nav icons */}
      <nav className="sm:absolute items-center justify-between mt-4 bottom-4 right-4 flex sm:items-baseline  space-x-2 sm:top-6 sm:right-6">
        <Link href="/">
          <FilePen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 p-1 sm:p-2 rounded-md hover:opacity-50 border border-[#F1F2F6] cursor-pointer" />
        </Link>
        <Link href="/stories">
          <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 p-1 sm:p-2 rounded-md hover:opacity-50 border border-[#F1F2F6] cursor-pointer" />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
