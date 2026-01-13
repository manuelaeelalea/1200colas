import { useState } from "react"
import { supabase } from "./supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit() {
    setLoading(true)
    setErrorMessage("")

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setErrorMessage(error.message)
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) {
        setErrorMessage(error.message)
      } else if (data.user) {
        const { error: insertError } = await supabase
          .from("users")
          .insert({ id: data.user.id, name })
        if (insertError) setErrorMessage(insertError.message)
      }
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: 20, maxWidth: 300 }}>
      <h2>{isLogin ? "Login" : "Cadastro"}</h2>

      {!isLogin && (
        <input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
      </button>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <p
        style={{ cursor: "pointer", marginTop: 10 }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Criar conta" : "Já tenho conta"}
      </p>
    </div>
  )
}
