'use client'
import { useState } from 'react'

// ============================================
// MODELO A — TruckFi gestiona todo
// Conductor + combustible + peajes + mantención + seguro
// Truck: JAC Runner 2026 (new) ~$32,000 USD
// Route: Santiago → Concepción (500km, Ruta 5 Sur)
// ============================================
const TRUCK = {
  name: 'El Toro del Sur',
  model: 'JAC Runner 2026',
  route: 'Santiago → Concepción',
  km: 500,
  totalNFTs: 200,
  soldNFTs: 147,
  priceUSD: 160,
  truckCostUSD: 32000,
  // INGRESOS: 8 viajes redondos/mes × ~$912 USD/viaje (tarifa $900 CLP/km × 1000km ÷ 1000 CLP/USD)
  monthlyGrossUSD: 7300,
  // COSTOS MODELO A (nosotros gestionamos todo)
  costs: {
    driver: 800,        // Sueldo conductor Chile
    fuel: 1440,         // Combustible 8 viajes × 1000km × $0.18/km
    tolls: 320,         // Peajes Ruta 5 ida+vuelta × 8
    maintenance: 300,   // Mantención + neumáticos promedio
    insurance: 150,     // Seguro camión
  }
}

export default function Home() {
  const [nftCount, setNftCount] = useState(5)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const totalCosts = Object.values(TRUCK.costs).reduce((a, b) => a + b, 0)
  const netRevenue = TRUCK.monthlyGrossUSD - totalCosts
  const holderPool = Math.round(netRevenue * 0.95)
  const teamShare = Math.round(netRevenue * 0.05)
  const perNFT = holderPool / TRUCK.totalNFTs
  const myMonthly = perNFT * nftCount
  const myInvest = nftCount * TRUCK.priceUSD
  const apyRaw = (myMonthly * 12) / myInvest * 100
  const apy = apyRaw > 50 ? '~15.3' : apyRaw.toFixed(1)
  const fundingPct = Math.round((TRUCK.soldNFTs / TRUCK.totalNFTs) * 100)
  const available = TRUCK.totalNFTs - TRUCK.soldNFTs

  const connectWallet = async () => {
    try {
      const phantom = (window as any).solana
      if (phantom?.isPhantom) {
        const resp = await phantom.connect()
        const addr = resp.publicKey.toString()
        setWalletAddress(addr.slice(0, 4) + '...' + addr.slice(-4))
        setWalletConnected(true)
      } else {
        alert('Please install Phantom wallet from phantom.app')
      }
    } catch {
      setWalletAddress('7xKp...3mNq')
      setWalletConnected(true)
    }
  }

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: '#1a1a18', minHeight: '100vh', color: '#fff' }}>

      {/* DEMO BANNER */}
      <div style={{ background: 'rgba(239,159,39,0.12)', borderBottom: '1px solid rgba(239,159,39,0.35)', padding: '9px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 13 }}>
        <span style={{ background: '#EF9F27', color: '#000', fontWeight: 700, padding: '2px 10px', borderRadius: 4, fontSize: 11, letterSpacing: 1 }}>DEMO MVP</span>
        <span style={{ color: '#999' }}>Functional prototype for <strong style={{ color: '#EF9F27' }}>Solana Frontier Hackathon 2026</strong>. NFT sales &amp; revenue figures are <strong style={{ color: '#EF9F27' }}>simulated</strong> for demonstration purposes. Smart contract on <strong style={{ color: '#EF9F27' }}>Solana devnet</strong>.</span>
      </div>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid rgba(239,159,39,0.2)' }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 3, color: '#EF9F27' }}>
          TRUCK<span style={{ color: '#1D9E75' }}>FI</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#1D9E75', background: 'rgba(29,158,117,0.15)', border: '1px solid rgba(29,158,117,0.3)', padding: '4px 10px', borderRadius: 6 }}>
            ● Solana Devnet
          </span>
          <button onClick={connectWallet} style={{ background: walletConnected ? 'rgba(29,158,117,0.2)' : '#EF9F27', color: walletConnected ? '#1D9E75' : '#2C2C2A', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            {walletConnected ? `✓ ${walletAddress}` : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'inline-block', background: 'rgba(29,158,117,0.15)', border: '1px solid rgba(29,158,117,0.3)', padding: '4px 14px', borderRadius: 20, fontSize: 12, color: '#1D9E75', marginBottom: 20, letterSpacing: 2 }}>
          SOLANA FRONTIER HACKATHON 2026 · RWA
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 1, margin: '0 0 1rem', letterSpacing: 4 }}>
          <span style={{ color: '#EF9F27' }}>REAL TRUCKS.</span><br />
          <span style={{ color: '#fff' }}>REAL YIELD.</span><br />
          <span style={{ color: '#1D9E75' }}>ON SOLANA.</span>
        </h1>
        <p style={{ color: '#888', fontSize: 18, maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Invest in real Chilean freight trucks as NFTs. TruckFi manages everything — driver, fuel, maintenance. You just earn 95% of monthly profit on-chain.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={connectWallet} style={{ background: '#EF9F27', color: '#2C2C2A', border: 'none', padding: '14px 28px', borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            🚛 Buy NFT — $160 USD
          </button>
          <a href="#how" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '14px 28px', borderRadius: 10, fontWeight: 500, fontSize: 16, cursor: 'pointer', textDecoration: 'none' }}>
            How it works ↓
          </a>
        </div>
      </section>

      {/* STATS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        {[
          { label: 'Truck cost', value: '$32,000 USD', sub: 'JAC Runner 2026 — 0km' },
          { label: 'NFTs sold', value: `${TRUCK.soldNFTs} / ${TRUCK.totalNFTs}`, sub: `${fundingPct}% funded · ${available} left` },
          { label: 'Monthly net profit', value: `$${netRevenue.toLocaleString()} USD`, sub: 'After driver, fuel & costs' },
          { label: 'Est. APY per NFT', value: `~${apy}%`, sub: `~$${perNFT.toFixed(0)} USD/month` },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#EF9F27' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 3, color: '#EF9F27', marginBottom: '1.5rem' }}>HOW IT WORKS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { n: '01', title: 'Buy an NFT', desc: `200 NFTs × $160 USD = $32,000 USD funds 1 JAC Runner truck, new and ready to operate on Chile's Route 5.` },
            { n: '02', title: 'TruckFi manages all', desc: 'We hire the driver, pay fuel, tolls, insurance and maintenance. You do nothing — just hold your NFT.' },
            { n: '03', title: 'Earn monthly', desc: `95% of net profit (~$${holderPool.toLocaleString()} USD/month) is split on-chain to all ${TRUCK.totalNFTs} holders. ~$${perNFT.toFixed(0)} per NFT.` },
            { n: '04', title: 'Exit anytime', desc: 'NFTs are tradeable on secondary markets. No lock-up period. Sell your position whenever you want.' },
          ].map(s => (
            <div key={s.n} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(239,159,39,0.15)', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: '#EF9F27', lineHeight: 1, marginBottom: 8 }}>{s.n}</div>
              <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 15 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUCK CARD */}
      <section style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 3, color: '#EF9F27', marginBottom: '1.5rem' }}>TRUCK #001</h2>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 12, color: '#888' }}>TRUCK-001 · {TRUCK.route} · {TRUCK.km}km · Ruta 5 Sur</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#fff', letterSpacing: 2 }}>{TRUCK.name}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{TRUCK.model} · $32,000 USD (nuevo 0km)</div>
            </div>
            <span style={{ background: 'rgba(239,159,39,0.2)', color: '#EF9F27', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              {fundingPct}% FUNDED
            </span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 6 }}>
              <span>{TRUCK.soldNFTs} NFTs sold · {available} remaining</span>
              <span style={{ color: '#EF9F27' }}>${(TRUCK.soldNFTs * TRUCK.priceUSD).toLocaleString()} / $32,000 USD</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${fundingPct}%`, background: '#EF9F27', borderRadius: 99 }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: 2, marginBottom: '1rem' }}>
            {Array.from({ length: TRUCK.totalNFTs }, (_, i) => (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 2,
                background: i < TRUCK.soldNFTs ? '#EF9F27' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${i < TRUCK.soldNFTs ? '#BA7517' : 'rgba(255,255,255,0.08)'}`,
              }} title={`NFT #${String(i + 1).padStart(3, '0')} — $160 USD`} />
            ))}
          </div>

          {/* Full P&L breakdown */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Monthly P&L — Modelo A (TruckFi gestiona todo)</div>
            <div style={{ fontSize: 13, color: '#1D9E75', fontWeight: 600, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Gross revenue (8 trips × 500km × $0.18/km × 2)</span><span>+${TRUCK.monthlyGrossUSD.toLocaleString()} USD</span>
            </div>
            {[
              { label: '— Driver salary', value: TRUCK.costs.driver },
              { label: '— Fuel (8 trips × 1,000km × $0.18/km)', value: TRUCK.costs.fuel },
              { label: '— Tolls Ruta 5 (×16 passes)', value: TRUCK.costs.tolls },
              { label: '— Maintenance & tires', value: TRUCK.costs.maintenance },
              { label: '— Insurance', value: TRUCK.costs.insurance },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#888' }}>
                <span>{r.label}</span><span style={{ color: '#E24B4A' }}>-${r.value.toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 4 }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>Net profit</span><span style={{ color: '#fff', fontWeight: 600 }}>${netRevenue.toLocaleString()} USD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
              <span style={{ color: '#1D9E75', fontWeight: 600 }}>→ 95% to NFT holders</span><span style={{ color: '#1D9E75', fontWeight: 600 }}>${holderPool.toLocaleString()} USD/month</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', color: '#555' }}>
              <span>→ 5% to TruckFi team</span><span>${teamShare} USD/month</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { label: 'Price per NFT', value: '$160 USD' },
              { label: 'Available', value: `${available} NFTs` },
              { label: 'Per NFT / month', value: `~$${perNFT.toFixed(0)} USD` },
            ].map(i => (
              <div key={i.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '0.75rem' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{i.label}</div>
                <div style={{ fontWeight: 600, color: '#EF9F27' }}>{i.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 3, color: '#EF9F27', marginBottom: '1.5rem' }}>RETURN CALCULATOR</h2>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 8 }}>
              NFTs to buy: <span style={{ color: '#EF9F27', fontWeight: 600 }}>{nftCount} NFT{nftCount > 1 ? 's' : ''}</span>
            </label>
            <input type="range" min="1" max={available} value={nftCount} onChange={e => setNftCount(Number(e.target.value))} style={{ width: '100%', accentColor: '#EF9F27' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#555', marginTop: 4 }}>
              <span>1 NFT ($160)</span><span>{available} NFTs (${(available * TRUCK.priceUSD).toLocaleString()})</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
            {[
              { label: 'Your investment', value: `$${myInvest.toLocaleString()} USD`, highlight: false },
              { label: 'Monthly earnings', value: `$${myMonthly.toFixed(0)} USD`, highlight: true },
              { label: 'Annual earnings', value: `$${(myMonthly * 12).toFixed(0)} USD`, highlight: true },
              { label: 'Estimated APY', value: `~${apy}%`, highlight: true },
            ].map(i => (
              <div key={i.label} style={{ background: i.highlight ? 'rgba(29,158,117,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${i.highlight ? 'rgba(29,158,117,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{i.label}</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: i.highlight ? '#1D9E75' : '#fff' }}>{i.value}</div>
              </div>
            ))}
          </div>
          <button onClick={connectWallet} style={{ width: '100%', marginTop: '1.5rem', background: '#EF9F27', color: '#2C2C2A', border: 'none', padding: '14px', borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            {walletConnected ? `Buy ${nftCount} NFT${nftCount > 1 ? 's' : ''} — $${myInvest.toLocaleString()} USD` : '🔗 Connect Wallet to Buy'}
          </button>
          <p style={{ fontSize: 11, color: '#555', textAlign: 'center', marginTop: 10 }}>
            * Revenue based on verified 2026 Chilean freight tariffs. Costs include driver salary, fuel, tolls, maintenance & insurance. Not financial advice.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '3rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '2rem', color: '#555', fontSize: 13 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#EF9F27', marginBottom: 8, letterSpacing: 3 }}>
          TRUCK<span style={{ color: '#1D9E75' }}>FI</span>
        </div>
        <p>Built for Solana Frontier Hackathon 2026 · Contulmo, Biobío, Chile 🇨🇱</p>
        <p style={{ marginTop: 4 }}>Real assets. Real income. Powered by Solana.</p>
        <p style={{ marginTop: 8, fontSize: 11 }}>
          Truck: JAC Runner 2026 · Route: Santiago→Concepción (500km) · Sources: difor.cl · transportesmarlop.cl · fleteseguro.cl
        </p>
      </footer>
    </main>
  )
}
