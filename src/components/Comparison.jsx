export default function Comparison() {
  const rows = [
    { feature: 'State Management', jwt: 'Stateless — token contains all data', session: 'Stateful — session stored on server' },
    { feature: 'Storage', jwt: 'Client-side (cookie, localStorage)', session: 'Server-side (memory, Redis, DB)' },
    { feature: 'Scalability', jwt: 'Scales easily across servers', session: 'Needs shared session store' },
    { feature: 'Mobile-Friendly', jwt: 'Yes — works with any client', session: 'Harder — cookie-based by default' },
    { feature: 'Revocation', jwt: 'Difficult — must wait for expiry', session: 'Easy — delete from store' },
    { feature: 'Size per Request', jwt: 'Larger — full token each time', session: 'Smaller — just a session ID' },
  ];

  return (
    <div className="comparison">
      <h2 className="comparison__title">
        JWT <span className="text-gradient">vs</span> Session Auth
      </h2>
      <p className="comparison__subtitle">How do these two authentication strategies compare?</p>
      <div className="comparison__table-wrap">
        <table className="comparison__table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>
                <span className="comparison__badge comparison__badge--jwt">JWT</span>
              </th>
              <th>
                <span className="comparison__badge comparison__badge--session">Session</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="comparison__feature">{r.feature}</td>
                <td>{r.jwt}</td>
                <td>{r.session}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
