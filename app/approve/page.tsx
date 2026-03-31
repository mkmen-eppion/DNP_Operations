// app/approve/page.tsx
export default async function ApprovePage({
  searchParams,
}: {
  searchParams: { reply: string; resume: string };
}) {
  const { reply, resume } = await searchParams;

  const labels: Record<string, { emoji: string; text: string; color: string }> = {
    '1': { emoji: '✅', text: 'Approved! Publishing now...', color: '#22c55e' },
    '2': { emoji: '❌', text: 'Rejected. Status updated.',  color: '#ef4444' },
    '3': { emoji: '✏️', text: 'Edit mode activated.',       color: '#f59e0b' },
  };

  const action = labels[reply] || { emoji: '⚠️', text: 'Unknown action', color: '#6b7280' };

  // Fire and forget — don't await, don't block the page render
  fetch(`${decodeURIComponent(resume)}?reply=${reply}`).catch(() => {});

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh',
      fontFamily: 'Georgia, serif', background: '#1a1a2e', color: '#ffffff',
    }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>{action.emoji}</div>
      <h1 style={{ color: action.color, fontSize: '24px', margin: 0 }}>{action.text}</h1>
      <p style={{ color: '#c9a84c', marginTop: '16px', fontSize: '14px' }}>
        DPN Global · Property Intelligence
      </p>
      <p style={{ color: '#666', marginTop: '8px', fontSize: '12px' }}>
        You can close this window.
      </p>
    </div>
  );
}