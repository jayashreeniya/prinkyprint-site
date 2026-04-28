export default function JayashreeWebsite() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <div>
            <div className="font-semibold">Jayashree Venkataraman</div>
            <div className="text-sm text-stone-600">Execution Reliability Advisor</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <section className="mb-16">
          <h1 className="text-5xl font-semibold mb-6">
            Decision systems that hold under pressure.
          </h1>
          <p className="text-lg text-stone-700 max-w-2xl">
            I work with founders, enterprise leaders, and GCC teams to improve execution reliability by strengthening how decisions close, hold, and scale.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">
            <a href="#contact" className="bg-black text-white px-5 py-3 rounded-full">Work with me</a>
            <a href="#speaking" className="border px-5 py-3 rounded-full">Book as speaker</a>
            <a href="#coaching" className="border px-5 py-3 rounded-full">Explore coaching</a>
            <a href="https://www.linkedin.com/in/YOUR-LINKEDIN-URL/" className="border px-5 py-3 rounded-full">LinkedIn</a>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-white border rounded-2xl">
            <h3 className="font-semibold mb-2">Advisory</h3>
            <p className="text-sm text-stone-700">Helping organisations reduce escalation, improve ownership, and strengthen execution reliability.</p>
          </div>
          <div className="p-6 bg-white border rounded-2xl">
            <h3 className="font-semibold mb-2">Speaking</h3>
            <p className="text-sm text-stone-700">Keynotes and panels on decision durability, leadership under pressure, and execution systems.</p>
          </div>
          <div className="p-6 bg-white border rounded-2xl">
            <h3 className="font-semibold mb-2">Coaching</h3>
            <p className="text-sm text-stone-700">Executive coaching for decision confidence, leadership presence, and handling pressure.</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-4">Approach</h2>
          <p className="text-stone-700 max-w-3xl">
            Most organisations optimise how decisions are made. Very few ensure they hold. That gap is where execution slows.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="p-6 bg-white border rounded-2xl">
            <h3 className="font-semibold mb-2">LEADWELL Diagnostic</h3>
            <p className="text-sm text-stone-700">Maps where decisions are expected to close vs where they actually close and how informal systems form.</p>
          </div>
          <div className="p-6 bg-white border rounded-2xl">
            <h3 className="font-semibold mb-2">HOLD Capability System</h3>
            <p className="text-sm text-stone-700">Builds the capability for decisions to hold under pressure across teams and leadership layers.</p>
          </div>
        </section>

        <section id="speaking" className="mb-16">
          <h2 className="text-3xl font-semibold mb-4">Speaking Topics</h2>
          <ul className="space-y-2 text-stone-700">
            <li>Decision durability under pressure</li>
            <li>Execution reliability at scale</li>
            <li>Leadership in GCC and transformation environments</li>
          </ul>
        </section>

        <section id="coaching" className="mb-16">
          <h2 className="text-3xl font-semibold mb-4">Coaching</h2>
          <p className="text-stone-700 max-w-2xl">
            For leaders navigating uncertainty, decision pressure, and the complexity of ownership at scale.
          </p>
        </section>

        <section id="contact" className="bg-black text-white p-10 rounded-2xl">
          <h2 className="text-3xl font-semibold mb-4">Get in touch</h2>
          <div className="flex gap-4 flex-wrap">
            <a href="mailto:YOUR-EMAIL@DOMAIN.COM" className="bg-white text-black px-5 py-3 rounded-full">Email</a>
            <a href="https://www.linkedin.com/in/YOUR-LINKEDIN-URL/" className="border px-5 py-3 rounded-full">LinkedIn</a>
          </div>
        </section>
      </main>
    </div>
  );
}
