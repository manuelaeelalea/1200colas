import './App.css'
import { useAuth } from "./useAuth"
import Login from "./Login"
import { useEffect, useState } from "react"
import { supabase } from "./supabase"


function App() {
  const { user, loading } = useAuth()
  const [consumos, setConsumos] = useState([])
  const [groups, setGroups] = useState([])
  const [users, setUsers] = useState([])
  const [ml, setMl] = useState("")
  const [packageType, setPackageType] = useState("lata")
  const [flavor, setFlavor] = useState("cola")
  const [selectedGroup, setSelectedGroup] = useState(null)

  // 🔹 carregar grupos
  useEffect(() => {
    async function loadGroups() {
      const { data, error } = await supabase.from("groups").select("*")
      if (!error && data.length) {
        setGroups(data)
        setSelectedGroup(data[0])
      }
    }
    loadGroups()
  }, [])

  // 🔹 carregar usuários
  useEffect(() => {
    async function loadUsers() {
      const { data } = await supabase.from("users").select("id, name")
      setUsers(data || [])
    }
    loadUsers()
  }, [])

  // 🔹 carregar consumos
  useEffect(() => {
    async function carregarConsumos() {
      const { data } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false })
      setConsumos(data || [])
    }
    carregarConsumos()
  }, [])

  // 🔹 salvar consumo
  async function saveEntry() {
    if (!ml || !selectedGroup) return
    const { data, error } = await supabase.from("entries").insert([
      {
        user_id: user.id,
        group_id: selectedGroup.id,
        ml: Number(ml),
        package: packageType,
        flavor
      }
    ])
    if (!error) {
      setConsumos([data[0], ...consumos])
      setMl("")
    }
  }

  // 🔹 estados derivados
  const consumosDoGrupo = consumos.filter(c => c.group_id === selectedGroup?.id)
  const totalConsumido = consumosDoGrupo.length
  const totalMl = consumosDoGrupo.reduce((acc, c) => acc + c.ml, 0)
  const progresso = selectedGroup
    ? Math.min((totalConsumido / selectedGroup.goal_units) * 100, 100)
    : 0

  function calcularRanking() {
    const ranking = {}
    consumosDoGrupo.forEach(c => {
      ranking[c.user_id] = (ranking[c.user_id] || 0) + 1
    })
    return Object.entries(ranking).sort((a, b) => b[1] - a[1])
  }

  function nomeDoUsuario(userId) {
    const u = users.find(u => u.id === userId)
    return u ? u.name : "Desconhecido"
  }

  const packageIcons = { lata: "🥫", garrafa: "🍾", copo: "🥤" }
  const flavorColors = { cola: "#e53935", limão: "#cddc39" }

  if (loading) return <p>Carregando...</p>
  if (!user) return <Login />

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">1200 Colas</h1>
        <div className="user-greeting">Olá, {user.email}</div>
        <button className="logout" onClick={() => supabase.auth.signOut()}>
          🚪 Sair
        </button>
      </div>

      <h2 className="group-title">{selectedGroup?.name}</h2>

      <div className="input-row">
        <input
          type="number"
          placeholder="Quantidade (ml)"
          value={ml}
          onChange={e => setMl(e.target.value)}
          className="input"
        />

        <select
          value={packageType}
          onChange={e => setPackageType(e.target.value)}
          className="select"
        >
          <option value="lata">Lata 🥫</option>
          <option value="garrafa">Garrafa 🍾</option>
          <option value="copo">Copo 🥤</option>
        </select>

        <select
          value={flavor}
          onChange={e => setFlavor(e.target.value)}
          className="select"
        >
          <option value="cola">Cola 🥤</option>
          <option value="limão">Limão 🍋</option>
        </select>

        <button className="btn" onClick={saveEntry}>
          Registrar
        </button>
      </div>

      <h3>Progresso (Unidades)</h3>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progresso}%` }} />
      </div>
      <p>{totalConsumido} / {selectedGroup?.goal_units} unidades</p>

      <h3>Total consumido (ml)</h3>
      <div className="progress-bar total-ml">
        <div
          className="progress"
          style={{ width: `${Math.min((totalMl / (selectedGroup?.goal_units*330)) * 100, 100)}%` }}
        />
      </div>
      <p>{totalMl} ml</p>

      <h3>Ranking</h3>
      <ol>
        {calcularRanking().map(([userId, total]) => (
          <li key={userId}>
            {nomeDoUsuario(userId)} — {total}
          </li>
        ))}
      </ol>

      <h3>Histórico</h3>
      <ul>
        {consumosDoGrupo.map(c => (
          <li key={c.id} style={{ color: flavorColors[c.flavor] || "#333" }}>
            {packageIcons[c.package]} {c.flavor} • {c.ml} ml
          </li>
        ))}
      </ul>

      <footer>
        © 2025 Manu Régia Joguinhos e Desocupações
      </footer>
    </div>
  )
}

export default App
