'use client';
import { useState } from 'react';
export default function Counter() {
    const [count, setCount] = useState(0);
    return (<div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', width: 'fit-content' }}>
        <p>Aprecieri: <strong>{count}</strong> 👍</p>
        <button style={{ padding: '8px 14px', cursor: 'pointer', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px' }} onClick={() => setCount(count + 1)}> Apasă pentru Like!</button>
        <button style={{ padding: '8px 20px', cursor: 'pointer', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px' }} onClick={() => setCount(count - 1)}>Scade valoarea like-ului</button>
        <button style={{ padding: '8px 26px', cursor: 'pointer', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px' }} onClick={() => setCount(0)}>Resetare</button>
    </div>)
}