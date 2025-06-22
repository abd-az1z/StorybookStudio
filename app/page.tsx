import Image from "next/image";
import logo from "@/images/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StoryWriter from "@/components/StoryWriter";

export default function Home() {
  return (
    <main className="flex flex-col flex-1  ">
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 ">
        <div className="flex flex-col bg-[#05052C] space-y-5 justify-center items-center order-1 lg:-order-1 p-10 ">
          <Image className="h-[250px] w-[250px] " alt="logo" src={logo} />
          <Button
            asChild
            className="bg-[#FF8600] p-6 text-white hover:bg-[#e67600] "
          >
            <Link href="/stories">Explore more stories 🧭</Link>
          </Button>
        </div>
        {/* story writer */}
        <StoryWriter />
      </section>
    </main>
  );
}
