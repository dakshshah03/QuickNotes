import Image from "next/image";
import LoginForm from './auth/login/page';

export default function Home() {
    return (
        <div className="App 
              bg-gradient-to-t from-[#015a70] to-[#53003f]
              h-full
              w-full
              flex
              flex-col
              items-center
              justify-center
            ">
              <div className="max-w-[1000px]">
                <h1 className="text-[50px]">
                  QuickNotes: An AI-Powered Q&A Assistant
                </h1>

                <div className="w-full bg-[#00000050] h-[200px] rounded-2xl p-5">
                  <text>
                    An attempt at a RAG/LLM-powered assistant for reading papers. Currently a work-in-progress.
                    <br/>
                    Created by <a href="https://github.com/dakshshah03/" className="text-[#009ffc]"><u>Daksh Shah</u></a>
                  </text>
                </div>
              </div>
        </div>
    );
}
