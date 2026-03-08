import React, { useState } from 'react';

const styles = {
  wrapper: "relative min-h-screen w-full bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0] flex items-center justify-center p-4",
  backgroundArt: "absolute inset-0 pointer-events-none opacity-20",
  card: "relative z-10 bg-white rounded-[40px] md:rounded-[60px] shadow-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden min-h-[550px]",
  brandSide: "flex-1 flex flex-col items-center justify-center p-10 text-center bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100",
  title: "text-3xl md:text-5xl font-extrabold text-gray-800 mb-8 leading-tight",
  brandName: "text-4xl md:text-5xl font-black text-purple-600",
  hashtag: "text-gray-400 font-medium tracking-widest uppercase text-xs mt-4",
  formSide: "flex-1 flex flex-col justify-center p-10 md:p-16",
  inputGroup: "space-y-6",
  label: "text-gray-700 font-semibold mb-2 ml-2 text-lg block",
  input: "w-full bg-gray-100 border-none rounded-2xl px-6 py-4 text-gray-700 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-200",
  button: "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-bold py-3 px-12 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
};

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/login/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      const result = await response.json();

      if (response.ok) {
        document.cookie = "isLoggedIn=true; path=/; max-age=30";
        localStorage.setItem('user', JSON.stringify(result.data));
        window.location.href = "/admin/estadisticas";
      } else {
        alert(result.message || "Contraseña o correo incorrectos.");
      }
    } catch (error) {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.backgroundArt}>
        <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none">
          <path d="M0 800c200-100 400 100 600 0s400 100 400 0" stroke="white" strokeWidth="2" />
          <path d="M-100 850c250-100 450 100 650 0s550 100 550 0" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      <main className={styles.card}>
        <section className={styles.brandSide}>
          <h1 className={styles.title}>Panel de <br/> Administración</h1>
          <div className={styles.brandName}>RED VIVA ✌️</div>
          <p className={styles.hashtag}>#ConectarSinViolencia</p>
        </section>

        <section className={styles.formSide}>
          <form className={styles.inputGroup} onSubmit={handleSubmit}>
            <div>
              <label className={styles.label}>Correo Electrónico</label>
              <input 
                type="email" 
                className={styles.input} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div>
              <label className={styles.label}>Contraseña</label>
              <input 
                type="password" 
                className={styles.input} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'Cargando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};