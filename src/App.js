import logo from './logo.svg';
import './App.css';
import React from 'react';
import MicStreamer from './components/MicStreamer';

export default function App() {
  return (
    <main className="container">
      <h1>마이크 테스트</h1>
      <MicStreamer />
    </main>
  );
}