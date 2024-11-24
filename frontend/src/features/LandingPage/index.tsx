import TypewriterText from "@/components/TypeWriterText";
export default function Example() {
  return (
    <div className="bg-white overflow-clip h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Write and Run</span>
              <img
                src="/Logo/W&RLogo.png"
                alt=""
                className="h-12 w-auto"
              />
            </a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/home" className="text-sm/6 font-semibold text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>
      <main className="isolate">
        <div className="relative pt-1">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          ></div>
          <div className="py-24 sm:py-32 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <TypewriterText />
                <p className="mt-5 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                  Upload your handwritten code and run it in your browser with
                  ease
                </p>
                <div className="mt-8 flex justify-center">
                  <a
                    href="/home"
                    className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Start now
                  </a>
                </div>
              </div>
              <img
                src="/Images/ShowcaseImage.jpeg"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="rounded-md shadow-2xl ring-1 ring-gray-900/10 scale-110 translate-y-1/3"
              />
            </div>
          </div>
        </div>
      </main >
    </div >
  );
}