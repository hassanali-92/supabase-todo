import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const App = () => {
  const [todo, setTodo] = useState("");
  const [todolist, setTodolist] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [emptyText, setEmptyText] = useState("");

  const fullEmptyText = "  No Tasks Yet..."; // 👈 Undefined fix

  // ─────────── FETCH TODOS ───────────
  const fetchData = async () => {
    const { data } = await supabase.from('todo-app').select("*");
    if (data) setTodolist(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // ─────────── EMPTY STATE TYPING EFFECT ───────────
  useEffect(() => {
    if (!loading && todolist.length === 0) {
      let i = 0;
      setEmptyText("");

      const timer = setInterval(() => {
        if (i < fullEmptyText.length) {
          setEmptyText(prev => prev + (fullEmptyText[i] ?? "")); // 👈 No more undefined
          i++;
        } else clearInterval(timer);
      }, 100);

      return () => clearInterval(timer);
    }
  }, [loading, todolist]);

  // ─────────── ADD ───────────
  const addData = async () => {
    if (!todo.trim()) return alert("Write something first!");

    setLoading(true);
    const { data } = await supabase
      .from('todo-app')
      .insert([{ title: todo, iscompleted: false }])
      .select();

    setTodolist(prev => [...prev, data[0]]);
    setTodo("");
    setLoading(false);
  };

  // ─────────── UPDATE ───────────
  const updateData = async () => {
    if (!editText.trim()) return alert("Cannot be empty");

    setLoading(true);
    await supabase.from("todo-app").update({ title: editText }).eq("id", editId);

    setTodolist(prev => prev.map(i => i.id === editId ? { ...i, title: editText } : i));
    setEditId(null);
    setEditText("");
    setLoading(false);
  };

  // ─────────── DELETE ───────────
  const del = async (id) => {
    setLoading(true);
    await supabase.from("todo-app").delete().eq("id", id);
    setTodolist(prev => prev.filter(i => i.id !== id));
    setLoading(false);
  };

  // ─────────── COMPLETE TOGGLE ───────────
  const toggleComplete = async (item) => {
    setLoading(true);
    await supabase.from("todo-app")
      .update({ iscompleted: !item.iscompleted })
      .eq("id", item.id);

    setTodolist(prev =>
      prev.map(i => i.id === item.id ? { ...i, iscompleted: !i.iscompleted } : i)
    );

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white">

      <div className="w-full max-w-xl bg-gradient-to-tr from-black/80 to-black/50 border border-blue-700 shadow-[0_0_30px_#1e3a8a] 
        rounded-2xl p-6 backdrop-blur-xl mt-12">

        <h1 className="text-4xl font-bold text-center mb-8 text-blue-400 drop-shadow-[0_0_15px_#3b82f6] animate-pulse flex items-center justify-center gap-2">
          ⚡ Todo Manager
        </h1>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Type a new task..."
            className="flex-1 bg-black/60 border border-blue-700 text-white px-4 py-2 rounded-xl 
              focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400 transition-all hover:ring-blue-400"
          />
          <button
            onClick={addData}
            disabled={loading}
            className={`px-5 py-2 rounded-xl font-semibold transition-all shadow-[0_0_10px_#3b82f6]
              ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 hover:scale-105"}`}>
            {loading ? "Wait..." : "Add +"}
          </button>
        </div>

        {/* Loader → Empty → List */}
        {loading ? (

          <div className="flex justify-center my-6">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

        ) : todolist.length === 0 ? (

          <div className="flex flex-col items-center py-10 text-gray-400">
            <svg className="w-20 h-20 mb-4 text-blue-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h5l2 2h5a2 2 0 012 2v10a2 2 0 01-2 2z" />
            </svg>

            <p className="text-xl font-semibold tracking-widest">{emptyText}<span className="animate-blink">|</span></p>
          </div>

        ) : (

          <ul className="space-y-3 mt-3">
            {todolist.map(item => (
              <li key={item.id}
                className={`flex justify-between items-center p-3 rounded-xl border border-blue-700 
                  hover:shadow-[0_0_20px_#1e40af] transition-all bg-black/50
                  ${item.iscompleted ? "line-through text-gray-400" : ""}`}>

                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={item.iscompleted} onChange={() => toggleComplete(item)}
                    className="w-5 h-5 accent-blue-500" />

                  {editId === item.id ? (
                    <input value={editText} onChange={(e) => setEditText(e.target.value)}
                      className="bg-black/60 border border-blue-500 px-2 py-1 rounded text-white w-64 focus:ring-2 focus:ring-blue-400" />
                  ) : (
                    <span className="text-lg">{item.title}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {editId === item.id ? (
                    <button onClick={updateData} className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded">Save</button>
                  ) : (
                    <button onClick={() => { setEditId(item.id); setEditText(item.title) }}
                      className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded">Edit</button>
                  )}

                  <button onClick={() => del(item.id)}
                    className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded">Del</button>
                </div>

              </li>
            ))}
          </ul>
        )}

      </div>

      <style>{`
        .animate-blink { animation: blink .9s infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}

export default App;
