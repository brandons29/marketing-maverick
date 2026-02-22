import LegalPage from '@/components/LegalPage';

export default function Terms() {
  return (
    <LegalPage 
      title="Terms of Service" 
      lastUpdated="February 22, 2026"
      content={
        <>
          <section>
            <h2 className="text-white text-lg font-black uppercase italic tracking-tight">1. The Maverick Protocol</h2>
            <p>Marketing Maverick is a performance intelligence tool provided by Swayze Media ("Company"). By accessing this tool, you agree to be bound by these Terms of Service. If you do not agree, you are prohibited from using the tool.</p>
          </section>

          <section>
            <h2 className="text-white text-lg font-black uppercase italic tracking-tight">2. BYOK (Bring Your Own Key) Policy</h2>
            <p>Maverick operates on a "Bring Your Own Key" basis. You are solely responsible for the security of your OpenAI API keys. We encrypt your key at rest using row-level security, but we assume ZERO liability for any unauthorized access to your OpenAI account or any costs incurred on your API billing.</p>
          </section>

          <section>
            <h2 className="text-white text-lg font-black uppercase italic tracking-tight">3. Limitation of Liability</h2>
            <p>In no event shall Swayze Media or its partners be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Strategy Engine. We do not guarantee performance, ROAS, or conversion outcomes.</p>
          </section>

          <section>
            <h2 className="text-white text-lg font-black uppercase italic tracking-tight">4. Usage Data</h2>
            <p>We do not store your marketing inputs or AI outputs beyond your active session unless necessary for technical troubleshooting. Your data is yours. Your strategy is yours.</p>
          </section>
        </>
      }
    />
  );
}
