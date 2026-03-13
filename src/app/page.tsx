export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white">
      
      <h1 className="text-5xl font-bold mb-6">
        FormFlow AI
      </h1>

      <p className="text-xl mb-8 text-center max-w-xl">
        Create beautiful forms and surveys in minutes and get AI-powered insights from your responses.
      </p>

      <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:scale-105 transition">
        Create Your Form
      </button>

    </main>
  );
}
